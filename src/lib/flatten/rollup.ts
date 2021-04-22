import * as rollup from 'rollup';
import nodeResolve from '@rollup/plugin-node-resolve';
import * as sourcemaps from 'rollup-plugin-sourcemaps';
import * as commonJs from '@rollup/plugin-commonjs';
import * as rollupJson from '@rollup/plugin-json';
import * as log from '../utils/log';
import { umdModuleIdStrategy } from './umd-module-id-strategy';
import { TransformHook } from 'rollup';
import * as path from 'path';

/**
 * Options used in `ng-packagr` for writing flat bundle files.
 *
 * These options are passed through to rollup.
 */
export interface RollupOptions {
  moduleName: string;
  entry: string;
  format: rollup.ModuleFormat;
  dest: string;
  sourceRoot: string;
  umdModuleIds?: { [key: string]: string };
  amd?: { id: string };
  transform?: TransformHook;
  cache?: rollup.RollupCache;
}

/** Runs rollup over the given entry file, writes a bundle file. */
export async function rollupBundleFile(opts: RollupOptions): Promise<rollup.RollupCache> {
  log.debug(`rollup (v${rollup.VERSION}) ${opts.entry} to ${opts.dest} (${opts.format})`);

  // Create the bundle
  const bundle = await rollup.rollup({
    context: 'this',
    external: moduleId => isExternalDependency(moduleId, opts.format),
    inlineDynamicImports: false,
    cache: opts.cache,
    input: opts.entry,
    plugins: [
      // @ts-ignore
      rollupJson(),
      // @ts-ignore
      nodeResolve(),
      // @ts-ignore
      commonJs(),
      // @ts-ignore
      sourcemaps(),
      { transform: opts.transform },
    ],
    onwarn: warning => {
      if (typeof warning === 'string') {
        log.warn(warning);
      } else {
        if (warning.code === 'THIS_IS_UNDEFINED') {
          return;
        }

        log.warn(warning.message);
      }
    },
    preserveSymlinks: true,
    // Disable treeshaking when generating bundles
    // see: https://github.com/angular/angular/pull/32069
    treeshake: false,
  });

  // Output the bundle to disk
  await bundle.write({
    name: opts.moduleName,
    format: opts.format,
    amd: opts.amd,
    file: opts.dest,
    banner: '',
    globals: moduleId => umdModuleIdStrategy(moduleId, opts.umdModuleIds || {}),
    sourcemap: true,
  });

  return bundle.cache;
}

function isExternalDependency(moduleId: string, format: rollup.ModuleFormat): boolean {
  // more information about why we don't check for 'node_modules' path
  // https://github.com/rollup/rollup-plugin-node-resolve/issues/110#issuecomment-350353632
  if (path.isAbsolute(moduleId) || moduleId.startsWith('.') || moduleId.startsWith('/')) {
    // if it's either 'absolute', marked to embed, starts with a '.' or '/' or is the umd bundle and is tslib
    return false;
  }

  if (format === 'umd' && moduleId.startsWith('tslib')) {
    return false;
  }

  return true;
}
