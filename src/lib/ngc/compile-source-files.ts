import * as fs from 'fs-extra';
import * as ng from '@angular/compiler-cli';
import * as ts from 'typescript';
import * as path from 'path';
import { createCompilerHostForSynthesizedSourceFiles } from '../ts/synthesized-compiler-host';
import { redirectWriteFileCompilerHost } from '../ts/redirect-write-file-compiler-host';
import { TsConfig } from '../ts/tsconfig';
import * as log from '../util/log';
import { createEmitCallback } from './create-emit-callback';

export async function compileSourceFiles(sourceFiles: ts.SourceFile[], tsConfig: TsConfig, outDir?: string) {
  log.debug(`ngc (v${ng.VERSION.full})`);

  // ts.CompilerHost
  let tsCompilerHost = createCompilerHostForSynthesizedSourceFiles(sourceFiles, tsConfig.options);
  if (typeof outDir === 'string' && outDir.length) {
    // Redirect file output
    tsCompilerHost = redirectWriteFileCompilerHost(tsCompilerHost, tsConfig.options.basePath, outDir);
  } else {
    outDir = tsConfig.options.outDir;
  }

  // ng.CompilerHost
  const ngCompilerHost = ng.createCompilerHost({
    options: tsConfig.options,
    tsHost: tsCompilerHost
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

  const flatModuleFile = tsConfig.options.flatModuleOutFile;
  const flatModuleFileExtension = path.extname(flatModuleFile);

  // XX(hack): redirect the `*.metadata.json` to the correct outDir
  // @link https://github.com/angular/angular/pull/21787
  const metadataBundleFile = flatModuleFile.replace(flatModuleFileExtension, '.metadata.json');
  const metadataSrc = path.resolve(tsConfig.options.outDir, metadataBundleFile);
  const metadataDest = path.resolve(outDir, metadataBundleFile);
  if (metadataDest !== metadataSrc && fs.existsSync(metadataSrc)) {
    await fs.move(metadataSrc, metadataDest);
  }

  const exitCode = ng.exitCodeFromResult(result.diagnostics);
  if (exitCode === 0) {
    return Promise.resolve({
      js: path.resolve(outDir, flatModuleFile),
      metadata: metadataDest,
      typings: path.resolve(outDir, flatModuleFile.replace(flatModuleFileExtension, '.d.ts'))
    });
  } else {
    return Promise.reject(new Error(ng.formatDiagnostics(result.diagnostics)));
  }
}
