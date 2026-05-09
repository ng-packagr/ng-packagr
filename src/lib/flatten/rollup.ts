import * as path from 'path';
import type { OutputAsset, OutputChunk } from 'rolldown';
import { VERSION as ROLLDOWN_VERSION, rolldown } from 'rolldown';
import { dts } from 'rolldown-plugin-dts';
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

/** Runs rolldown over the given entry file, writes a bundle file. */
export async function rollupBundleFile(opts: RollupOptions): Promise<{ files: (OutputChunk | OutputAsset)[] }> {
  const dtsMode = opts.entry.endsWith('.d.ts');

  return rolldownBundleFile(opts, dtsMode);
}

/** Bundles JavaScript and TypeScript declarations using Rolldown. */
async function rolldownBundleFile(
  opts: RollupOptions,
  dtsMode: boolean,
): Promise<{ files: (OutputChunk | OutputAsset)[] }> {
  log.debug(`rolldown (v${ROLLDOWN_VERSION})${dtsMode ? ' [dts]' : ''} ${opts.entry} to ${opts.dir}`);
  const jail = path.dirname(opts.entry);

  const bundle = await rolldown({
    external: (moduleId, parentId) => isExternalDependency(moduleId, parentId, jail),
    input: opts.entry,
    plugins: [
      fileLoaderPlugin(opts.fileCache, dtsMode ? ['.d.ts', '/index.d.ts'] : ['.js', '/index.js'], dtsMode),
      ...(dtsMode
        ? dts({
            dtsInput: true,
            emitDtsOnly: true,
            sourcemap: opts.sourcemap,
            tsconfig: false,
          })
        : []),
    ],
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
    chunkFileNames: `${opts.entryName}-[name]-[hash].${dtsMode ? 'd.ts' : 'mjs'}`,
    entryFileNames: `${opts.entryName}.${dtsMode ? 'd.ts' : 'mjs'}`,
    banner: '',
    sourcemap: opts.sourcemap,
    ...(dtsMode
      ? {
          hoistTransitiveImports: false,
        }
      : {}),
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
