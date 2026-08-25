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
import { isAbsolute, join } from 'node:path';
import { ensureUnixPath } from '../utils/path';
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
  #activeBundlePromise?: Promise<BundleContextResult>;
  #disposed = false;
  #optionsFactory: BundlerOptionsFactory<BuildOptions & { metafile: true; write: false }>;
  #shouldCacheResult: boolean;
  #loadCache?: LoadResultCache;
  readonly watchFiles: Set<string> = new Set<string>();

  constructor(
    private workspaceRoot: string,
    private incremental: boolean,
    options: BuildOptions | BundlerOptionsFactory,
    private useContext = incremental,
    initialFilter?: ((initial: Readonly<InitialFileRecord>) => boolean) | LoadResultCache,
    sharedLoadCache?: LoadResultCache,
  ) {
    if (initialFilter && typeof initialFilter !== 'function') {
      this.#loadCache = initialFilter;
    } else {
      this.#loadCache = sharedLoadCache;
    }
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
  async bundle(force = false): Promise<BundleContextResult> {
    // Return existing result if present
    if (this.#esbuildResult) {
      return this.#esbuildResult;
    }

    if (!force && this.#activeBundlePromise !== undefined) {
      return this.#activeBundlePromise;
    }

    const bundlePromise = this.#performBundle().finally(() => {
      if (this.#activeBundlePromise === bundlePromise) {
        this.#activeBundlePromise = undefined;
      }
    });
    this.#activeBundlePromise = bundlePromise;

    const result = await bundlePromise;
    if (this.#shouldCacheResult) {
      this.#esbuildResult = result;
    }

    return result;
  }

  async #performBundle(): Promise<BundleContextResult> {
    // Create esbuild options if not present
    if (this.#esbuildOptions === undefined) {
      if (this.incremental && !this.#loadCache) {
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
      } else if (this.useContext) {
        // Create an incremental build context and perform the first build.
        // Context creation does not perform a build.
        const esbuildContext = await context(this.#esbuildOptions);
        if (this.#disposed) {
          await esbuildContext.dispose();
          throw new Error('BundlerContext was disposed during build.');
        }
        this.#esbuildContext = esbuildContext;
        result = await this.#esbuildContext.rebuild();
      } else {
        // For non-incremental builds, perform a single build
        if (this.#disposed) {
          throw new Error('BundlerContext was disposed during build.');
        }
        result = await build(this.#esbuildOptions);
        if (this.#disposed) {
          throw new Error('BundlerContext was disposed during build.');
        }
      }
    } catch (failure) {
      // Build failures will throw an exception which contains errors/warnings
      if (isEsBuildFailure(failure)) {
        this.#addErrorsToWatch(failure);
        this.#addLoadCacheFilesToWatch();

        return failure;
      } else {
        throw failure;
      }
    }

    // Update files that should be watched.
    // While this should technically not be linked to incremental mode, incremental is only
    // currently enabled with watch mode where watch files are needed.
    if (this.incremental) {
      // Add input files except virtual angular files which do not exist on disk
      for (const input of Object.keys(result.metafile.inputs)) {
        const isInternal = isInternalAngularFile(input) || isInternalBundlerFile(input);

        // Input file paths are always relative to the workspace root unless already absolute
        const normalizedAbsoluteInput = isAbsolute(input)
          ? ensureUnixPath(input)
          : ensureUnixPath(join(this.workspaceRoot, input));

        if (!isInternal) {
          this.watchFiles.add(normalizedAbsoluteInput);
        }

        if (this.#loadCache) {
          const cachedLoad = await (this.#loadCache.get(input) ??
            this.#loadCache.get(input.replace(';', ':')) ??
            this.#loadCache.get('file:' + normalizedAbsoluteInput));
          if (cachedLoad?.watchFiles) {
            for (const file of cachedLoad.watchFiles) {
              if (!isInternalAngularFile(file)) {
                this.watchFiles.add(
                  isAbsolute(file) ? ensureUnixPath(file) : ensureUnixPath(join(this.workspaceRoot, file)),
                );
              }
            }
          }
        }
      }
    }

    // Return if the build encountered any errors
    if (result.errors.length) {
      this.#addErrorsToWatch(result);
      this.#addLoadCacheFilesToWatch();

      return {
        errors: result.errors,
        warnings: result.warnings,
      };
    }

    // Return the successful build results
    return {
      errors: undefined,
      warnings: result.warnings,
      metafile: result.metafile,
      outputFiles: result.outputFiles as BuildOutputFile[],
    };
  }

  #addErrorsToWatch(result: BuildFailure | BuildResult): void {
    for (const error of result.errors) {
      const file = error.location?.file;
      if (file && !isInternalAngularFile(file)) {
        this.watchFiles.add(isAbsolute(file) ? ensureUnixPath(file) : ensureUnixPath(join(this.workspaceRoot, file)));
      }
      for (const note of error.notes ?? []) {
        const noteFile = note.location?.file;
        if (noteFile && !isInternalAngularFile(noteFile)) {
          this.watchFiles.add(
            isAbsolute(noteFile) ? ensureUnixPath(noteFile) : ensureUnixPath(join(this.workspaceRoot, noteFile)),
          );
        }
      }
    }
  }

  #addLoadCacheFilesToWatch(): void {
    if (this.incremental && this.#loadCache) {
      for (const file of this.#loadCache.watchFiles) {
        if (!isInternalAngularFile(file)) {
          this.watchFiles.add(isAbsolute(file) ? ensureUnixPath(file) : ensureUnixPath(join(this.workspaceRoot, file)));
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
  invalidate(files: Iterable<string> | ReadonlySet<string>): boolean {
    if (!this.incremental) {
      return false;
    }

    let candidateFiles: ReadonlySet<string>;
    if (files instanceof Set) {
      let isCandidateReady = true;
      for (const file of files) {
        if (
          file !== ensureUnixPath(file) ||
          (!isAbsolute(file) && !files.has(ensureUnixPath(join(this.workspaceRoot, file))))
        ) {
          isCandidateReady = false;
          break;
        }
      }

      if (isCandidateReady) {
        candidateFiles = files;
      } else {
        const normalizedFiles = new Set<string>();
        for (const file of files) {
          const normalized = ensureUnixPath(file);
          normalizedFiles.add(normalized);
          if (!isAbsolute(normalized)) {
            normalizedFiles.add(ensureUnixPath(join(this.workspaceRoot, normalized)));
          }
        }
        candidateFiles = normalizedFiles;
      }
    } else {
      const normalizedFiles = new Set<string>();
      for (const file of files) {
        const normalized = ensureUnixPath(file);
        normalizedFiles.add(normalized);
        if (!isAbsolute(normalized)) {
          normalizedFiles.add(ensureUnixPath(join(this.workspaceRoot, normalized)));
        }
      }
      candidateFiles = normalizedFiles;
    }

    let invalid = false;
    for (const file of candidateFiles) {
      if (this.#loadCache?.invalidate(file)) {
        invalid = true;
      }
    }

    if (!invalid) {
      if (this.watchFiles.size < candidateFiles.size) {
        for (const file of this.watchFiles) {
          if (candidateFiles.has(file)) {
            invalid = true;
            break;
          }
        }
      } else {
        for (const file of candidateFiles) {
          if (this.watchFiles.has(file)) {
            invalid = true;
            break;
          }
        }
      }
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
    this.#disposed = true;
    try {
      this.#esbuildOptions = undefined;
      this.#esbuildResult = undefined;
      this.#activeBundlePromise = undefined;
      this.#loadCache = undefined;
      await this.#esbuildContext?.dispose();
    } finally {
      this.#esbuildContext = undefined;
    }
  }
}

function isInternalAngularFile(file: string): boolean {
  return file.startsWith('angular:');
}

function isInternalBundlerFile(file: string): boolean {
  // Bundler virtual files such as "<define:???>" or "<runtime>"
  if (file[0] === '<' && file.at(-1) === '>') {
    return true;
  }

  // Any (disabled): path is a virtual esbuild entry that doesn't exist on disk
  if (file.includes('(disabled):')) {
    return true;
  }

  return false;
}
