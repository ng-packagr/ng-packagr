import ora from 'ora';
import { join } from 'path';
import { OutputAsset, OutputChunk, RollupCache } from 'rollup';
import { rollupBundleFile } from '../../flatten/rollup';
import { transformFromPromise } from '../../graph/transform';
import { generateKey, readCacheEntry, saveCacheEntry } from '../../utils/cache';
import { mkdir, writeFile } from '../../utils/fs';
import { EntryPointNode, isEntryPointInProgress } from '../nodes';
import { NgPackagrOptions } from '../options.di';

interface BundlesCache {
  hash: string;
  fesm2020: (OutputChunk | OutputAsset)[];
  fesm2015: (OutputChunk | OutputAsset)[];
}

export const writeBundlesTransform = (options: NgPackagrOptions) =>
  transformFromPromise(async graph => {
    const entryPoint: EntryPointNode = graph.find(isEntryPointInProgress());
    const { destinationFiles, entryPoint: ngEntryPoint, tsConfig } = entryPoint.data;
    const cache = entryPoint.cache;
    const { fesm2020Dir, fesm2015Dir, esm2020 } = destinationFiles;

    const spinner = ora({
      hideCursor: false,
      discardStdin: false,
    });

    const key = await generateKey(
      ngEntryPoint.moduleId,
      esm2020,
      fesm2020Dir,
      fesm2015Dir,
      tsConfig.options.compilationMode,
    );
    const hash = await generateKey([...cache.outputCache.values()].map(({ version }) => version).join(':'));
    const cacheDirectory = options.cacheEnabled && options.cacheDirectory;
    if (cacheDirectory) {
      const cacheResult: BundlesCache = await readCacheEntry(options.cacheDirectory, key);

      if (cacheResult?.hash === hash) {
        try {
          spinner.start('Writing FESM bundles');
          await Promise.all([mkdir(fesm2020Dir, { recursive: true }), mkdir(fesm2015Dir, { recursive: true })]);

          for (const file of cacheResult.fesm2020) {
            await writeFile(join(fesm2020Dir, file.fileName), file.type === 'asset' ? file.source : file.code);
          }

          for (const file of cacheResult.fesm2015) {
            await writeFile(join(fesm2015Dir, file.fileName), file.type === 'asset' ? file.source : file.code);
          }

          spinner.succeed('Writing FESM bundles');
        } catch (error) {
          spinner.fail();
          throw error;
        }

        return;
      }
    }

    async function generateFESM(
      rollupCache: RollupCache,
      dir: string,
      downlevel: boolean,
    ): Promise<{ files: (OutputChunk | OutputAsset)[]; rollupCache: RollupCache }> {
      const { cache: rollupFESMCache, files } = await rollupBundleFile({
        sourceRoot: tsConfig.options.sourceRoot,
        entry: esm2020,
        entryName: ngEntryPoint.flatModuleFile,
        moduleName: ngEntryPoint.moduleId,
        dir,
        downlevel,
        cache: rollupCache,
        cacheDirectory,
        fileCache: cache.outputCache,
        cacheKey: await generateKey(esm2020, dir, ngEntryPoint.moduleId, tsConfig.options.compilationMode),
      });

      return {
        /** The map contents are in an asset file type, which makes storing the map in the cache as redudant. */
        files: files.map(f => {
          if (f.type === 'chunk') {
            f.map = null;
          }

          return f;
        }),
        rollupCache: options.watch ? rollupFESMCache : undefined,
      };
    }

    const fesmCache: Partial<BundlesCache> = {
      hash,
    };

    try {
      spinner.start('Generating FESM2020');
      const { rollupCache, files } = await generateFESM(cache.rollupFESM2020Cache, fesm2020Dir, false);

      cache.rollupFESM2020Cache = rollupCache;
      fesmCache.fesm2020 = files;

      spinner.succeed();
    } catch (error) {
      spinner.fail();
      throw error;
    }

    try {
      spinner.start('Generating FESM2015');
      const { rollupCache, files } = await generateFESM(cache.rollupFESM2015Cache, fesm2015Dir, true);

      cache.rollupFESM2015Cache = rollupCache;
      fesmCache.fesm2015 = files;

      spinner.succeed();
    } catch (error) {
      spinner.fail();
      throw error;
    }

    if (cacheDirectory) {
      await saveCacheEntry(cacheDirectory, key, JSON.stringify(fesmCache));
    }
  });
