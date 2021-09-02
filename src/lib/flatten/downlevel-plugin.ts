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
export async function downlevelCodeWithTsc(code: string, filePath: string): Promise<TransformResult> {
  log.debug(`tsc ${filePath}`);
  const key = generateKey(code);

  const result = await readCacheEntry(key);
  if (result) {
    return result;
  }

  const compilerOptions: CompilerOptions = {
    ...COMPILER_OPTIONS,
    mapRoot: path.dirname(filePath),
  };

  const { outputText, sourceMapText } = transpileModule(code, {
    compilerOptions,
  });

  saveCacheEntry(
    key,
    JSON.stringify({
      code: outputText,
      map: sourceMapText,
    }),
  );

  return {
    code: outputText,
    map: JSON.parse(sourceMapText),
  };
}
