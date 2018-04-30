import * as fs from 'fs-extra';
import * as ng from '@angular/compiler-cli/src/perform_compile';
import * as ngTs from '@angular/compiler-cli/src/transformers/entry_points';
import { VERSION as NG_VERSION } from '@angular/compiler-cli/src/version';
import * as ts from 'typescript';
import * as path from 'path';
import { createCompilerHostForSynthesizedSourceFiles } from '../ts/synthesized-compiler-host';
import { TsConfig } from '../ts/tsconfig';
import * as log from '../util/log';
import { createEmitCallback } from './create-emit-callback';
import { redirectWriteFileCompilerHost } from '../ts/redirect-write-file-compiler-host';

export async function compileSourceFiles(
  sourceFiles: ts.SourceFile[],
  tsConfig: TsConfig,
  outDir?: string,
  declarationDir?: string
) {
  log.debug(`ngc (v${NG_VERSION.full})`);

  const tsConfigOptions = { ...tsConfig.options };
  if (outDir) {
    tsConfigOptions.outDir = outDir;
  }

  // ts.CompilerHost
  let tsCompilerHost = createCompilerHostForSynthesizedSourceFiles(sourceFiles, tsConfigOptions);
  if (declarationDir) {
    tsCompilerHost = redirectWriteFileCompilerHost(tsCompilerHost, tsConfig.options.baseUrl, declarationDir);
  }

  // ng.CompilerHost
  const ngCompilerHost = ngTs.createCompilerHost({
    options: tsConfigOptions,
    tsHost: tsCompilerHost
  });

  // ng.Program
  const ngProgram = ngTs.createProgram({
    rootNames: tsConfig.rootNames,
    options: tsConfigOptions,
    host: ngCompilerHost
  });

  // ngc
  const result = ng.performCompilation({
    rootNames: tsConfig.rootNames,
    options: tsConfigOptions,
    emitCallback: createEmitCallback(tsConfigOptions),
    host: ngCompilerHost,
    oldProgram: ngProgram
  });

  const flatModuleFile = tsConfigOptions.flatModuleOutFile;
  const flatModuleFileExtension = path.extname(flatModuleFile);

  // XX(hack): redirect the `*.metadata.json` to the correct outDir
  // @link https://github.com/angular/angular/pull/21787
  const metadataBundleFile = flatModuleFile.replace(flatModuleFileExtension, '.metadata.json');
  const metadataSrc = path.resolve(tsConfigOptions.declarationDir, metadataBundleFile);
  const metadataDest = path.resolve(declarationDir, metadataBundleFile);
  if (metadataDest !== metadataSrc && fs.existsSync(metadataSrc)) {
    await fs.move(metadataSrc, metadataDest, { overwrite: true });
  }

  const exitCode = ng.exitCodeFromResult(result.diagnostics);
  return exitCode === 0 ? Promise.resolve() : Promise.reject(new Error(ng.formatDiagnostics(result.diagnostics)));
}
