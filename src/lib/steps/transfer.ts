
import * as path from 'path';
import {
  NgPackageData,
  SCOPE_NAME_SEPARATOR,
  ESM2015_FOLDER,
  ESM5_FOLDER,
  BUNDLES_FOLDER
} from './../model/ng-package-data';
import { copyFiles } from './../util/copy';

/**
 * Copies compiled source files from the build directory to the correct locations in the destination directory.
 *
 * @param ngPkg Angular package data.
 */
export async function copySourceFilesToDestination(ngPkg: NgPackageData): Promise<void> {
  await copyFiles(`${ngPkg.buildDirectory}/${BUNDLES_FOLDER}/**/*.{js,js.map}`,
    path.resolve(ngPkg.rootDestinationPath, BUNDLES_FOLDER));
  await copyFiles(`${ngPkg.buildDirectory}/${ESM5_FOLDER}/**/*.{js,js.map}`,
    path.resolve(ngPkg.rootDestinationPath, ESM5_FOLDER))
  await copyFiles(`${ngPkg.buildDirectory}/${ESM2015_FOLDER}/**/*.{js,js.map}`,
    path.resolve(ngPkg.rootDestinationPath, ESM2015_FOLDER))
  await copyFiles(`${ngPkg.buildDirectory}/**/*.{d.ts,metadata.json}`,
    ngPkg.destinationPath);
}
