import { NgPackageData, SCOPE_NAME_SEPARATOR } from './../model/ng-package-data';
import { copyFiles } from './../util/copy';
import * as path from 'path';

/**
 * Copies compiled source files from the build directory to the correct locations in the destination directory.
 *
 * @param ngPkg Angular package data.
 */
export async function copySourceFilesToDestination(ngPkg: NgPackageData): Promise<void> {
  await copyFiles(`${ngPkg.buildDirectory}/bundles/**/*.{js,js.map}`,
    path.resolve(ngPkg.rootDestinationPath, 'bundles'));
  await copyFiles(`${ngPkg.buildDirectory}/esm5/**/*.{js,js.map}`,
    path.resolve(ngPkg.rootDestinationPath, 'esm5'))
  await copyFiles(`${ngPkg.buildDirectory}/esm2015/**/*.{js,js.map}`,
    path.resolve(ngPkg.rootDestinationPath, 'esm2015'))
  await copyFiles(`${ngPkg.buildDirectory}/**/*.{d.ts,metadata.json}`,
    ngPkg.destinationPath);
}
