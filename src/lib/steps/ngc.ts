import * as path from 'path';
import { main as tsc, AngularCompilerOptions } from '@angular/tsc-wrapped';
import { NgPackageData } from '../model/ng-package-data';
import { readJson, writeJson } from 'fs-extra';
import { debug } from '../util/log';


async function prepareTsConfig(ngPkg: NgPackageData, outFile: string): Promise<void> {
  const tsConfigPath: string = path.resolve(__dirname, '..', 'conf', 'tsconfig.ngc.json');
  debug('prepareTsConfig: Resolved tsconfig path to ' + tsConfigPath);

  const tsConfig: any = await readJson(tsConfigPath);

  const compilerOptions: AngularCompilerOptions = tsConfig.angularCompilerOptions;
  compilerOptions.flatModuleId = ngPkg.fullPackageName;
  compilerOptions.flatModuleOutFile = `${ngPkg.flatModuleFileName}.js`;

  tsConfig['files'] = [ ngPkg.entryFile ];

  await writeJson(outFile, tsConfig);
}


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
  await tsc(tsConfigPath, { basePath });

  debug('Reading tsconfig from ' + tsConfigPath);
  const tsConfig = await readJson(tsConfigPath);

  return `${basePath}/${tsConfig.compilerOptions.outDir}/${tsConfig.angularCompilerOptions.flatModuleOutFile}`;
}
