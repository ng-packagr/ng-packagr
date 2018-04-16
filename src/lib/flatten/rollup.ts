import * as rollup from 'rollup';
import * as nodeResolve from 'rollup-plugin-node-resolve';
import * as commonJs from 'rollup-plugin-commonjs';
import * as log from '../util/log';
import { ExternalModuleIdStrategy, DependencyList } from './external-module-id-strategy';
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
  amd?: { id: string };
  transform?: TransformHook;
  dependencyList?: DependencyList;
}

/** Runs rollup over the given entry file, writes a bundle file. */
export async function rollupBundleFile(opts: RollupOptions): Promise<void> {
  log.debug(`rollup (v${rollup.VERSION}) ${opts.entry} to ${opts.dest} (${opts.format})`);

  const externalModuleIdStrategy = new ExternalModuleIdStrategy(opts.format, opts.dependencyList);

  // Create the bundle
  const bundle = await rollup.rollup({
    context: 'this',
    external: moduleId => externalModuleIdStrategy.isExternalDependency(moduleId),
    input: opts.entry,
    plugins: [nodeResolve(), commonJs(), { transform: opts.transform }],
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
    amd: opts.amd,
    banner: '',
    globals: moduleId => umdModuleIdStrategy(moduleId, opts.umdModuleIds || {}),
    sourcemap: true
  });
}
