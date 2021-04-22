import * as ora from 'ora';
import { transformFromPromise } from '../../graph/transform';
import { NgEntryPoint } from './entry-point';
import { isEntryPoint, isEntryPointInProgress, EntryPointNode } from '../nodes';
import { downlevelCodeWithTsc } from '../../flatten/downlevel-plugin';
import { rollupBundleFile } from '../../flatten/rollup';
import { NgPackagrOptions } from '../options.di';

export const writeBundlesTransform = (options: NgPackagrOptions) => transformFromPromise(async graph => {
  const entryPoint: EntryPointNode = graph.find(isEntryPointInProgress());
  const { destinationFiles, entryPoint: ngEntryPoint, tsConfig } = entryPoint.data;
  const cache = entryPoint.cache;

  // Add UMD module IDs for dependencies
  const dependencyUmdIds = entryPoint
    .filter(isEntryPoint)
    .map(ep => ep.data.entryPoint)
    .reduce((prev, ep: NgEntryPoint) => {
      prev[ep.moduleId] = ep.umdId;

      return prev;
    }, {});

  const { fesm2015, esm2015, umd } = destinationFiles;

  const opts = {
    sourceRoot: tsConfig.options.sourceRoot,
    amd: { id: ngEntryPoint.amdId },
    umdModuleIds: {
      ...ngEntryPoint.umdModuleIds,
      ...dependencyUmdIds,
    },
    entry: esm2015,
  };

  const spinner = ora({
    hideCursor: false,
    discardStdin: false,
  });

  try {
    spinner.start('Bundling to FESM2015');
    const rollupFESMCache = await rollupBundleFile({
      ...opts,
      moduleName: ngEntryPoint.moduleId,
      format: 'es',
      dest: fesm2015,
      cache: cache.rollupFESMCache,
    });
    spinner.succeed();

    if (options.watch) {
      cache.rollupFESMCache = rollupFESMCache;

      return;
    }

    spinner.start('Bundling to UMD');
    await rollupBundleFile({
      ...opts,
      moduleName: ngEntryPoint.umdId,
      entry: esm2015,
      format: 'umd',
      dest: umd,
      transform: downlevelCodeWithTsc,
    });
    spinner.succeed();
  } catch (error) {
    spinner.fail();
    throw error;
  }
});
