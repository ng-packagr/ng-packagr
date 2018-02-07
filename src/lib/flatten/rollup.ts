import * as rollup from 'rollup';
import * as nodeResolve from 'rollup-plugin-node-resolve';
import * as commonJs from 'rollup-plugin-commonjs';
import * as cleanup from 'rollup-plugin-cleanup';
import * as license from 'rollup-plugin-license';
import * as path from 'path';
import * as log from '../util/log';
import { externalModuleIdStrategy } from './external-module-id-strategy';
import { umdModuleIdStrategy } from './umd-module-id-strategy';
import { TransformHook } from 'rollup';

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
  umdModuleIds?: { [key: string]: string };
  embedded?: string[];
  comments?: string;
  licensePath?: string;
  transform?: TransformHook;
}

/** Runs rollup over the given entry file, writes a bundle file. */
export async function rollupBundleFile(opts: RollupOptions): Promise<void> {
  log.debug(`rollup (v${rollup.VERSION}) ${opts.entry} to ${opts.dest} (${opts.format})`);

  const rollupPlugins = [
    nodeResolve({ jsnext: true, module: true }),
    commonJs(),
    cleanup({
      comments: opts.comments
    }),
    { transform: opts.transform }
  ];

  if (opts.licensePath) {
    rollupPlugins.push(
      license({
        sourceMap: true,
        banner: {
          file: opts.licensePath,
          encoding: 'utf-8'
        }
      })
    );
  }

  // Create the bundle
  const bundle: rollup.OutputChunk = await rollup.rollup({
    context: 'this',
    external: moduleId => externalModuleIdStrategy(moduleId, opts.embedded || []),
    input: opts.entry,
    plugins: rollupPlugins,
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
    preserveSymlinks: true
  });

  // Output the bundle to disk
  await bundle.write({
    name: `${opts.moduleName}`,
    file: opts.dest,
    format: opts.format,
    banner: '',
    globals: moduleId => umdModuleIdStrategy(moduleId, opts.umdModuleIds || {}),
    sourcemap: true
  });
}
