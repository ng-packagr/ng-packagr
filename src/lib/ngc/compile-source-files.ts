import * as ng from '@angular/compiler-cli';
import * as ts from 'typescript';
import * as path from 'path';
import { createCompilerHostForSynthesizedSourceFiles } from '../ts/synthesized-compiler-host';
import { TsConfig } from '../ts/tsconfig';
import * as log from '../util/log';
import { createEmitCallback } from './create-emit-callback';

export async function compileSourceFiles(sourceFiles: ts.SourceFile[], tsConfig: TsConfig) {
  log.debug(`ngc (v${ng.VERSION.full})`);

  // ng.CompilerHost
  const ngCompilerHost = ng.createCompilerHost({
    options: tsConfig.options,
    tsHost: createCompilerHostForSynthesizedSourceFiles(sourceFiles, tsConfig.options)
  });

  // ng.Program
  const ngProgram = ng.createProgram({
    rootNames: [...tsConfig.rootNames],
    options: tsConfig.options,
    host: ngCompilerHost
  });

  // ngc
  const result = ng.performCompilation({
    rootNames: [...tsConfig.rootNames],
    options: tsConfig.options,
    emitFlags: tsConfig.emitFlags,
    emitCallback: createEmitCallback(tsConfig.options),
    host: ngCompilerHost,
    oldProgram: ngProgram
  });

  const exitCode = ng.exitCodeFromResult(result.diagnostics);
  if (exitCode === 0) {
    const outDir = tsConfig.options.outDir;
    const outFile = tsConfig.options.flatModuleOutFile;
    const extName = path.extname(outFile);

    return Promise.resolve({
      js: path.resolve(outDir, outFile),
      metadata: path.resolve(outDir, outFile.replace(extName, '.metadata.json')),
      typings: path.resolve(outDir, outFile.replace(extName, '.d.ts'))
    });
  } else {
    return Promise.reject(new Error(ng.formatDiagnostics(result.diagnostics)));
  }
}
