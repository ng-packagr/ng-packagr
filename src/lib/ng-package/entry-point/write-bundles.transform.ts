import ora from 'ora';
import { join } from 'path';
import type { OutputAsset, OutputChunk, RollupCache } from 'rollup';
import { rollupBundleFile } from '../../flatten/rollup';
import { transformFromPromise } from '../../graph/transform';
import { generateKey, readCacheEntry, saveCacheEntry } from '../../utils/cache';
import { exists, mkdir, writeFile } from '../../utils/fs';
import { EntryPointNode, isEntryPointInProgress } from '../nodes';
import { NgPackagrOptions } from '../options.di';

interface BundlesCache {
  hash: string;
  fesm2022: (OutputChunk | OutputAsset)[];
}

export const writeBundlesTransform = (options: NgPackagrOptions) =>
  transformFromPromise(async graph => {
    const entryPoint: EntryPointNode = graph.find(isEntryPointInProgress());
    const { destinationFiles, entryPoint: ngEntryPoint, tsConfig } = entryPoint.data;
    const cache = entryPoint.cache;
    const { fesm2022Dir, esm2022 } = destinationFiles;

    const spinner = ora({
      hideCursor: false,
      discardStdin: false,
    });

    const key = await generateKey(ngEntryPoint.moduleId, esm2022, fesm2022Dir, tsConfig.options.compilationMode);
    const hash = await generateKey([...cache.outputCache.values()].map(({ version }) => version).join(':'));
    const cacheDirectory = options.cacheEnabled && options.cacheDirectory;
    if (cacheDirectory) {
      const cacheResult: BundlesCache = await readCacheEntry(options.cacheDirectory, key);
      let writing = false;

      if (cacheResult?.hash === hash) {
        try {
          for (const file of cacheResult.fesm2022) {
            const filePath = join(fesm2022Dir, file.fileName);
            if (options.watch && (await exists(filePath))) {
              continue;
            }

            if (!writing) {
              writing = true;
              spinner.start('Writing FESM bundles');
              await mkdir(fesm2022Dir, { recursive: true });
            }

            await writeFile(filePath, file.type === 'asset' ? file.source : file.code);
          }

          if (writing) {
            spinner.succeed('Writing FESM bundles');
          }
        } catch (error) {
          if (!writing) {
            spinner.start('Writing FESM bundles');
          }

          spinner.fail();
          throw error;
        }

        return;
      }
    }

    async function generateFESM(
      rollupCache: RollupCache,
      dir: string,
    ): Promise<{ files: (OutputChunk | OutputAsset)[]; rollupCache: RollupCache }> {
      const { cache: rollupFESMCache, files } = await rollupBundleFile({
        entry: esm2022,
        entryName: ngEntryPoint.flatModuleFile,
        moduleName: ngEntryPoint.moduleId,
        dir,
        cache: rollupCache,
        cacheDirectory,
        fileCache: cache.outputCache,
        cacheKey: await generateKey(esm2022, dir, ngEntryPoint.moduleId, tsConfig.options.compilationMode),
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
      const { rollupCache, files } = await generateFESM(cache.rollupFESM2022Cache, fesm2022Dir);

      cache.rollupFESM2022Cache = rollupCache;
      fesmCache.fesm2022 = files;

      spinner.succeed(`Generating FESM bundles`);
    } catch (error) {
      spinner.fail();
      throw error;
    }

    if (cacheDirectory) {
      await saveCacheEntry(cacheDirectory, key, fesmCache);
    }
  });
