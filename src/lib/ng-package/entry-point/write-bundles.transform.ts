import ora from 'ora';
import { dirname } from 'path';
import { downlevelCodeWithTsc } from '../../flatten/downlevel-plugin';
import { rollupBundleFile } from '../../flatten/rollup';
import { transformFromPromise } from '../../graph/transform';
import { generateKey, readCacheEntry, saveCacheEntry } from '../../utils/cache';
import { directoryHash } from '../../utils/directory-hash';
import { mkdir, writeFile } from '../../utils/fs';
import { debug } from '../../utils/log';
import { EntryPointNode, isEntryPointInProgress } from '../nodes';
import { NgPackagrOptions } from '../options.di';

export const writeBundlesTransform = ({ cacheEnabled, cacheDirectory, watch }: NgPackagrOptions) =>
  transformFromPromise(async graph => {
    const entryPoint: EntryPointNode = graph.find(isEntryPointInProgress());
    const { destinationFiles, entryPoint: ngEntryPoint, tsConfig } = entryPoint.data;
    const cache = entryPoint.cache;
    const { fesm2020, fesm2015, esm2020 } = destinationFiles;

    const spinner = ora({
      hideCursor: false,
      discardStdin: false,
    });

    let key: string | undefined;
    let dirHash: string | undefined;
    let result: any;
    let newCache:
      | {
          fesm2015?: {
            map: any;
            code: string;
          };
          fesm2020?: {
            map: any;
            code: string;
          };
          directoryHash: string;
        }
      | undefined;

    try {
      spinner.start('Generating FESM2020');
      if (cacheEnabled) {
        key = generateKey(esm2020);
        dirHash = await directoryHash(dirname(esm2020));
        result = await readCacheEntry(cacheDirectory, key);
      }

      if (cacheEnabled && result?.directoryHash === dirHash) {
        debug(`FESM: writing cached FESM2020.`);
        const { fesm2020: cachedFesm2020 } = result;

        await mkdir(dirname(fesm2020), { recursive: true });
        await Promise.all([
          writeFile(fesm2020, cachedFesm2020.code),
          writeFile(`${fesm2020}.map`, JSON.stringify(cachedFesm2020.map)),
        ]);
      } else {
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
        });

        if (watch) {
          cache.rollupFESM2020Cache = rollupFESMCache;
        }

        newCache = {
          directoryHash: dirHash,
          fesm2020: {
            code,
            map,
          },
        };
      }

      spinner.succeed();
    } catch (error) {
      spinner.fail();
      throw error;
    }

    try {
      spinner.start('Generating FESM2015');
      if (cacheEnabled && result?.directoryHash === dirHash) {
        debug(`FESM: writing cached FESM2015.`);
        const { fesm2015: cachedFesm2015 } = result;

        await mkdir(dirname(fesm2015), { recursive: true });
        await Promise.all([
          writeFile(fesm2015, cachedFesm2015.code),
          writeFile(`${fesm2015}.map`, JSON.stringify(cachedFesm2015.map)),
        ]);
      } else {
        const {
          cache: rollupFESMCache,
          code,
          map,
        } = await rollupBundleFile({
          sourceRoot: tsConfig.options.sourceRoot,
          entry: esm2020,
          moduleName: ngEntryPoint.moduleId,
          transform: (code, id) => downlevelCodeWithTsc(code, id, cacheEnabled && cacheDirectory),
          dest: fesm2015,
          cache: cache.rollupFESM2015Cache,
        });
        if (watch) {
          cache.rollupFESM2015Cache = rollupFESMCache;
        }

        newCache.fesm2015 = {
          code,
          map,
        };
      }

      if (cacheEnabled && newCache) {
        await saveCacheEntry(cacheDirectory, key, JSON.stringify(newCache));
      }

      spinner.succeed();
    } catch (error) {
      spinner.fail();
      throw error;
    }
  });
