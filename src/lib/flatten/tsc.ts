import * as path from 'path';
import { SourceDescription } from 'rollup';
import { ScriptTarget, ModuleKind, TranspileOutput, transpileModule, CompilerOptions } from 'typescript';
import { debug } from '../util/log';

/**
 * Downlevels a .js file from ES2015 to ES5. Internally, uses `tsc`.
 *
 */
export async function downlevelWithTsc(code: string, filePath: string): Promise<SourceDescription> {
  debug(`tsc ${filePath}`);
  const compilerOptions: CompilerOptions = {
    target: ScriptTarget.ES5,
    module: ModuleKind.ES2015,
    allowJs: true,
    sourceMap: true,
    importHelpers: true,
    downlevelIteration: true,
    mapRoot: path.dirname(filePath)
  };
  const transpiled: TranspileOutput = transpileModule(code, {
    compilerOptions
  });

  return {
    code: transpiled.outputText,
    map: transpiled.sourceMapText
  };
}
