import ora from 'ora';
import { join } from 'path';
import type { OutputAsset, OutputChunk } from 'rollup';
import { invalidateEntryPointsAndCacheOnFileChange } from '../../file-system/file-watcher';
import { rollupBundleFile } from '../../flatten/rollup';
import { transformFromPromise } from '../../graph/transform';
import { generateKey, readCacheEntry, saveCacheEntry } from '../../utils/cache';
import { exists, mkdir, writeFile } from '../../utils/fs';
import { ensureUnixPath } from '../../utils/path';
import { EntryPointNode, isEntryPointInProgress } from '../nodes';
import { NgPackagrOptions } from '../options.di';

interface BundlesCache {
  hash: string;
  fesm2022: (OutputChunk | OutputAsset)[];
  types: (OutputChunk | OutputAsset)[];
}

export const writeBundlesTransform = (options: NgPackagrOptions) =>
  transformFromPromise(async graph => {
    const entryPoint: EntryPointNode = graph.find(isEntryPointInProgress());
    const { destinationFiles, entryPoint: ngEntryPoint, tsConfig } = entryPoint.data;
    const cache = entryPoint.cache;
    const { fesm2022Dir, esm2022, declarations, declarationsDir } = destinationFiles;
    const spinner = ora({
      hideCursor: false,
      discardStdin: false,
    });

    const cacheKey = await generateKey(
      ngEntryPoint.moduleId,
      declarationsDir,
      fesm2022Dir,
      tsConfig.options.compilationMode,
      (tsConfig.options.declarationMap ?? false).toString(),
    );

    const hash = await generateKey([...cache.outputCache.values()].map(({ version }) => version).join(':'));
    const cacheDirectory = options.cacheEnabled && options.cacheDirectory;
    if (cacheDirectory) {
      const cacheResult: BundlesCache = await readCacheEntry(options.cacheDirectory, cacheKey);
      if (cacheResult?.hash === hash) {
        const filesToCopy = [
          ...cacheResult.fesm2022.map(file => ({
            ...file,
            filePath: join(fesm2022Dir, file.fileName),
          })),
          ...cacheResult.types.map(file => ({
            ...file,
            filePath: join(declarationsDir, file.fileName),
          })),
        ];

        try {
          const writeFilePromises: Promise<void>[] = [];
          for (const file of filesToCopy) {
            if (options.watch && (await exists(file.filePath))) {
              continue;
            }

            if (writeFilePromises.length === 0) {
              spinner.start('Writing FESM and DTS bundles');
              await Promise.all([mkdir(fesm2022Dir, { recursive: true }), mkdir(declarationsDir, { recursive: true })]);
            }

            writeFilePromises.push(writeFile(file.filePath, file.type === 'asset' ? file.source : file.code));
          }

          if (writeFilePromises.length) {
            await Promise.all(writeFilePromises);
            spinner.succeed('Writing FESM and DTS bundles');
          }
        } catch (error) {
          spinner.fail('Writing FESM and DTS bundles');
          throw error;
        }

        return;
      }
    }

    async function generateBundles(): Promise<BundlesCache> {
      const [{ cache: rollupFESM2022Cache, files: fesmFiles }, { cache: rollupTypesCache, files: typesFiles }] =
        await Promise.all([
          rollupBundleFile({
            entry: esm2022,
            entryName: ngEntryPoint.flatModuleFile,
            moduleName: ngEntryPoint.moduleId,
            dir: fesm2022Dir,
            cache: cache.rollupFESM2022Cache,
            cacheDirectory,
            fileCache: cache.outputCache,
            cacheKey,
            sourcemap: true,
          }),
          rollupBundleFile({
            entry: declarations,
            entryName: ngEntryPoint.flatModuleFile,
            moduleName: ngEntryPoint.moduleId,
            file: join(declarationsDir, `${ngEntryPoint.flatModuleFile}.d.ts`),
            cache: cache.rollupTypesCache,
            cacheDirectory,
            fileCache: cache.outputCache,
            cacheKey,
            sourcemap: tsConfig.options.declarationMap || false,
          }),
        ]);

      cache.rollupFESM2022Cache = rollupFESM2022Cache;
      cache.rollupTypesCache = rollupTypesCache;

      return {
        hash,
        types: typesFiles,
        fesm2022: fesmFiles,
      };
    }

    let cacheRollup: BundlesCache;
    try {
      cacheRollup = await generateBundles();
      spinner.succeed(`Generating FESM and DTS bundles`);

      // Invalidate dependent entry-points
      const changedDtsFiles: string[] = [];
      for (const file of cacheRollup.types) {
        if (file.type !== 'chunk' || !file.fileName.endsWith('.d.ts')) {
          continue;
        }

        const dtsFile = ensureUnixPath(join(declarationsDir, file.fileName));
        const cachedSourceFile = cache.sourcesFileCache.get(dtsFile);
        if (cachedSourceFile?.sourceFile?.text !== file.code) {
          changedDtsFiles.push(dtsFile);
        }
      }

      if (changedDtsFiles.length) {
        invalidateEntryPointsAndCacheOnFileChange(graph, changedDtsFiles, cache.sourcesFileCache);
      }
    } catch (error) {
      spinner.fail();
      throw error;
    }

    if (cacheDirectory) {
      await saveCacheEntry(cacheDirectory, cacheKey, cacheRollup);
    }
  });
