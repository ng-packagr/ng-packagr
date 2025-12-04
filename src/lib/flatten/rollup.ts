import rollupJson from '@rollup/plugin-json';
import * as path from 'path';
import type { InputPluginOption, OutputAsset, OutputChunk, RollupCache } from 'rollup';
import { dts } from 'rollup-plugin-dts';
import { OutputFileCache } from '../ng-package/nodes';
import { readCacheEntry, saveCacheEntry } from '../utils/cache';
import * as log from '../utils/log';
import { fileLoaderPlugin } from './file-loader-plugin';

interface RollupCommonOptions {
  moduleName: string;
  entry: string;
  entryName: string;
  cache?: RollupCache;
  cacheDirectory?: string | false;
  fileCache: OutputFileCache;
  cacheKey: string;
  sourcemap: boolean;
}

interface RollupOptionsDir extends RollupCommonOptions {
  dir: string;
}

interface RollupOptionsFile extends RollupCommonOptions {
  file: string;
}

/**
 * Options used in `ng-packagr` for writing flat bundle files.
 *
 * These options are passed through to rollup.
 */
export type RollupOptions = RollupOptionsDir | RollupOptionsFile;

let rollup: typeof import('rollup') | undefined;

/** Runs rollup over the given entry file, writes a bundle file. */
export async function rollupBundleFile(
  opts: RollupOptions,
): Promise<{ cache: RollupCache; files: (OutputChunk | OutputAsset)[] }> {
  await ensureRollup();

  log.debug(`rollup (v${rollup.VERSION}) ${opts.entry} to ${opts.dir}`);
  const cacheDirectory = opts.cacheDirectory;
  const dtsMode = opts.entry.endsWith('.d.ts');
  let outExtension: string;
  let plugins: InputPluginOption[];

  if (dtsMode) {
    outExtension = '.d.ts';
    plugins = [fileLoaderPlugin(opts.fileCache, ['.d.ts', '/index.d.ts']), dts()];
  } else {
    outExtension = '.mjs';
    plugins = [fileLoaderPlugin(opts.fileCache, ['.js', '/index.js']), rollupJson()];
  }

  // Create the bundle
  const bundle = await rollup.rollup({
    context: 'this',
    external: moduleId => isExternalDependency(moduleId),
    cache: opts.cache ?? (cacheDirectory ? await readCacheEntry(cacheDirectory, opts.cacheKey) : undefined),
    input: opts.entry,
    plugins,
    onwarn: warning => {
      switch (warning.code) {
        case 'CIRCULAR_DEPENDENCY':
        case 'UNUSED_EXTERNAL_IMPORT':
        case 'THIS_IS_UNDEFINED':
        case 'EMPTY_BUNDLE':
          break;

        default:
          log.warn(warning.message);
          break;
      }
    },
    preserveSymlinks: true,
    // Disable treeshaking when generating bundles
    // see: https://github.com/angular/angular/pull/32069
    treeshake: false,
  });

  // Output the bundle to disk
  const output = await bundle.write({
    name: opts.moduleName,
    format: 'es',
    ...('dir' in opts ? { dir: opts.dir } : { file: opts.file }),
    inlineDynamicImports: false,
    hoistTransitiveImports: false,
    chunkFileNames: `${opts.entryName}-[name]-[hash]${outExtension}`,
    entryFileNames: opts.entryName + outExtension,
    banner: '',
    sourcemap: opts.sourcemap,
  });

  if (cacheDirectory) {
    await saveCacheEntry(cacheDirectory, opts.cacheKey, bundle.cache);
  }

  // Close the bundle to let plugins clean up their external processes or services
  await bundle.close();

  return {
    files: output.output.map(f => {
      /** The map contents are in an asset file type, which makes storing the map in the cache as redudant. */
      if (f.type === 'chunk') {
        f.map = null;
      }

      return f;
    }),
    cache: bundle.cache,
  };
}

async function ensureRollup(): Promise<void> {
  if (rollup) {
    return;
  }

  try {
    rollup = await import('rollup');
    log.debug(`rollup using native version.`);
  } catch {
    rollup = await import('@rollup/wasm-node');
    log.debug(`rollup using wasm version.`);
  }
}

function isExternalDependency(moduleId: string): boolean {
  // more information about why we don't check for 'node_modules' path
  // https://github.com/rollup/rollup-plugin-node-resolve/issues/110#issuecomment-350353632
  if (moduleId[0] === '.' || moduleId[0] === '/' || path.isAbsolute(moduleId)) {
    // if it's either 'absolute', marked to embed, starts with a '.' or '/' or is the umd bundle and is tslib
    return false;
  }

  return true;
}
