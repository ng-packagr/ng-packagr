import { NgPackageData, SCOPE_NAME_SEPARATOR } from './../model/ng-package-data';
import { copyFiles } from './../util/copy';

/**
 * Copies compiled source files from the build directory to the correct locations in the destination directory.
 *
 * @param ngPkg Angular package data.
 * @param baseBuildPath Path to where the source files are staged.
 */
export async function copySourceFilesToDestination(ngPkg: NgPackageData, baseBuildPath: string): Promise<void> {
  await Promise.all([
    copyFiles(`${ngPkg.buildDirectory}/bundles/**/*.{js,js.map}`, `${ngPkg.rootDestinationPath}/bundles`),
    copyFiles(`${ngPkg.buildDirectory}/esm5/**/*.{js,js.map}`, `${ngPkg.rootDestinationPath}/esm5`),
    copyFiles(`${ngPkg.buildDirectory}/esm2015/**/*.{js,js.map}`, `${ngPkg.rootDestinationPath}/esm2015`),
    copyFiles(`${baseBuildPath}/**/*.{d.ts,metadata.json}`, ngPkg.destinationPath)
  ]);
}
