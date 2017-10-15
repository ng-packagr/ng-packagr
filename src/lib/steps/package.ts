import * as path from 'path';
import { NgPackageConfig } from '../../ng-package.schema';
import { NgPackageData, DEFAULT_BUILD_FOLDER } from '../model/ng-package-data';
import { NgArtifacts } from '../model/ng-artifacts';
import { copyFiles } from '../util/copy';
import { readJson, writeJson, readdir, lstat, Stats } from 'fs-extra';
import { merge, isArray } from 'lodash';
import * as log from '../util/log';
import { PackageSearchResult } from '../model/package-search-result';

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

async function readNgPackageFile(filePath: string): Promise<NgPackageConfig> {

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
      return {};
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
        if (fileSystemPath.endsWith('package.json')) {
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
 * Reads an Angular package definition first from the passed in file path,
 * then from the default ng-package.json file,
 * then from package.json, and merges the json into one config object.
 *
 * @param filePath path pointing to `ng-package.json` file
 */
async function readRootPackage(filePath: string): Promise<NgPackageData> {

  const cwd: string = process.cwd();
  if (!path.isAbsolute(filePath)) {
    filePath = path.resolve(cwd, filePath);
  }

  const baseDirectory = path.dirname(filePath);

  // read custom ng-package config file
  let promiseChain: Promise<NgPackageConfig> = readNgPackageFile(filePath);

  const defaultPath = path.join(baseDirectory, 'ng-package.json');
  if (defaultPath !== filePath) {
    // read default ng-package config file
    promiseChain = promiseChain.then(async (ngPkg: NgPackageConfig) => {
      const otherNgPkg: NgPackageConfig = await readNgPackageFile(defaultPath);
      // merge both ng-package config objects
      return merge(ngPkg, otherNgPkg, arrayMergeLogic);
    });
  }

  const ngPkg: NgPackageConfig = await promiseChain;
  // resolve paths relative to `ng-package.json` file
  const packageConfigurationDirectory = path.resolve(baseDirectory, ngPkg.src || '.');

  // read 'package.json'
  log.debug('loading package.json');

  const pkg: any = await readJson(path.resolve(packageConfigurationDirectory, 'package.json'));
  // merge package.json ng-package config
  const finalPackageConfig = merge(ngPkg, pkg.ngPackage, arrayMergeLogic);
  // make sure we provide default values for src and dest
  finalPackageConfig.src = finalPackageConfig.src || packageConfigurationDirectory;
  finalPackageConfig.dest = finalPackageConfig.dest || path.resolve(packageConfigurationDirectory,'dist');
  return new NgPackageData(
    finalPackageConfig.src,
    pkg.name,
    finalPackageConfig.dest,
    finalPackageConfig.src,
    finalPackageConfig
  );
}

async function readSecondaryPackage(rootPackage: NgPackageData, filePath: string): Promise<NgPackageData> {
  const baseDirectory = path.dirname(filePath);
  const ngPackageFile = path.resolve(baseDirectory, 'ng-package.json');
  const packageJsonFile = path.resolve(baseDirectory, 'package.json');

  let ngPackage: NgPackageConfig = await readNgPackageFile(ngPackageFile);
  const packageJson = await readJson(packageJsonFile);

  ngPackage = merge(ngPackage, packageJson.ngPackage, arrayMergeLogic);
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

  const secondaryPackages: NgPackageData[] = await Promise.all(secondaryPackagePromises);

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
  await copyFiles(`${ngPkg.sourcePath}/**/*.md`, ngPkg.destinationPath);
  await copyFiles(`${ngPkg.sourcePath}/LICENSE`, ngPkg.destinationPath);

  const packageJson: any = await readJson(path.resolve(ngPkg.sourcePath, 'package.json'));
  // set additional properties
  for(const fieldName in packageArtifacts) {
    packageJson[fieldName] = packageArtifacts[fieldName];
  }

  await writeJson(`${ngPkg.destinationPath}/package.json`, packageJson);
}
