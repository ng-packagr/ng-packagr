import * as path from 'path';
import { TransformResult } from 'rollup';
import { CompilerOptions, ModuleKind, ModuleResolutionKind, ScriptTarget, transpileModule } from 'typescript';

import * as log from '../utils/log';

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
export function downlevelCodeWithTsc(code: string, filePath: string): TransformResult {
  log.debug(`tsc ${filePath}`);
  const compilerOptions: CompilerOptions = {
    ...COMPILER_OPTIONS,
    mapRoot: path.dirname(filePath),
  };

  const { outputText, sourceMapText } = transpileModule(code, {
    compilerOptions,
  });

  return {
    code: outputText,
    map: JSON.parse(sourceMapText),
  };
}
