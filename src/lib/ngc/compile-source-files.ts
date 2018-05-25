import * as fs from 'fs-extra';
import * as ng from '@angular/compiler-cli';
import * as ts from 'typescript';
import * as path from 'path';
import { TsConfig } from '../ts/tsconfig';
import * as log from '../util/log';
import { createEmitCallback } from './create-emit-callback';
import { redirectWriteFileCompilerHost } from '../ts/redirect-write-file-compiler-host';

export async function compileSourceFiles(
  tsConfig: TsConfig,
  readResourcesResolver: (fileName: string) => string | undefined,
  extraOptions?: Partial<ng.CompilerOptions>,
  declarationDir?: string
) {
  log.debug(`ngc (v${ng.VERSION.full})`);

  const tsConfigOptions: ng.CompilerOptions = { ...tsConfig.options, ...extraOptions };

  let tsCompilerHost = ts.createCompilerHost(tsConfigOptions);
  if (declarationDir) {
    tsCompilerHost = redirectWriteFileCompilerHost(tsCompilerHost, tsConfigOptions.basePath, declarationDir);
  }

  // ng.CompilerHost
  const ngCompilerHost = ng.createCompilerHost({
    options: tsConfigOptions,
    tsHost: tsCompilerHost
  });

  // This is used in combination with 'enableResourceInlining' to read file contents of templates and stylesheets
  ngCompilerHost.readResource = readResourcesResolver;

  const program = ng.createProgram({
    rootNames: tsConfig.rootNames,
    options: tsConfigOptions,
    host: ngCompilerHost
  });

  const result = program.emit({
    emitCallback: createEmitCallback(tsConfigOptions),
    emitFlags: tsConfig.emitFlags
  });

  // XX(hack): redirect the `*.metadata.json` to the correct outDir
  // @link https://github.com/angular/angular/pull/21787
  if (declarationDir) {
    const flatModuleFile = tsConfigOptions.flatModuleOutFile;
    const flatModuleFileExtension = path.extname(flatModuleFile);
    const metadataBundleFile = flatModuleFile.replace(flatModuleFileExtension, '.metadata.json');
    const metadataSrc = path.resolve(tsConfigOptions.declarationDir, metadataBundleFile);
    const metadataDest = path.resolve(declarationDir, metadataBundleFile);
    if (metadataDest !== metadataSrc && fs.existsSync(metadataSrc)) {
      await fs.move(metadataSrc, metadataDest, { overwrite: true });
    }
  }

  const exitCode = ng.exitCodeFromResult(result.diagnostics);
  return exitCode === 0 ? Promise.resolve() : Promise.reject(new Error(ng.formatDiagnostics(result.diagnostics)));
}
