import * as ora from 'ora';
import { transformFromPromise } from '../../graph/transform';
import { isEntryPointInProgress, EntryPointNode } from '../nodes';
import { rollupBundleFile } from '../../flatten/rollup';
import { NgPackagrOptions } from '../options.di';
import { downlevelCodeWithTsc } from '../../flatten/downlevel-plugin';

export const writeBundlesTransform = (options: NgPackagrOptions) =>
  transformFromPromise(async graph => {
    const entryPoint: EntryPointNode = graph.find(isEntryPointInProgress());
    const { destinationFiles, entryPoint: ngEntryPoint, tsConfig } = entryPoint.data;
    const cache = entryPoint.cache;
    const { fesm2020, fesm2015, esm2020 } = destinationFiles;

    const spinner = ora({
      hideCursor: false,
      discardStdin: false,
    });

    try {
      spinner.start('Generating FESM2020');
      const rollupFESMCache = await rollupBundleFile({
        sourceRoot: tsConfig.options.sourceRoot,
        entry: esm2020,
        moduleName: ngEntryPoint.moduleId,
        dest: fesm2020,
        cache: cache.rollupFESM2020Cache,
      });
      spinner.succeed();

      if (options.watch) {
        cache.rollupFESM2020Cache = rollupFESMCache;
      }
    } catch (error) {
      spinner.fail();
      throw error;
    }


    try {
      spinner.start('Generating FESM2015');
      const rollupFESMCache = await rollupBundleFile({
        sourceRoot: tsConfig.options.sourceRoot,
        entry: esm2020,
        moduleName: ngEntryPoint.moduleId,
        dest: fesm2015,
        transform: downlevelCodeWithTsc,
        cache: cache.rollupFESM2015Cache,
      });
      spinner.succeed();

      if (options.watch) {
        cache.rollupFESM2015Cache = rollupFESMCache;
      }
    } catch (error) {
      spinner.fail();
      throw error;
    }
  });
