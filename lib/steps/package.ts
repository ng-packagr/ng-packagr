import { NgPackageConfig } from '../interfaces';
const fs = require('fs');
const path = require('path');

const GROUP_NAME_SEPARATOR = '/';

/**
 * Reads a JSON file.
 *
 * @param file Source file
 */
export const readJson = (file: string): Promise<any> => {

  return new Promise((resolve, reject) => {
    fs.readFile(`${file}`, (err, data) => {
      if (err) {
        reject(err);
      }

      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(e);
      }
    });

  });
}


/**
 * Reads an Angular package definition file from 'ng-package.json'
 *
 * @param package `ng-package.json` definition file
 */
export const readPackage = (ngPkg: string): Promise<NgPackageConfig> => {
  const base = path.dirname(ngPkg);

  return readJson(ngPkg)
    .then((p: NgPackageConfig) => {
      // resolve pathes relative to `ng-package.json` file
      p.src = path.resolve(base, p.src);
      p.dest = path.resolve(base, p.dest);
      p.workingDirectory = path.resolve(base, p.workingDirectory);
      p.ngc.tsconfig = path.resolve(base, p.ngc.tsconfig);
      p.rollup.config = path.resolve(base, p.rollup.config);

      return Promise.resolve(p);
    });
}


/**
 * Prepares an Angular package from reading 'package.json'
 *
 * @param src Source directory containg `package.json` file
 */
export const preparePackage = (src: string): Promise<any> => {

  return readJson(`${src}/package.json`)
    .then((pkg) => {
      let sourcePackage: any = {};
      sourcePackage.pkg = pkg;

      // read metadata from package
      sourcePackage.meta = {};
      sourcePackage.meta.name = `${sourcePackage.pkg.name}`;

      // split into name and prefix (@<group>/name)
      if (sourcePackage.pkg.name.includes(GROUP_NAME_SEPARATOR)) {
        const idx = `${sourcePackage.pkg.name}`.indexOf(GROUP_NAME_SEPARATOR);
        sourcePackage.meta.prefix = `${sourcePackage.pkg.name}`.substring(0, idx);
        sourcePackage.meta.name = `${sourcePackage.pkg.name}`.substring(idx + 1);
      } else {
        sourcePackage.meta.prefix = `${sourcePackage.pkg.name}`;
      }

      // set destination paths for package
      sourcePackage.dest = {};
      sourcePackage.dest.main = `bundles/${sourcePackage.meta.name}.umd.js`;
      sourcePackage.dest.module = `${sourcePackage.meta.prefix}/${sourcePackage.meta.name}.es5.js`;
      sourcePackage.dest.es2015 = `${sourcePackage.meta.prefix}/${sourcePackage.meta.name}.js`;
      sourcePackage.dest.typings = `src/index.d.ts`;

      return Promise.resolve(sourcePackage);
    });

}


/**
 * Creates a `package.json` file from 'packages/*' to 'dist/@prefix/*'
 *
 * @param src Source folder
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

      return new Promise((resolve, reject) => {

        const content = JSON.stringify(packageJson, undefined, 4);
        fs.writeFile(`${dest}/package.json`, content, (err) => {
          if (err) {
            reject(err);
          }

          resolve();
        });
      });

    });

}
