import { Message, Metafile, OutputFile } from 'esbuild';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { ensureUnixPath } from '../utils/path';
import { BuildOutputFileType, BundleContextResult, BundlerContext } from './bundler-context';
import { MemoryCache } from './cache';
import { MemoryLoadResultCache } from './load-result-cache';
import { BundleStylesheetOptions, createStylesheetBundleOptions } from './stylesheets/bundle-options';
import { shutdownSassWorkerPool } from './stylesheets/sass-language';

export interface ComponentStylesheetResult {
  errors: Message[] | undefined;
  warnings: Message[];
  contents: string;
  outputFiles: OutputFile[];
  metafile: Metafile | undefined;
  referencedFiles: Set<string> | undefined;
}

/**
 * Bundles component stylesheets. A stylesheet can be either an inline stylesheet that
 * is contained within the Component's metadata definition or an external file referenced
 * from the Component's metadata definition.
 */
export class ComponentStylesheetBundler {
  readonly #fileContexts = new MemoryCache<BundlerContext>();
  readonly #inlineContexts = new MemoryCache<BundlerContext>();
  readonly #loadCache = new MemoryLoadResultCache();

  /**
   * @param options An object containing the stylesheet bundling options.
   * @param defaultInlineLanguage The default language to use for inline component styles.
   * @param incremental True if incremental watch mode is enabled.
   */
  constructor(
    private readonly options: BundleStylesheetOptions,
    private readonly defaultInlineLanguage: string,
    private readonly incremental: boolean,
  ) {}

  async bundleFile(entry: string): Promise<ComponentStylesheetResult> {
    entry = ensureUnixPath(entry);

    const bundlerContext = await this.#fileContexts.getOrCreate(entry, () => {
      return new BundlerContext(
        this.options.workspaceRoot,
        this.incremental,
        loadCache => {
          const buildOptions = createStylesheetBundleOptions(this.options, loadCache);

          buildOptions.entryPoints = [entry];

          return buildOptions;
        },
        /* useContext */ false,
        /* initialFilter */ undefined,
        this.#loadCache,
      );
    });

    return this.extractResult(await bundlerContext.bundle(), bundlerContext.watchFiles);
  }

  async bundleInline(
    data: string,
    filename: string,
    language: string = this.defaultInlineLanguage,
  ): Promise<ComponentStylesheetResult> {
    filename = ensureUnixPath(filename);

    // Use a hash of the inline stylesheet content to ensure a consistent identifier. External stylesheets will resolve
    // to the actual stylesheet file path.
    // TODO: Consider xxhash instead for hashing
    const id = createHash('sha256').update(data).digest('hex');
    const entry = [language, id, filename].join(';');

    const bundlerContext = await this.#inlineContexts.getOrCreate(entry, () => {
      const namespace = 'angular:styles/component';

      return new BundlerContext(
        this.options.workspaceRoot,
        this.incremental,
        loadCache => {
          const buildOptions = createStylesheetBundleOptions(this.options, loadCache, {
            [entry]: data,
          });
          buildOptions.entryPoints = [`${namespace};${entry}`];

          buildOptions.plugins.push({
            name: 'angular-component-styles',
            setup(build) {
              build.onResolve({ filter: /^angular:styles\/component;/ }, args => {
                if (args.kind !== 'entry-point') {
                  return null;
                }

                return {
                  path: entry,
                  namespace,
                };
              });
              build.onLoad({ filter: /^css;/, namespace }, () => {
                return {
                  contents: data,
                  loader: 'css',
                  resolveDir: path.dirname(filename),
                };
              });
            },
          });

          return buildOptions;
        },
        /* useContext */ false,
        /* initialFilter */ undefined,
        this.#loadCache,
      );
    });

    // Extract the result of the bundling from the output files
    return this.extractResult(await bundlerContext.bundle(), bundlerContext.watchFiles);
  }

  /**
   * Invalidates both file and inline based component style bundling state for a set of modified files.
   * @param files The group of files that have been modified
   * @returns An array of file based stylesheet entries if any were invalidated; otherwise, undefined.
   */
  invalidate(files: Iterable<string> | ReadonlySet<string>): string[] | undefined {
    if (!this.incremental) {
      return;
    }

    const normalizedFiles = new Set<string>();
    for (const file of files) {
      const normalized = ensureUnixPath(file);
      normalizedFiles.add(normalized);
      if (!path.isAbsolute(normalized)) {
        normalizedFiles.add(ensureUnixPath(path.join(this.options.workspaceRoot, normalized)));
      }
    }

    let entries: string[] | undefined;

    for (const [entry, bundler] of this.#fileContexts.entries()) {
      if (bundler.invalidate(normalizedFiles)) {
        entries ??= [];
        entries.push(entry);
      }
    }
    for (const [entry, bundler] of this.#inlineContexts.entries()) {
      // Entry is format: [language, id, filename].join(';')
      const firstSemi = entry.indexOf(';');
      const secondSemi = firstSemi !== -1 ? entry.indexOf(';', firstSemi + 1) : -1;
      const filename = secondSemi !== -1 ? entry.slice(secondSemi + 1) : '';
      if (filename && normalizedFiles.has(ensureUnixPath(filename))) {
        this.#inlineContexts.delete(entry);
        void bundler.dispose();
      } else {
        bundler.invalidate(normalizedFiles);
      }
    }

    return entries;
  }

  async dispose(): Promise<void> {
    const contexts = [...this.#fileContexts.values(), ...this.#inlineContexts.values()];
    this.#fileContexts.clear();
    this.#inlineContexts.clear();
    this.#loadCache.clear();

    await Promise.allSettled([shutdownSassWorkerPool(), ...contexts.map(context => context.dispose())]);
  }

  private extractResult(
    result: BundleContextResult,
    referencedFiles: Set<string> | undefined,
  ): ComponentStylesheetResult {
    let contents = '';
    let metafile;
    const outputFiles: OutputFile[] = [];

    if ('outputFiles' in result) {
      for (const outputFile of result.outputFiles) {
        const filename = path.basename(outputFile.path);

        if (outputFile.type === BuildOutputFileType.Media || filename.endsWith('.css.map')) {
          // The output files could also contain resources (images/fonts/etc.) that were referenced and the map files.

          // Clone the output file to avoid amending the original path which would causes problems during rebuild.
          const clonedOutputFile = outputFile.clone();

          // Needed for Bazel as otherwise the files will not be written in the correct place,
          // this is because esbuild will resolve the output file from the outdir which is currently set to `workspaceRoot` twice,
          // once in the stylesheet and the other in the application code bundler.
          // Ex: `../../../../../app.component.css.map`.
          clonedOutputFile.path = path.join(this.options.workspaceRoot, outputFile.path);

          outputFiles.push(clonedOutputFile);
        } else if (filename.endsWith('.css')) {
          contents = outputFile.text;
        } else {
          throw new Error(
            `Unexpected non CSS/Media file "${filename}" outputted during component stylesheet processing.`,
          );
        }
      }

      metafile = result.metafile;
    }

    return {
      errors: result.errors,
      warnings: result.warnings,
      contents,
      outputFiles,
      metafile,
      referencedFiles,
    };
  }
}
