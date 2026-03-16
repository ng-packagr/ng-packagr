import * as path from 'path';
import type { OutputAsset, OutputChunk } from 'rolldown';
import { VERSION as ROLLDOWN_VERSION, rolldown } from 'rolldown';
import { dts } from 'rollup-plugin-dts';
import { OutputFileCache } from '../ng-package/nodes';
import * as log from '../utils/log';
import { fileLoaderPlugin } from './file-loader-plugin';

/**
 * Options used in `ng-packagr` for writing flat bundle files.
 *
 * These options are passed through to rolldown/rollup.
 */
export interface RollupOptions {
  moduleName: string;
  entry: string;
  entryName: string;
  dir: string;
  fileCache: OutputFileCache;
  cacheKey: string;
  sourcemap: boolean;
}

/** Handles common bundler warnings by suppressing known-harmless codes. */
function handleBundlerWarning(warning: { code?: string; message: string }): void {
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
}

/** Runs rolldown (JS) or rollup (DTS) over the given entry file, writes a bundle file. */
export async function rollupBundleFile(opts: RollupOptions): Promise<{ files: (OutputChunk | OutputAsset)[] }> {
  const dtsMode = opts.entry.endsWith('.d.ts');

  if (dtsMode) {
    return rollupDtsBundleFile(opts);
  }

  return rolldownJsBundleFile(opts);
}

/** Bundles JavaScript using Rolldown. */
async function rolldownJsBundleFile(opts: RollupOptions): Promise<{ files: (OutputChunk | OutputAsset)[] }> {
  log.debug(`rolldown (v${ROLLDOWN_VERSION}) ${opts.entry} to ${opts.dir}`);
  const jail = path.dirname(opts.entry);

  const bundle = await rolldown({
    external: (moduleId, parentId) => isExternalDependency(moduleId, parentId, jail),
    input: opts.entry,
    plugins: [fileLoaderPlugin(opts.fileCache, ['.js', '/index.js'])],
    onwarn: handleBundlerWarning,
    resolve: {
      symlinks: false,
    },
    // Disable treeshaking when generating bundles
    // see: https://github.com/angular/angular/pull/32069
    treeshake: false,
  });

  const output = await bundle.write({
    name: opts.moduleName,
    format: 'es',
    dir: opts.dir,
    chunkFileNames: `${opts.entryName}-[name]-[hash].mjs`,
    entryFileNames: opts.entryName + '.mjs',
    banner: '',
    sourcemap: opts.sourcemap,
  });

  await bundle.close();

  return {
    files: output.output.map(f => {
      /** The map contents are in an asset file type, which makes storing the map in the cache as redundant. */
      if (f.type === 'chunk') {
        return { ...f, map: null };
      }

      return f;
    }),
  };
}

/**
 * Bundles TypeScript declarations using Rollup.
 *
 * rollup-plugin-dts transforms produce TypeScript declaration syntax (`declare class`, etc.)
 * which Rolldown's JS parser cannot re-parse. Rollup handles this correctly since it was
 * the original target for rollup-plugin-dts.
 */
async function rollupDtsBundleFile(opts: RollupOptions): Promise<{ files: (OutputChunk | OutputAsset)[] }> {
  const rollup = await ensureRollup();
  log.debug(`rollup (v${rollup.VERSION}) [dts] ${opts.entry} to ${opts.dir}`);
  const jail = path.dirname(opts.entry);

  const bundle = await rollup.rollup({
    context: 'this',
    external: (moduleId: string, parentId: string | undefined) => isExternalDependency(moduleId, parentId, jail),
    input: opts.entry,
    plugins: [fileLoaderPlugin(opts.fileCache, ['.d.ts', '/index.d.ts']) as unknown as import('rollup').Plugin, dts()],
    onwarn: handleBundlerWarning,
    preserveSymlinks: true,
    treeshake: false,
  });

  const output = await bundle.write({
    name: opts.moduleName,
    format: 'es',
    dir: opts.dir,
    importAttributesKey: 'with',
    inlineDynamicImports: false,
    hoistTransitiveImports: false,
    chunkFileNames: `${opts.entryName}-[name]-[hash].d.ts`,
    entryFileNames: opts.entryName + '.d.ts',
    banner: '',
    sourcemap: opts.sourcemap,
  });

  await bundle.close();

  return {
    files: output.output.map(f => {
      if (f.type === 'chunk') {
        return { ...f, map: null };
      }

      return f;
    }) as unknown as (OutputChunk | OutputAsset)[],
  };
}

let rollupInstance: typeof import('rollup') | undefined;

async function ensureRollup(): Promise<typeof import('rollup')> {
  if (rollupInstance) {
    return rollupInstance;
  }

  rollupInstance = await import('rollup');

  return rollupInstance;
}

function isExternalDependency(moduleId: string, parentId: string | undefined, jail: string): boolean {
  if (!parentId) {
    return false;
  }

  // more information about why we don't check for 'node_modules' path
  // https://github.com/rollup/rollup-plugin-node-resolve/issues/110#issuecomment-350353632
  if (moduleId[0] === '.' || moduleId[0] === '/' || path.isAbsolute(moduleId)) {
    // if it's either 'absolute', marked to embed, starts with a '.' or '/' or is the umd bundle and is tslib
    return !path.join(parentId, moduleId).startsWith(jail);
  }

  return true;
}
