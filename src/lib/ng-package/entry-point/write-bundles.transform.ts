import * as ora from 'ora';
import { transformFromPromise } from '../../graph/transform';
import { NgEntryPoint } from './entry-point';
import { isEntryPoint, isEntryPointInProgress, EntryPointNode } from '../nodes';
import { downlevelCodeWithTsc } from '../../flatten/downlevel-plugin';
import { rollupBundleFile } from '../../flatten/rollup';
import { NgPackagrOptions } from '../options.di';
import { build, formatMessages, Message } from 'esbuild';
import { warn } from '../../utils/log';

export const writeBundlesTransform = (options: NgPackagrOptions) =>
  transformFromPromise(async graph => {
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
      let buildResult;
      if (cache.FESMCache) {
        buildResult = await cache.FESMCache.rebuild();
      } else {

        buildResult = await build({
          entryPoints: [esm2015],
          sourceRoot: esm2015,
          outfile: fesm2015,
          format: 'esm',
          sourcemap: 'external',
          legalComments: 'inline',
          minify: false,
          watch: false,
          incremental: options.watch,
          bundle: true,
          preserveSymlinks: true,
          metafile: false,
          minifySyntax: false,
          minifyWhitespace: false,
          charset: 'utf8',
          plugins: [
            {
              name: 'make-all-packages-external',
              setup(build) {
                const filter = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/; // Must not start with "/" or "./" or "../"
                build.onResolve({ filter }, args => ({ path: args.path, external: true }));
              },
            },
          ],
        });
      }

      await formatAndPrintMessages(buildResult.warnings, buildResult.errors);
      spinner.succeed();

      if (options.watch) {
        cache.FESMCache = buildResult;

        return;
      }

      spinner.start('Bundling to UMD');
      await rollupBundleFile({
        ...opts,
        moduleName: ngEntryPoint.umdId,
        entry: fesm2015,
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

async function formatAndPrintMessages(warnings: Message[], errors: Message[]): Promise<void> {
  if (warnings.length) {
    const formattedWarnings = await formatMessages(errors, { kind: 'warning' });

    formattedWarnings.forEach(w => warn(w));
  }

  if (errors.length) {
    throw new Error(`Generating FESM failed.`);
  }
}
