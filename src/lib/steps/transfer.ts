import { NgPackageData, SCOPE_NAME_SEPARATOR } from './../model/ng-package-data';
import { copyFiles } from './../util/copy';
import { ESM5_DIR_NAME, ESM2015_DIR_NAME, BUNDLES_DIR_NAME } from '../model/ng-artifacts-factory';

/**
 * Copies compiled source files from the build directory to the correct locations in the destination directory.
 *
 * @param ngPkg Angular package data.
 * @param baseBuildPath Path to where the source files are staged.
 */
export async function copySourceFilesToDestination(ngPkg: NgPackageData, baseBuildPath: string): Promise<void> {
  await copyFiles(`${ngPkg.buildDirectory}/${BUNDLES_DIR_NAME}/**/*.{js,js.map}`, `${ngPkg.rootDestinationPath}/${BUNDLES_DIR_NAME}`);
  await copyFiles(`${ngPkg.buildDirectory}/${ESM5_DIR_NAME}/**/*.{js,js.map}`, `${ngPkg.rootDestinationPath}/${ESM5_DIR_NAME}`);
  await copyFiles(`${ngPkg.buildDirectory}/${ESM2015_DIR_NAME}/**/*.{js,js.map}`, `${ngPkg.rootDestinationPath}/${ESM2015_DIR_NAME}`);
  await copyFiles(`${baseBuildPath}/**/*.{d.ts,metadata.json}`, ngPkg.destinationPath);
}
