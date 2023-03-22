import rollupJson from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import * as path from 'path';
import * as rollup from 'rollup';
import { OutputFileCache } from '../ng-package/nodes';
import { readCacheEntry, saveCacheEntry } from '../utils/cache';
import * as log from '../utils/log';
import { fileLoaderPlugin } from './file-loader-plugin';

/**
 * Options used in `ng-packagr` for writing flat bundle files.
 *
 * These options are passed through to rollup.
 */
export interface RollupOptions {
  moduleName: string;
  entry: string;
  entryName: string;
  dir: string;
  sourceRoot: string;
  cache?: rollup.RollupCache;
  cacheDirectory?: string | false;
  fileCache: OutputFileCache;
  cacheKey: string;
}

/** Runs rollup over the given entry file, writes a bundle file. */
export async function rollupBundleFile(
  opts: RollupOptions,
): Promise<{ cache: rollup.RollupCache; files: (rollup.OutputChunk | rollup.OutputAsset)[] }> {
  log.debug(`rollup (v${rollup.VERSION}) ${opts.entry} to ${opts.dir}`);

  const cacheDirectory = opts.cacheDirectory;

  // Create the bundle
  const bundle = await rollup.rollup({
    context: 'this',
    external: moduleId => isExternalDependency(moduleId),
    cache: opts.cache ?? (cacheDirectory ? await readCacheEntry(cacheDirectory, opts.cacheKey) : undefined),
    input: opts.entry,
    plugins: [nodeResolve(), rollupJson(), fileLoaderPlugin(opts.fileCache)],
    onwarn: warning => {
      switch (warning.code) {
        case 'CIRCULAR_DEPENDENCY':
        case 'UNUSED_EXTERNAL_IMPORT':
        case 'THIS_IS_UNDEFINED':
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
    dir: opts.dir,
    inlineDynamicImports: false,
    chunkFileNames: opts.entryName + '-[name]-[hash].mjs',
    entryFileNames: opts.entryName + '.mjs',
    banner: '',
    sourcemap: true,
  });

  if (cacheDirectory) {
    await saveCacheEntry(cacheDirectory, opts.cacheKey, JSON.stringify(bundle.cache));
  }

  // Close the bundle to let plugins clean up their external processes or services
  await bundle.close();

  return {
    files: output.output,
    cache: bundle.cache,
  };
}

function isExternalDependency(moduleId: string): boolean {
  // more information about why we don't check for 'node_modules' path
  // https://github.com/rollup/rollup-plugin-node-resolve/issues/110#issuecomment-350353632
  if (moduleId.startsWith('.') || moduleId.startsWith('/') || path.isAbsolute(moduleId)) {
    // if it's either 'absolute', marked to embed, starts with a '.' or '/' or is the umd bundle and is tslib
    return false;
  }

  return true;
}
