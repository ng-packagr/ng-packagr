import { main as tsc } from '@angular/tsc-wrapped';
import { NgPackage } from '../model/ng-package';
import { readJson, writeJson } from '../util/json';
import { debug } from '../util/log';

const path = require('path');


export const prepareTsConfig = (ngPkg: NgPackage, outFile: string): Promise<string> => {

  return readJson(path.resolve(__dirname, '..', 'conf', 'tsconfig.ngc.json'))
    .then((tsConfig: any) => {

      tsConfig['angularCompilerOptions']['flatModuleId'] = ngPkg.packageJson.name;
      tsConfig['angularCompilerOptions']['flatModuleOutFile'] = `${ngPkg.flatModuleFileName}.js`;

      tsConfig['files'] = [ ngPkg.ngPackageJson.lib.entryFile ];

      return writeJson(tsConfig, outFile)
        .then(() => Promise.resolve(outFile));
    });
}


/**
 * Compiles typescript sources with 'ngc'.
 *
 * @param basePath
 */
export const ngc = (tsconfig: string, basePath: string): Promise<string> => {
  debug(`ngc ${tsconfig}, { basePath: ${basePath} })`);

  return tsc(tsconfig, { basePath })
    .then(() => readJson(tsconfig)
      .then(v => `${basePath}/${v.compilerOptions.outDir}/${v.angularCompilerOptions.flatModuleOutFile}`));
}
