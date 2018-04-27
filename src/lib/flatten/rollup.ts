import * as rollup from 'rollup';
import * as nodeResolve from 'rollup-plugin-node-resolve';
import { sourcemaps } from './sourcemaps';
import * as commonJs from 'rollup-plugin-commonjs';
import * as log from '../util/log';
import { ExternalModuleIdStrategy, DependencyList } from './external-module-id-strategy';
import { umdModuleIdStrategy } from './umd-module-id-strategy';
import { TransformHook } from 'rollup';
import { outputFile, outputJson } from 'fs-extra';

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
  dependencyList?: DependencyList;
}

/** Runs rollup over the given entry file, writes a bundle file. */
export async function rollupBundleFile(opts: RollupOptions): Promise<void[]> {
  log.debug(`rollup (v${rollup.VERSION}) ${opts.entry} to ${opts.dest} (${opts.format})`);

  const externalModuleIdStrategy = new ExternalModuleIdStrategy(opts.format, opts.dependencyList);

  // Create the bundle
  const bundle = await rollup.rollup({
    context: 'this',
    external: moduleId => externalModuleIdStrategy.isExternalDependency(moduleId),
    input: opts.entry,
    plugins: [nodeResolve(), commonJs(), sourcemaps(), { transform: opts.transform }],
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
  const result = await bundle.generate({
    name: opts.moduleName,
    format: opts.format,
    amd: opts.amd,
    banner: '',
    globals: moduleId => umdModuleIdStrategy(moduleId, opts.umdModuleIds || {}),
    sourcemap: true
  });

  // relocate sourcemaps
  result.map.sources = result.map.sources.map(sourcePath => {
    // the replace here is because during the compilation one of the `/` gets lost
    const mapRootUrl = opts.sourceRoot.replace('//', '/');
    if (sourcePath && sourcePath.indexOf(mapRootUrl) > 0) {
      return `${opts.sourceRoot}${sourcePath.substr(sourcePath.indexOf(mapRootUrl) + mapRootUrl.length)}`;
    }

    return sourcePath;
  });

  return Promise.all([outputJson(`${opts.dest}.map`, result.map), outputFile(opts.dest, result.code)]);
}
