import * as __rollup from 'rollup';
import * as nodeResolve from 'rollup-plugin-node-resolve';
import * as commonJs from 'rollup-plugin-commonjs';
import * as cleanup from 'rollup-plugin-cleanup';
import * as license from 'rollup-plugin-license';
import * as path from 'path';
import * as log from '../util/log';
import { externalModuleIdStrategy } from './external-module-id-strategy';
import { umdModuleIdStrategy } from './umd-module-id-strategy';

export type BundleFormat = __rollup.Format;

export interface RollupOptions {
  moduleName: string;
  entry: string;
  format: BundleFormat;
  dest: string;
  umdModuleIds?: { [key: string]: string };
  embedded?: string[];
  comments?: string;
  licensePath?: string;
}

/** Runs rollup over the given entry file, writes a bundle file. */
export async function rollup(opts: RollupOptions): Promise<void> {
  log.debug(`rollup (v${__rollup.VERSION}) ${opts.entry} to ${opts.dest} (${opts.format})`);

  const rollupPlugins = [
    nodeResolve({ jsnext: true, module: true }),
    commonJs(),
    cleanup({
      comments: opts.comments
    })
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
  const bundle: __rollup.Bundle = await __rollup.rollup({
    context: 'this',
    external: moduleId => externalModuleIdStrategy(moduleId, opts.embedded || []),
    input: opts.entry,
    plugins: rollupPlugins,
    onwarn: warning => {
      if (warning.code === 'THIS_IS_UNDEFINED') {
        return;
      }

      log.warn(warning.message);
    }
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
