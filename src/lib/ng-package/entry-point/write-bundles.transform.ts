import * as ora from 'ora';
import { transformFromPromise } from '../../graph/transform';
import { isEntryPointInProgress, EntryPointNode } from '../nodes';
import { rollupBundleFile } from '../../flatten/rollup';
import { NgPackagrOptions } from '../options.di';

export const writeBundlesTransform = (options: NgPackagrOptions) =>
  transformFromPromise(async graph => {
    const entryPoint: EntryPointNode = graph.find(isEntryPointInProgress());
    const { destinationFiles, entryPoint: ngEntryPoint, tsConfig } = entryPoint.data;
    const cache = entryPoint.cache;
    const { fesm2015, esm2015 } = destinationFiles;

    const spinner = ora({
      hideCursor: false,
      discardStdin: false,
    });

    try {
      spinner.start('Bundling to FESM2015');
      const rollupFESMCache = await rollupBundleFile({
        sourceRoot: tsConfig.options.sourceRoot,
        entry: esm2015,
        moduleName: ngEntryPoint.moduleId,
        format: 'es',
        dest: fesm2015,
        cache: cache.rollupFESMCache,
      });
      spinner.succeed();

      if (options.watch) {
        cache.rollupFESMCache = rollupFESMCache;
      }
    } catch (error) {
      spinner.fail();
      throw error;
    }
  });
