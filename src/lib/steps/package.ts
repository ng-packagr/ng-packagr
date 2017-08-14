import * as path from 'path';
import { SchemaClass, SchemaClassFactory } from '@ngtools/json-schema';
import { NgPackageConfig } from '../../ng-package.schema';
import { NgPackage } from '../model/ng-package';
import { readJson, writeJson } from '../util/json';

const schemaPromise = readJson(path.resolve(__dirname, '..', '..', 'ng-package.schema.json'))
  .then((jsonSchema: any) => SchemaClassFactory<NgPackageConfig>(jsonSchema));

/**
 * Reads an Angular package definition file from 'ng-package.json'
 *
 * @param file path pointing to `ng-package.json` file
 */
export const readPackage = (file: string): Promise<NgPackage> => {
  const base = path.dirname(file);

  // read 'ng-package.json'
  return readJson(file).then((ngPkg: NgPackageConfig) => {
    // resolve pathes relative to `ng-package.json` file
    const dir = path.resolve(base, ngPkg.src || '.');

    // read 'package.json'
    return readJson(path.resolve(dir, 'package.json')).then((pkg: any) => {
      // read 'ng-package.schema.json'
      return schemaPromise.then((SchemaClass) => {
        const schema = new SchemaClass(ngPkg);

        return Promise.resolve(new NgPackage(pkg, ngPkg, base, schema));
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
export const createPackage = (src: string, dest: string, additionalProperties?: {}): Promise<any> => {

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
