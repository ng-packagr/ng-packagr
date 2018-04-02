import { rollupBundleFile } from './rollup';
import { minifyJsFile } from './uglify';
import { downlevelCodeWithTsc } from '../ts/downlevel-transformer';

export interface FlattenOpts {
  entryFile: string;
  destFile: string;
  flatModuleFile: string;

  /** ECMAScript module ID defined by the FESM bundles. */
  esmModuleId: string;

  /** UMD ID defined by the UMD bundle. */
  umdModuleId: string;

  /** AMD ID defined in the UMD bundle. */
  amdId?: string;

  /** Map of external UMD module IDs (dependencies).  */
  umdModuleIds?: { [key: string]: string };
}

export async function flattenToFesm(opts: FlattenOpts): Promise<void> {
  return rollupBundleFile({
    moduleName: opts.esmModuleId,
    entry: opts.entryFile,
    format: 'es',
    dest: opts.destFile
  });
}

export async function flattenToUmd(opts: FlattenOpts): Promise<void> {
  return rollupBundleFile({
    transform: downlevelCodeWithTsc,
    moduleName: opts.umdModuleId,
    entry: opts.entryFile,
    format: 'umd',
    dest: opts.destFile,
    amd: { id: opts.amdId },
    umdModuleIds: {
      ...opts.umdModuleIds
    }
  });
}

export async function flattenToUmdMin(entryFile: string, outputFile: string): Promise<string> {
  return minifyJsFile(entryFile, outputFile);
}
