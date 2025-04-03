import ora from 'ora';
import { join } from 'path';
import type { OutputAsset, OutputChunk } from 'rollup';
import { rollupBundleFile } from '../../flatten/rollup';
import { STATE_PENDING } from '../../graph/node';
import { isPending } from '../../graph/select';
import { transformFromPromise } from '../../graph/transform';
import { generateKey, readCacheEntry, saveCacheEntry } from '../../utils/cache';
import { exists, mkdir, writeFile } from '../../utils/fs';
import { ensureUnixPath } from '../../utils/path';
import { EntryPointNode, fileUrl, isEntryPoint, isEntryPointInProgress } from '../nodes';
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
      esm2022,
      fesm2022Dir,
      tsConfig.options.compilationMode,
      declarations,
      declarationsDir,
    );
    const hash = await generateKey([...cache.outputCache.values()].map(({ version }) => version).join(':'));
    const cacheDirectory = options.cacheEnabled && options.cacheDirectory;
    if (cacheDirectory) {
      const cacheResult: BundlesCache = await readCacheEntry(options.cacheDirectory, cacheKey);
      let writing = false;

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

            if (!writing) {
              writing = true;
              spinner.start('Writing FESM and DTS bundles');
              await Promise.all([mkdir(fesm2022Dir, { recursive: true }), mkdir(declarationsDir, { recursive: true })]);
            }

            writeFilePromises.push(writeFile(file.filePath, file.type === 'asset' ? file.source : file.code));
          }

          if (writing) {
            await Promise.all(writeFilePromises);
            spinner.succeed('Writing FESM and DTS bundles');
          }
        } catch (error) {
          if (!writing) {
            spinner.start('Writing FESM and DTS bundles');
          }

          spinner.fail();
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
            entryName: 'index',
            // entryName: ngEntryPoint.flatModuleFile,
            moduleName: ngEntryPoint.moduleId,
            dir: declarationsDir,
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
      const entryPoints = graph.filter(isEntryPoint);
      for (const file of cacheRollup.types) {
        if (file.type !== 'chunk' || !file.fileName.endsWith('.d.ts')) {
          continue;
        }

        const dtsFile = ensureUnixPath(join(declarationsDir, file.fileName));
        const cachedSourceFile = cache.sourcesFileCache.get(dtsFile);
        if (cachedSourceFile?.sourceFile?.text === file.code) {
          // Contents of the file is exact
          continue;
        }

        cache.sourcesFileCache.delete(dtsFile);
        cache.analysesSourcesFileCache.delete(dtsFile);

        const changedFileUrl = fileUrl(dtsFile);
        const nodeToClean = graph.find(node => changedFileUrl === node.url);
        if (!nodeToClean) {
          continue;
        }

        for (const entryPoint of entryPoints) {
          if (isPending(entryPoint)) {
            continue;
          }

          if (entryPoint.dependents.has(nodeToClean)) {
            entryPoint.state = STATE_PENDING;
          }
        }
      }
    } catch (error) {
      spinner.fail();
      throw error;
    }

    if (cacheDirectory) {
      await saveCacheEntry(cacheDirectory, cacheKey, cacheRollup);
    }
  });
