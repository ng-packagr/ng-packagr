import { NgPackageConfig } from '../conf/ng-package.conf';
import { NgPackage } from '../model/ng-package';
import { readJson, writeJson } from './json';

const fs = require('fs');
const path = require('path');


/**
 * Reads an Angular package definition file from 'ng-package.json'
 *
 * @param file `ng-package.json` definition file
 */
export const readPackage = (file: string): Promise<NgPackage> => {
  const base = path.dirname(file);

  return readJson(file)
    .then((ngPkg: NgPackageConfig) => {
      // resolve pathes relative to `ng-package.json` file
      const dir = path.resolve(base, ngPkg.src || '.');

      return readJson(`${dir}/package.json`)
        .then((pkg) => Promise.resolve(new NgPackage(base, ngPkg, pkg)));
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
export const createPackage = (src: string, dest: string, additionalProperties?: {}): Promise<any> => {

  return readJson(`${src}/package.json`)
    .then((packageJson) => {

      // set additional properties
      if (additionalProperties) {
        Object.keys(additionalProperties).forEach((key) => {
          packageJson[key] = additionalProperties[key];
        });
      }

      return writeJson(packageJson, `${dest}/package.json`);
    });
}
