import { main as tsc } from '@angular/tsc-wrapped';
import { NgPackage } from '../model/ng-package';
import { readJson, writeJson } from '../util/json';
import { fileExists } from '../util/fs';
import { debug } from '../util/log';
import * as path from 'path';


export const prepareTsConfig = async (ngPkg: NgPackage, outFile: string): Promise<string> => {

  const defaultConfigs = await readJson(path.resolve(__dirname, '..', 'conf', 'tsconfig.ngc.json'));

  defaultConfigs['angularCompilerOptions']['flatModuleId'] = ngPkg.packageJson.name;
  defaultConfigs['angularCompilerOptions']['flatModuleOutFile'] = `${ngPkg.flatModuleFileName}.js`;

  defaultConfigs['files'] = [ ngPkg.ngPackageJson.lib.entryFile ];

  const localTSConfigPath = path.resolve(ngPkg.projectPath, 'tsconfig.json');
  if (fileExists(localTSConfigPath)) {
    const localConfigs = await readJson(localTSConfigPath);
    if (localConfigs['exclude'] instanceof Array) {
      defaultConfigs['exclude'] = [].concat(defaultConfigs['exclude'], localConfigs['exclude']);
    }
  }

  await writeJson(defaultConfigs, outFile);

  return outFile;
}


/**
 * Compiles typescript sources with 'ngc'.
 *
 * @param basePath
 */
export const ngc = async (tsconfig: string, basePath: string): Promise<string> => {
  debug(`ngc ${tsconfig}, { basePath: ${basePath} })`);

  await tsc(tsconfig, { basePath });
  const configs = await readJson(tsconfig);
  return `${basePath}/${configs.compilerOptions.outDir}/${configs.angularCompilerOptions.flatModuleOutFile}`;
}
