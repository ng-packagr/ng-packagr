import {
  ModuleKind,
  ScriptTarget,
  createCompilerHost,
  CompilerOptions,
  createProgram,
  formatDiagnostics,
  transpileModule
} from 'typescript';
import { RawSourceMap } from 'source-map';
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
  downlevelIteration: true
};

/**
 * Downlevels a .js file from `ES2015` to `ES5`. Internally, uses `tsc`.
 *
 */
export function downlevelEmitWithTsc(entryPoint: string, outDir: string): Promise<void> {
  log.debug(`tsc downlevel ${entryPoint}`);

  const compilerOptions: CompilerOptions = {
    ...COMPILER_OPTIONS,
    mapRoot: path.dirname(entryPoint),
    outDir
  };

  const compilerHost = createCompilerHost(compilerOptions);
  const program = createProgram([entryPoint], compilerOptions, compilerHost);
  const emitResult = program.emit();

  return emitResult.emitSkipped
    ? Promise.reject(new Error(formatDiagnostics(emitResult.diagnostics, compilerHost)))
    : Promise.resolve();
}

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
