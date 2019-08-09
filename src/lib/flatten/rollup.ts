import * as rollup from 'rollup';
import * as nodeResolve from 'rollup-plugin-node-resolve';
import * as sourcemaps from 'rollup-plugin-sourcemaps';
import * as commonJs from 'rollup-plugin-commonjs';
import * as rollupJson from 'rollup-plugin-json';
import * as log from '../util/log';
import { ExternalModuleIdStrategy, DependencyList } from './external-module-id-strategy';
import { umdModuleIdStrategy } from './umd-module-id-strategy';
import { TransformHook } from 'rollup';
import { ensureUnixPath } from '../util/path';

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
export async function rollupBundleFile(opts: RollupOptions): Promise<void> {
  log.debug(`rollup (v${rollup.VERSION}) ${opts.entry} to ${opts.dest} (${opts.format})`);

  const externalModuleIdStrategy = new ExternalModuleIdStrategy(opts.format, opts.dependencyList);

  // Create the bundle
  const bundle = await rollup.rollup({
    context: 'this',
    external: moduleId => externalModuleIdStrategy.isExternalDependency(moduleId),
    inlineDynamicImports: false,
    input: opts.entry,
    plugins: [
      rollupJson(),
      // @ts-ignore
      nodeResolve(),
      // @ts-ignore
      commonJs(),
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
    sourcemapPathTransform: (sourcePath: string) => {
      sourcePath = ensureUnixPath(sourcePath);
      // relocate sourcemaps
      if (!sourcePath) {
        return sourcePath;
      }

      // the replace here is because during the compilation one of the `/` gets lost sometimes
      const sourceRoot = ensureUnixPath(opts.sourceRoot);
      const mapRootUrl = sourceRoot.replace('//', '/');
      if (sourcePath.indexOf(mapRootUrl) >= 0) {
        return `${sourceRoot}${sourcePath.substr(sourcePath.indexOf(mapRootUrl) + mapRootUrl.length)}`;
      } else if (sourcePath.indexOf(sourceRoot) >= 0) {
        return sourcePath.substr(sourcePath.indexOf(mapRootUrl));
      } else {
        return sourcePath;
      }
    },
  });
}
