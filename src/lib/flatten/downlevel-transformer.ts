import { ModuleKind, ScriptTarget, CompilerOptions, transpileModule, ModuleResolutionKind } from 'typescript';
import { RawSourceMap } from 'rollup';
import * as path from 'path';

import * as log from '../util/log';

/**
 * Base `tsc` `CompilerOptions` shared among various downleveling methods.
 */
const COMPILER_OPTIONS: CompilerOptions = {
  target: ScriptTarget.ES5,
  module: ModuleKind.ES2015,
  allowJs: true,
  sourceMap: true,
  importHelpers: true,
  downlevelIteration: true,
  moduleResolution: ModuleResolutionKind.NodeJs
};

/**
 * Downlevels a .js file from `ES2015` to `ES5`. Internally, uses `tsc`.
 *
 * Required for some external as they contains `ES2015` syntax such as `const` and `let`
 */
export function downlevelCodeWithTsc(code: string, filePath: string): Promise<{ code: string; map: RawSourceMap }> {
  log.debug(`tsc ${filePath}`);

  const compilerOptions: CompilerOptions = {
    ...COMPILER_OPTIONS,
    mapRoot: path.dirname(filePath)
  };

  const { outputText, sourceMapText } = transpileModule(code, {
    compilerOptions
  });

  return Promise.resolve({
    code: outputText,
    map: JSON.parse(sourceMapText)
  });
}
