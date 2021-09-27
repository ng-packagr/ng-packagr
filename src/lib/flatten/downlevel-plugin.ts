import { ModuleKind, ScriptTarget, CompilerOptions, transpileModule, ModuleResolutionKind } from 'typescript';
import { TransformResult } from 'rollup';
import * as path from 'path';

import * as log from '../utils/log';
import { generateKey, readCacheEntry, saveCacheEntry } from '../utils/cache';

/**
 * Base `tsc` `CompilerOptions` shared among various downleveling methods.
 */
const COMPILER_OPTIONS: CompilerOptions = {
  target: ScriptTarget.ES2015,
  module: ModuleKind.ESNext,
  allowJs: true,
  sourceMap: true,
  importHelpers: true,
  downlevelIteration: true,
  moduleResolution: ModuleResolutionKind.Classic,
};

/**
 * Downlevels a .js file from `ES2015` to `ES2015`. Internally, uses `tsc`.
 */
export async function downlevelCodeWithTsc(
  code: string,
  filePath: string,
  cacheDirectory?: false | string,
): Promise<TransformResult> {
  log.debug(`tsc ${filePath}`);

  const key = generateKey(code);
  if (cacheDirectory) {
    const result = await readCacheEntry(cacheDirectory, key);
    if (result) {
      return result;
    }
  }

  const compilerOptions: CompilerOptions = {
    ...COMPILER_OPTIONS,
    mapRoot: path.dirname(filePath),
  };

  const { outputText, sourceMapText } = transpileModule(code, {
    compilerOptions,
  });

  if (cacheDirectory) {
    saveCacheEntry(
      cacheDirectory,
      key,
      JSON.stringify({
        code: outputText,
        map: sourceMapText,
      }),
    );
  }
  return {
    code: outputText,
    map: JSON.parse(sourceMapText),
  };
}
