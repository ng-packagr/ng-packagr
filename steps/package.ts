const fs = require('fs');
const path = require('path');

const GROUP_NAME_SEPARATOR = '/';

/**
 * Reads a `package.json` file.
 *
 * @param src Source folder containing the `package.json`
 */
export const readPackage = (src: string): Promise<any> => {

    return new Promise((resolve, reject) => {
        fs.readFile(`${src}/package.json`, (err, data) => {
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

export const preparePackage = (src: string): Promise<any> => {

    return readPackage(src)
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
                sourcePackage.meta.name   = `${sourcePackage.pkg.name}`.substring(idx + 1);
            } else {
                sourcePackage.meta.prefix = `${sourcePackage.pkg.name}`;
            }

            // set destination paths for package
            sourcePackage.dest = {};
            sourcePackage.dest.main    = `bundles/${sourcePackage.meta.name}.umd.js`;
            sourcePackage.dest.module  = `${sourcePackage.meta.prefix}/${sourcePackage.meta.name}.es5.js`;
            sourcePackage.dest.es2015  = `${sourcePackage.meta.prefix}/${sourcePackage.meta.name}.js`;
            sourcePackage.dest.typings = `src/index.d.ts`;

            return Promise.resolve(sourcePackage);
        });

}


/**
 * Creates a `package.json` file from 'packages/*' to 'dist/@orbis-u/*'
 *
 * @param src Source folder
 */
export const createPackage = (src: string, dest: string, additionalProperties?: {}): Promise<any> => {

    return readPackage(src)
        .then((packageJson) => {

            // set additional properties
            if (additionalProperties) {
                Object.keys(additionalProperties).forEach((key) => {
                    packageJson[key] = additionalProperties[key];
                });
            }

            return new Promise((resolve, reject) => {
                fs.writeFile(`${dest}/package.json`,  JSON.stringify(packageJson, undefined, 4), (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
            });

        });

}
