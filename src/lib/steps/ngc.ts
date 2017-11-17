import * as fs from 'fs';
import * as path from 'path';
import { performCompilation, readConfiguration, AngularCompilerOptions, Diagnostic } from '@angular/compiler-cli';
import { NgPackageData } from '../model/ng-package-data';
import { readJson, writeJson } from 'fs-extra';
import { debug, error, warn, info } from '../util/log';


async function prepareTsConfig(ngPkg: NgPackageData, outFile: string): Promise<void> {
  const tsConfigPath: string = path.resolve(__dirname, '..', 'conf', 'tsconfig.ngc.json');
  debug('prepareTsConfig: Resolved tsconfig path to ' + tsConfigPath);

  const tsConfig: any = await readJson(tsConfigPath);

  const compilerOptions: AngularCompilerOptions = tsConfig.angularCompilerOptions;
  compilerOptions.flatModuleId = ngPkg.fullPackageName;
  compilerOptions.flatModuleOutFile = `${ngPkg.flatModuleFileName}.js`;

  tsConfig['files'] = [ ngPkg.entryFile ];

  if (ngPkg.jsxConfig) {
    debug('prepareTsConfig: Applying jsx flag to tsconfig ' + ngPkg.jsxConfig);
    tsConfig['compilerOptions']['jsx'] = ngPkg.jsxConfig;
  }

  await writeJson(outFile, tsConfig);
}

// function isTSDiagnostic(diagnostic: Diagnostic | ts.Diagnostic): diagnostic is ts.Diagnostic {
//     return (<ts.Diagnostic>diagnostic).file !== undefined;
// }

/**
 * Compiles typescript sources with 'ngc'.
 *
 * @param ngPkg Angular package data
 * @param basePath
 */
export async function ngc(ngPkg: NgPackageData, basePath: string): Promise<string> {
  const tsConfigPath: string = `${basePath}/tsconfig.lib.json`;
  debug(`ngc ${tsConfigPath}, { basePath: ${basePath} })`);

  await prepareTsConfig(ngPkg, tsConfigPath);

  // invoke ngc programmatic API
  const compilerConfig = readConfiguration(tsConfigPath);
  const compilerResult = performCompilation(compilerConfig);

  if (!compilerResult.emitResult) {
    let hasError = false;
    for (const diagnostic of compilerResult.diagnostics) {
      let msg = diagnostic.messageText;
      //   if (isTSDiagnostic(diagnostic) && diagnostic.file) {
      //       msg += ` in ${diagnostic.file.fileName}`
      //   }
      switch (diagnostic.category) {
        case 0:
          warn("Warning: " + msg);
          break;
        case 1:
          error(`Error: [${diagnostic.code}] ` + msg);
          hasError = true;
          break;
        default:
          info(msg.toString());
        }
      }

      if (hasError) {
        throw new Error("Build Error");
      }
  }

  debug('Reading tsconfig from ' + tsConfigPath);
  const tsConfig = await readJson(tsConfigPath);

  return `${basePath}/${tsConfig.compilerOptions.outDir}/${tsConfig.angularCompilerOptions.flatModuleOutFile}`;
}
