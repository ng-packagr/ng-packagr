import * as path from 'path';
import { type OutputAsset, type OutputChunk, type RolldownPluginOption, rolldown } from 'rolldown';
import { dts } from 'rolldown-plugin-dts';
import { OutputFileCache } from '../ng-package/nodes';
import * as log from '../utils/log';
import { fileLoaderPlugin } from './file-loader-plugin';

/**
 * Options used in `ng-packagr` for writing flat bundle files.
 *
 * These options are passed through to rolldown.
 */
export interface RolldownOptions {
  moduleName: string;
  entry: string;
  entryName: string;
  dir: string;
  fileCache: OutputFileCache;
  sourcemap: boolean;
}

/** Runs rolldown over the given entry file, writes a bundle file. */
export async function rolldownBundleFile(opts: RolldownOptions): Promise<{ files: (OutputChunk | OutputAsset)[] }> {
  log.debug(`rolldown ${opts.entry} to ${opts.dir}`);
  const dtsMode = opts.entry.endsWith('.d.ts');
  let outExtension: string;
  let plugins: RolldownPluginOption[];
  const jail = path.dirname(opts.entry);

  if (dtsMode) {
    outExtension = '.d.ts';
    plugins = [fileLoaderPlugin(opts.fileCache, ['.d.ts', '/index.d.ts'], dtsMode), dts({ sourcemap: opts.sourcemap })];
  } else {
    outExtension = '.mjs';
    plugins = [fileLoaderPlugin(opts.fileCache, ['.js', '/index.js'], dtsMode)];
  }

  // Create the bundle
  const bundle = await rolldown({
    context: 'this',
    external: (moduleId, parentId) => isExternalDependency(moduleId, parentId, jail),
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
    resolve: {
      symlinks: false,
    },
    // Disable treeshaking when generating bundles
    // see: https://github.com/angular/angular/pull/32069
    treeshake: false,
  });

  // Output the bundle to disk
  const output = await bundle.write({
    name: opts.moduleName,
    format: 'es',
    dir: opts.dir,
    hoistTransitiveImports: false,
    chunkFileNames: `${opts.entryName}-[name]-[hash]${outExtension}`,
    entryFileNames: opts.entryName + outExtension,
    banner: '',
    sourcemap: opts.sourcemap,
  });

  // Close the bundle to let plugins clean up their external processes or services
  await bundle.close();

  return {
    files: output.output.map(f => {
      /** The map contents are in an asset file type, which makes storing the map in the cache as redudant. */
      if (f.type === 'chunk') {
        Object.defineProperty(f, 'map', { value: null, configurable: true });
      }

      return f;
    }),
  };
}

function isExternalDependency(moduleId: string, parentId: string | undefined, jail: string): boolean {
  // more information about why we don't check for 'node_modules' path
  // https://github.com/rollup/rollup-plugin-node-resolve/issues/110#issuecomment-350353632
  if (moduleId[0] === '.' || moduleId[0] === '/' || path.isAbsolute(moduleId)) {
    // if it's either 'absolute', marked to embed, starts with a '.' or '/' or is the umd bundle and is tslib
    return !parentId || !path.join(parentId, moduleId).startsWith(jail);
  }

  return true;
}
