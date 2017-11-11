import * as path from 'path';
import { readJson, writeJson, readdir, lstat, Stats } from 'fs-extra';
import { merge, isArray } from 'lodash';
import { NgPackageConfig } from '../../ng-package.schema';
import { NgPackageData, DEFAULT_BUILD_FOLDER } from '../model/ng-package-data';
import { NgArtifacts } from '../model/ng-artifacts';
import { PackageSearchResult } from '../model/package-search-result';
import { tryReadJson } from '../util/json';
import * as log from '../util/log';

const PACKAGE_JSON_FILE_NAME = 'package.json';

// this prevents array objects from getting merged to each other one by one
function arrayMergeLogic(objValue, srcValue) {
  if (isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

// ensures paths are absolute by combining with working directory
function resolvePaths(workingDirectory: string, packageConfig: NgPackageConfig): void {
  if (packageConfig) {
    if (packageConfig.dest) {
      packageConfig.dest = path.resolve(workingDirectory, packageConfig.dest);
    }

    if (packageConfig.src) {
      packageConfig.src = path.resolve(workingDirectory, packageConfig.src);
    }
  }
};

async function readNgPackageFile(filePath: string): Promise<NgPackageConfig | null> {

  log.debug('Searching for ng-package config at ' + filePath);
  try {
    const ngPkg: NgPackageConfig = await readJson(filePath);
    log.debug('Ng-package config found at ' + filePath);
    const basePath: string = path.dirname(filePath);
    resolvePaths(basePath, ngPkg);
    return ngPkg;
  } catch (error) {
    if (error.code === 'ENOENT') {
      log.debug('ng-package config file not found');
      // if the file does not exist, that's ok
      return null;
    }
    throw error;
  }

}

function shouldExcludeFromDirectorySearch(searchDirectory: string, foldersToExclude: string[]) {
  for (const exclusionFolder of foldersToExclude) {
    if (exclusionFolder.endsWith(searchDirectory)) {
      return true;
    }
  }

  return false;
}

async function getTopLevelFolderPaths(rootFolderPath: string, foldersToExclude: string[]): Promise<string[]> {
  const directoriesToSearch: string[] = [];
  const fileSystemEntries: string[] = await readdir(rootFolderPath);
  for (const fileSystemPath of fileSystemEntries) {
    const fullPath: string = path.resolve(rootFolderPath, fileSystemPath);
    const pathStats: Stats = await lstat(fullPath);
    if (pathStats.isDirectory() && !shouldExcludeFromDirectorySearch(fileSystemPath, foldersToExclude)) {
      directoriesToSearch.push(fullPath);
    }
  }

  return directoriesToSearch;
}

async function findSecondaryPackagePaths(rootPackage: NgPackageData): Promise<string[]> {
  log.debug('Beginning package search from root ' + rootPackage.sourcePath);

  // Failing to exclude any of these folders will result in the wrong build output
  const foldersToExclude: string[] = [
    'node_modules',
    'dist',
    '.ng_build', // legacy build folder
    DEFAULT_BUILD_FOLDER,
    rootPackage.destinationPath
  ];
  const directoriesToSearch: string[] = await getTopLevelFolderPaths(rootPackage.sourcePath, foldersToExclude);
  const packagePaths: string[] = [];

  // read all directories (without recursion)
  while(directoriesToSearch.length > 0) {
    const searchDirectory: string = directoriesToSearch.pop();
    const fileSystemEntries: string[] = await readdir(searchDirectory);
    let packageFileFound = false;

    // file system entries might be files, or directories, or named pipes, etc.
    for (const fileSystemPath of fileSystemEntries) {
      const fullPath: string = path.resolve(searchDirectory, fileSystemPath);
      // discover the type of file system entry by using `lstat`.
      // NOTE: `lstat` is used instead of `stat` in order to prevent failures during resolution of symbolic links
      const pathStats: Stats = await lstat(fullPath);
      if (pathStats.isDirectory() && !shouldExcludeFromDirectorySearch(fileSystemPath, foldersToExclude)) {
        directoriesToSearch.push(fullPath);
      } else if (!packageFileFound && pathStats.isFile()) {
        if (fileSystemPath.endsWith(PACKAGE_JSON_FILE_NAME)) {
          packagePaths.push(fullPath);
          packageFileFound = true;
          // we can't `break` here because doing so might cause us to miss some directories
        }
      }
    }
  }

  log.debug('Resolved secondary package paths: ' + packagePaths.join(','))

  return packagePaths;
}

/**
 * Reads an Angular package, i.e. `NgPackageConfig`, from the passed in path.
 *
 * The `projectPath` can either be a file path:
 *  - a `package.json` with custom `ngPackage` property
 *  - an `ng-package.json` file representing `NgPackageConfig`
 *  - an `ng-package.js` exporting `NgPackageConfig`
 *
 * If `projectPath` is a path to a directory, configuration will be read in sequential order from:
 *  - `package.json`,
 *  - `ng-package.json`,
 *  - `ng-package.js`.
 *
 * @param projectPath Path pointing to `package.json` or `ng-package.json` or `ng-package.js` file
 */
async function readRootPackage(projectPath: string): Promise<NgPackageData> {

  const cwd: string = process.cwd();
  if (!path.isAbsolute(projectPath)) {
    projectPath = path.resolve(cwd, projectPath);
  }

  let ngPkg: NgPackageConfig = {};
  let baseDirectory: string;

  const stats = await lstat(projectPath);
  if (stats.isDirectory()) {
    // Read from directory
    baseDirectory = projectPath;
    try {
      log.debug(`Reading ${projectPath}/package.json`);
      const pkgJson = require(path.resolve(projectPath, 'package.json'));
      ngPkg = merge(ngPkg, pkgJson.ngPackage || {}, arrayMergeLogic);
    } catch (e) {}
    try {
      log.debug(`Reading ${projectPath}/ng-package.json`);
      const ngPkgJson = require(path.resolve(projectPath, 'ng-package.json'));
      ngPkg = merge(ngPkg, ngPkgJson || {}, arrayMergeLogic);
    } catch (e) {}
    try {
      log.debug(`Reading ${projectPath}/ng-package.js`);
      const ngPkgJs = require(path.resolve(projectPath, 'ng-package.js'));
      ngPkg = merge(ngPkg, ngPkgJs || {}, arrayMergeLogic);
    } catch (e) {}

  } else if (stats.isFile()) {
    // Read from file
    baseDirectory = path.dirname(projectPath);
    try {
      log.debug(`Reading ${projectPath}`);
      const fileData = require(projectPath);
      ngPkg = merge(ngPkg, fileData.ngPackage || fileData || {}, arrayMergeLogic);
    } catch (e) {}

  } else {
    const err = `Cannot resolve package data for projectPath=${projectPath}`;
    log.error(err);
    return Promise.reject(err);
  }

  // resolve paths relative to `ng-package.json` file
  // read 'package.json'
  const sourceDirectory = path.resolve(baseDirectory, ngPkg.src || '.');
  const distDirectory = path.resolve(baseDirectory, ngPkg.dest || 'dist');
  const pkg: any = await readJson(path.resolve(sourceDirectory, PACKAGE_JSON_FILE_NAME));

  return Promise.resolve(new NgPackageData(
    sourceDirectory,
    pkg.name,
    distDirectory,
    sourceDirectory,
    ngPkg
  ));
}

async function readSecondaryPackage(rootPackage: NgPackageData, filePath: string): Promise<NgPackageData | null> {
  const baseDirectory = path.dirname(filePath);
  const ngPackageFile = path.resolve(baseDirectory, 'ng-package.json');
  const packageJsonFile = path.resolve(baseDirectory, PACKAGE_JSON_FILE_NAME);

  let ngPackage: NgPackageConfig | null = await readNgPackageFile(ngPackageFile);
  const packageJson: any = await tryReadJson(packageJsonFile);

  // if we don't detect any explicit package configurations, then ignore
  if (!ngPackage) {
    if (!packageJson || !packageJson.ngPackage) {
      log.debug(`No secondary package found in ${baseDirectory}`);
      return null;
    }
  }

  ngPackage = merge(ngPackage, packageJson.ngPackage, arrayMergeLogic);
  if (!ngPackage.lib) {
    ngPackage.lib = {};
  }

  ngPackage.lib.externals = rootPackage.libExternals;

  return new NgPackageData(
    rootPackage.sourcePath,
    rootPackage.fullPackageName,
    rootPackage.destinationPath,
    baseDirectory,
    ngPackage
  );
}

/**
 * Search for, and read, root and secondary packages starting from a root path.
 *
 * @param {string} rootPath The path to your root folder which contains a package.json file
 * @returns {Promise<PackageSearchResult>}
 */
export async function discoverPackages(rootPath: string): Promise<PackageSearchResult> {

  // the root package gets read a bit differently than secondary packages because it must guarantee full paths
  const rootPackage: NgPackageData = await readRootPackage(rootPath);

  // With the metadata from the root package, we can proceed to read secondary packages in sub folders
  // This assumes that all secondary packages exist in sub paths of the root path.
  // Without such an assumption, automatic secondary package discovery would not be feasible.
  // Specifically, the function is looking for `ng-package.json` or `package.json` files.
  const secondaryPackagePaths: string[] = await findSecondaryPackagePaths(rootPackage);

  const secondaryPackagePromises: Promise<NgPackageData>[] = secondaryPackagePaths
    .map(secondaryPackagePath => readSecondaryPackage(rootPackage, secondaryPackagePath));

  const secondaryPackagesFromPaths: (NgPackageData | null)[] = await Promise.all(secondaryPackagePromises);

  // The packages that are null should be excluded because they were not explicitly meant to be secondary entries
  const secondaryPackages: NgPackageData[] = secondaryPackagesFromPaths.filter(x => !!x);

  return {
    rootPackage,
    secondaryPackages
  };
}


/**
 * Creates a `package.json` file by reading one from the `src` folder, adding additional
 * properties, and writing to `dest` folder
 *
 * @param ngPkg Angular package data
 * @param packageArtifacts Package artifacts to merge into package.json
 */
export async function writePackage(ngPkg: NgPackageData, packageArtifacts: NgArtifacts): Promise<void> {

  log.debug('writePackage');
  const packageJson: any = await readJson(path.resolve(ngPkg.sourcePath, PACKAGE_JSON_FILE_NAME));
  // set additional properties
  for(const fieldName in packageArtifacts) {
    packageJson[fieldName] = packageArtifacts[fieldName];
  }

  packageJson.name = ngPkg.fullPackageName;

  // keep the dist package.json clean
  // this will not throw if ngPackage field does not exist
  delete packageJson.ngPackage;

  await writeJson(path.resolve(ngPkg.destinationPath, PACKAGE_JSON_FILE_NAME), packageJson);
}
