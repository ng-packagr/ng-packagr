import * as path from 'path';
import { remapSourceMap } from '../sourcemaps/remap';
import * as log from '../util/log';
import { rollupBundleFile } from './rollup';
import { downlevelWithTsc } from './tsc';
import { minifyJsFile } from './uglify';

export interface FlattenOpts {
  entryFile: string;
  outDir: string;
  flatModuleFile: string;
  esmModuleId: string;
  umdModuleId: string;

  /** List of module ids that should be embedded to the bundle. */
  embedded?: string[];

  /** Map of external UMD module ids that  */
  umdModuleIds?: { [key: string]: string };
}

export async function writeFlatBundleFiles(opts: FlattenOpts) {
  log.info('Bundling to FESM15');
  const fesm15File = await flattenToFesm15(opts);
  await remapSourceMap(fesm15File);

  log.info('Bundling to FESM5');
  const fesm5File = await flattenToFesm5({ ...opts, entryFile: fesm15File });
  await remapSourceMap(fesm5File);

  log.info('Bundling to UMD');
  const umdFile = await flattenToUmd({ ...opts, entryFile: fesm5File });
  await remapSourceMap(umdFile);

  log.info('Minifying UMD bundle');
  const minUmdFile = await flattenToUmdMin({ ...opts, entryFile: umdFile });
  await remapSourceMap(minUmdFile);
}

export async function flattenToFesm15(opts: FlattenOpts): Promise<string> {
  const destFile = path.resolve(opts.outDir, 'esm2015', opts.flatModuleFile + '.js');

  await rollupBundleFile({
    moduleName: opts.esmModuleId,
    entry: opts.entryFile,
    format: 'es',
    dest: destFile,
    embedded: opts.embedded
  });

  return destFile;
}

export async function flattenToFesm5(opts: FlattenOpts): Promise<string> {
  const destFile = path.resolve(opts.outDir, 'esm5', opts.flatModuleFile + '.js');

  await downlevelWithTsc(opts.entryFile, destFile);

  return destFile;
}

export async function flattenToUmd(opts: FlattenOpts): Promise<string> {
  const destFile = path.resolve(opts.outDir, 'bundles', opts.flatModuleFile + '.umd.js');
  const { embedded = [] } = opts;

  await rollupBundleFile({
    moduleName: opts.umdModuleId,
    entry: opts.entryFile,
    format: 'umd',
    dest: destFile,
    umdModuleIds: {
      ...opts.umdModuleIds
    },
    embedded: ['tslib', ...embedded]
  });

  return destFile;
}

export async function flattenToUmdMin(opts: FlattenOpts): Promise<string> {
  return minifyJsFile(opts.entryFile);
}
