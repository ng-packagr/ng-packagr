import ora from 'ora';
import { dirname } from 'path';
import { SourceMap } from 'rollup';
import { rollupBundleFile } from '../../flatten/rollup';
import { transformFromPromise } from '../../graph/transform';
import { generateKey, readCacheEntry, saveCacheEntry } from '../../utils/cache';
import { mkdir, writeFile } from '../../utils/fs';
import { EntryPointNode, isEntryPointInProgress } from '../nodes';
import { NgPackagrOptions } from '../options.di';

interface BundlesCache {
  hash: string;
  fesm2020: {
    code: string;
    map: SourceMap;
  };
  fesm2015: {
    code: string;
    map: SourceMap;
  };
}

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

    const key = await generateKey(ngEntryPoint.moduleId, esm2020, 'fesm-bundles', tsConfig.options.compilationMode);
    const hash = await generateKey(...[...cache.outputCache.values()].map(({ version }) => version));
    const cacheDirectory = options.cacheEnabled && options.cacheDirectory;
    if (cacheDirectory) {
      const cacheResult: BundlesCache = await readCacheEntry(options.cacheDirectory, key);

      if (cacheResult?.hash === hash) {
        try {
          spinner.start('Writing FESM bundles');
          await Promise.all([
            mkdir(dirname(fesm2020), { recursive: true }),
            mkdir(dirname(fesm2015), { recursive: true }),
          ]);

          await Promise.all([
            writeFile(fesm2020, cacheResult.fesm2020.code),
            writeFile(`${fesm2020}.map`, JSON.stringify(cacheResult.fesm2020.map)),
            writeFile(fesm2015, cacheResult.fesm2015.code),
            writeFile(`${fesm2015}.map`, JSON.stringify(cacheResult.fesm2015.map)),
          ]);

          spinner.succeed('Writing FESM bundles');
        } catch (error) {
          spinner.fail();
          throw error;
        }

        return;
      }
    }

    const fesmCache: Partial<BundlesCache> = {
      hash,
    };

    try {
      spinner.start('Generating FESM2020');
      const {
        cache: rollupFESMCache,
        code,
        map,
      } = await rollupBundleFile({
        sourceRoot: tsConfig.options.sourceRoot,
        entry: esm2020,
        moduleName: ngEntryPoint.moduleId,
        dest: fesm2020,
        cache: cache.rollupFESM2020Cache,
        cacheDirectory,
        fileCache: cache.outputCache,
        cacheKey: await generateKey(esm2020, ngEntryPoint.moduleId, fesm2020, tsConfig.options.compilationMode),
      });

      fesmCache.fesm2020 = {
        code,
        map,
      };

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
      const {
        cache: rollupFESMCache,
        code,
        map,
      } = await rollupBundleFile({
        sourceRoot: tsConfig.options.sourceRoot,
        entry: esm2020,
        moduleName: ngEntryPoint.moduleId,
        dest: fesm2015,
        downlevel: true,
        cache: cache.rollupFESM2015Cache,
        cacheDirectory,
        fileCache: cache.outputCache,
        cacheKey: await generateKey(esm2020, ngEntryPoint.moduleId, fesm2015, tsConfig.options.compilationMode),
      });

      fesmCache.fesm2015 = {
        code,
        map,
      };

      spinner.succeed();

      if (options.watch) {
        cache.rollupFESM2015Cache = rollupFESMCache;
      }
    } catch (error) {
      spinner.fail();
      throw error;
    }

    if (cacheDirectory) {
      await saveCacheEntry(cacheDirectory, key, JSON.stringify(fesmCache));
    }
  });
