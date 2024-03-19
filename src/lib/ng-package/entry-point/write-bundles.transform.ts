import ora from 'ora';
import { bundle } from '../../flatten/esbuild';
import { transformFromPromise } from '../../graph/transform';
import { EntryPointNode, isEntryPointInProgress } from '../nodes';
import { NgPackagrOptions } from '../options.di';

export const writeBundlesTransform = (options: NgPackagrOptions) =>
  transformFromPromise(async graph => {
    const entryPoint: EntryPointNode = graph.find(isEntryPointInProgress());
    const { destinationFiles, entryPoint: ngEntryPoint } = entryPoint.data;
    const cache = entryPoint.cache;
    const { fesm2022Dir, esm2022 } = destinationFiles;

    const spinner = ora({
      hideCursor: false,
      discardStdin: false,
    });

    try {
      const result = await bundle({
        buildContext: cache.esbuildBuildContext,
        entry: esm2022,
        outdir: fesm2022Dir,
        entryName: ngEntryPoint.flatModuleFile,
        moduleName: ngEntryPoint.moduleId,
        watch: options.watch,
        fileCache: cache.outputCache,
      });

      cache.esbuildBuildContext = result.esbuildContext;

      spinner.succeed(`Generating FESM bundles`);
    } catch (error) {
      spinner.fail();
      throw error;
    }
  });
