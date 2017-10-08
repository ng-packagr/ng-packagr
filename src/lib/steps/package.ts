import * as path from 'path';
import { SchemaClassFactory } from '@ngtools/json-schema';
import { NgPackageConfig } from '../../ng-package.schema';
import { NgPackage } from '../model/ng-package';
import { readJson, writeJson } from '../util/json';
import { merge, isArray } from 'lodash';
import * as log from '../util/log';

// this prevents array objects from getting merged to each other one by one
function arrayMergeLogic(objValue, srcValue) {
  if (isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

const schemaPromise = readJson(path.resolve(__dirname, '..', '..', 'ng-package.schema.json'))
  .then((jsonSchema: any) => SchemaClassFactory<NgPackageConfig>(jsonSchema));

const resolvePaths = (workingDirectory: string, packageConfig: NgPackageConfig): void => {
  if (packageConfig) {
    if (packageConfig.dest) {
      packageConfig.dest = path.resolve(workingDirectory, packageConfig.dest);
    }

    if (packageConfig.src) {
      packageConfig.src = path.resolve(workingDirectory, packageConfig.src);
    }
  }
};

const readNgPackageFile = (filePath: string): Promise<NgPackageConfig> => {

  log.debug('Searching for ng-package config at ' + filePath);
  return readJson(filePath)
    .then((ngPkg: NgPackageConfig) => {
      log.debug('Ng-package config found at ' + filePath);
      const basePath: string = path.dirname(filePath);
      resolvePaths(basePath, ngPkg);
      log.debug(JSON.stringify(ngPkg));
      return ngPkg;
    })
    .catch(error => {
      if (error.code === 'ENOENT') {
        log.debug('ng-package config file not found');
        // if the file does not exist, that's ok
        return Promise.resolve<NgPackageConfig>({});
      }

      return Promise.reject(error);
    });

};


/**
 * Reads an Angular package definition first from the passed in file path,
 * then from the default ng-package.json file,
 * then from package.json, and merges the json into one config object.
 *
 * @param workingDirectory path to the working directory
 * @param file path pointing to `ng-package.json` file
 */
export const readPackage = (file: string): Promise<NgPackage> => {

  if (!path.isAbsolute(file)) {
    file = path.resolve(process.cwd(), file);
  }

  const baseDirectory = path.dirname(file);

  // read custom ng-package config file
  let promiseChain = readNgPackageFile(file);

  const defaultPath = path.join(baseDirectory, 'ng-package.json');
  if (defaultPath !== file) {
    // read default ng-package config file
    promiseChain = promiseChain.then((ngPkg: NgPackageConfig) => {

      return readNgPackageFile(defaultPath)
        .then((otherNgPkg: NgPackageConfig) => {
          // merge both ng-package config objects
          return merge(ngPkg, otherNgPkg, arrayMergeLogic);
        });

    });
  }

  return promiseChain
    .then((ngPkg: NgPackageConfig) => {
      // resolve paths relative to `ng-package.json` file
      const dir = path.resolve(baseDirectory, ngPkg.src || '.');

      // read 'package.json'
      log.debug('loading package.json');
      return readJson(path.resolve(dir, 'package.json'))
        .then((pkg: any) => {
          // merge package.json ng-package config
          const finalPackageConfig = merge(ngPkg, pkg.ngPackage, arrayMergeLogic);

          // read 'ng-package.schema.json'
          return schemaPromise.then((SchemaClass) => {
            const schema = new SchemaClass(ngPkg);

            return new NgPackage(pkg, finalPackageConfig, dir, schema);
          });

      });
    });
}


/**
 * Creates a `package.json` file by reading one from the `src` folder, adding additional
 * properties, and writing to to `dest` folder
 *
 * @param src Source folder
 * @param dest Destination folder
 * @param additionalProperties These properties are added to the `package.json`
 */
export const writePackage = (src: string, dest: string, additionalProperties?: {}): Promise<any> => {

  return readJson(path.resolve(src, 'package.json')).then((packageJson) => {
    // set additional properties
    if (additionalProperties) {
      Object.keys(additionalProperties).forEach((key) => {
        packageJson[key] = additionalProperties[key];
      });
    }

    return writeJson(packageJson, `${dest}/package.json`);
  });
}
