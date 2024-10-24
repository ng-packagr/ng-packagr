import {
  BuildContext,
  BuildFailure,
  BuildOptions,
  BuildResult,
  Message,
  Metafile,
  OutputFile,
  build,
  context,
} from 'esbuild';
import { join } from 'node:path';
import { LoadResultCache, MemoryLoadResultCache } from './load-result-cache';

export type BundleContextResult =
  | { errors: Message[]; warnings: Message[] }
  | {
      errors: undefined;
      warnings: Message[];
      metafile: Metafile;
      outputFiles: BuildOutputFile[];
    };

export interface InitialFileRecord {
  entrypoint: boolean;
  name?: string;
  type: 'script' | 'style';
  external?: boolean;
  serverFile: boolean;
  depth: number;
}

export enum BuildOutputFileType {
  Browser,
  Media,
  ServerApplication,
  ServerRoot,
  Root,
}

export interface BuildOutputFile extends OutputFile {
  type: BuildOutputFileType;
  readonly size: number;
  clone: () => BuildOutputFile;
}

export type BundlerOptionsFactory<T extends BuildOptions = BuildOptions> = (
  loadCache: LoadResultCache | undefined,
) => T;

/**
 * Determines if an unknown value is an esbuild BuildFailure error object thrown by esbuild.
 * @param value A potential esbuild BuildFailure error object.
 * @returns `true` if the object is determined to be a BuildFailure object; otherwise, `false`.
 */
function isEsBuildFailure(value: unknown): value is BuildFailure {
  return !!value && typeof value === 'object' && 'errors' in value && 'warnings' in value;
}

export class BundlerContext {
  #esbuildContext?: BuildContext<{ metafile: true; write: false }>;
  #esbuildOptions?: BuildOptions & { metafile: true; write: false };
  #esbuildResult?: BundleContextResult;
  #optionsFactory: BundlerOptionsFactory<BuildOptions & { metafile: true; write: false }>;
  #shouldCacheResult: boolean;
  #loadCache?: MemoryLoadResultCache;
  readonly watchFiles = new Set<string>();

  constructor(
    private workspaceRoot: string,
    private incremental: boolean,
    options: BuildOptions | BundlerOptionsFactory,
  ) {
    // To cache the results an option factory is needed to capture the full set of dependencies
    this.#shouldCacheResult = incremental && typeof options === 'function';
    this.#optionsFactory = (...args) => {
      const baseOptions = typeof options === 'function' ? options(...args) : options;

      return {
        ...baseOptions,
        metafile: true,
        write: false,
      };
    };
  }

  /**
   * Executes the esbuild build function and normalizes the build result in the event of a
   * build failure that results in no output being generated.
   * All builds use the `write` option with a value of `false` to allow for the output files
   * build result array to be populated.
   *
   * @returns If output files are generated, the full esbuild BuildResult; if not, the
   * warnings and errors for the attempted build.
   */
  async bundle(): Promise<BundleContextResult> {
    // Return existing result if present
    if (this.#esbuildResult) {
      return this.#esbuildResult;
    }

    const result = await this.#performBundle();
    if (this.#shouldCacheResult) {
      this.#esbuildResult = result;
    }

    return result;
  }

  // eslint-disable-next-line max-lines-per-function
  async #performBundle(): Promise<BundleContextResult> {
    // Create esbuild options if not present
    if (this.#esbuildOptions === undefined) {
      if (this.incremental) {
        this.#loadCache = new MemoryLoadResultCache();
      }
      this.#esbuildOptions = this.#optionsFactory(this.#loadCache);
    }

    if (this.incremental) {
      this.watchFiles.clear();
    }

    let result: BuildResult<{ metafile: true; write: false }>;
    try {
      if (this.#esbuildContext) {
        // Rebuild using the existing incremental build context
        result = await this.#esbuildContext.rebuild();
      } else if (this.incremental) {
        // Create an incremental build context and perform the first build.
        // Context creation does not perform a build.
        this.#esbuildContext = await context(this.#esbuildOptions);
        result = await this.#esbuildContext.rebuild();
      } else {
        // For non-incremental builds, perform a single build
        result = await build(this.#esbuildOptions);
      }
    } catch (failure) {
      // Build failures will throw an exception which contains errors/warnings
      if (isEsBuildFailure(failure)) {
        this.#addErrorsToWatch(failure);

        return failure;
      } else {
        throw failure;
      }
    } finally {
      if (this.incremental) {
        // When incremental always add any files from the load result cache
        if (this.#loadCache) {
          for (const file of this.#loadCache.watchFiles) {
            if (!isInternalAngularFile(file)) {
              // watch files are fully resolved paths
              this.watchFiles.add(file);
            }
          }
        }
      }
    }

    // Update files that should be watched.
    // While this should technically not be linked to incremental mode, incremental is only
    // currently enabled with watch mode where watch files are needed.
    if (this.incremental) {
      // Add input files except virtual angular files which do not exist on disk
      for (const input of Object.keys(result.metafile.inputs)) {
        if (!isInternalAngularFile(input)) {
          // input file paths are always relative to the workspace root
          this.watchFiles.add(join(this.workspaceRoot, input));
        }
      }
    }

    // Return if the build encountered any errors
    if (result.errors.length) {
      this.#addErrorsToWatch(result);

      return {
        errors: result.errors,
        warnings: result.warnings,
      };
    }

    // Return the successful build results
    return {
      ...result,
      errors: undefined,
    };
  }

  #addErrorsToWatch(result: BuildFailure | BuildResult): void {
    for (const error of result.errors) {
      let file = error.location?.file;
      if (file && !isInternalAngularFile(file)) {
        this.watchFiles.add(join(this.workspaceRoot, file));
      }
      for (const note of error.notes) {
        file = note.location?.file;
        if (file && !isInternalAngularFile(file)) {
          this.watchFiles.add(join(this.workspaceRoot, file));
        }
      }
    }
  }

  /**
   * Invalidate a stored bundler result based on the previous watch files
   * and a list of changed files.
   * The context must be created with incremental mode enabled for results
   * to be stored.
   * @returns True, if the result was invalidated; False, otherwise.
   */
  invalidate(files: Iterable<string>): boolean {
    if (!this.incremental) {
      return false;
    }

    let invalid = false;
    for (const file of files) {
      if (this.#loadCache?.invalidate(file)) {
        invalid = true;
        continue;
      }

      invalid ||= this.watchFiles.has(file);
    }

    if (invalid) {
      this.#esbuildResult = undefined;
    }

    return invalid;
  }

  /**
   * Disposes incremental build resources present in the context.
   *
   * @returns A promise that resolves when disposal is complete.
   */
  async dispose(): Promise<void> {
    try {
      this.#esbuildOptions = undefined;
      this.#esbuildResult = undefined;
      this.#loadCache = undefined;
      await this.#esbuildContext?.dispose();
    } finally {
      this.#esbuildContext = undefined;
    }
  }
}

function isInternalAngularFile(file: string) {
  return file.startsWith('angular:');
}
