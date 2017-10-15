import { NgPackageData, SCOPE_NAME_SEPARATOR } from './../model/ng-package-data';
import { copyFiles } from './../util/copy';
import * as path from 'path';

/**
 * Copies compiled source files from the build directory to the correct locations in the destination directory.
 *
 * @param ngPkg Angular package data.
 * @param baseBuildPath Path to where the source files are staged.
 */
export async function copySourceFilesToDestination(ngPkg: NgPackageData, baseBuildPath: string): Promise<void> {
  const separatorIndex: number = ngPkg.fullPackageName.lastIndexOf(SCOPE_NAME_SEPARATOR);
  if (separatorIndex > -1) {
    const packageNameWithoutEndPart: string = ngPkg.fullPackageName.substring(0, separatorIndex);
    const destinationPath: string = path.resolve(ngPkg.rootDestinationPath, packageNameWithoutEndPart);
    await copyFiles(`${ngPkg.buildDirectory}/${packageNameWithoutEndPart}/**/*.{js,js.map}`, destinationPath);
  } else {
    await copyFiles(`${ngPkg.buildDirectory}/${ngPkg.fullPackageName}*.{js,js.map}`, ngPkg.rootDestinationPath);
  }

  await copyFiles(`${ngPkg.buildDirectory}/bundles/**/*.{js,js.map}`, `${ngPkg.rootDestinationPath}/bundles`);
  await copyFiles(`${baseBuildPath}/**/*.{d.ts,metadata.json}`, ngPkg.destinationPath);
}
