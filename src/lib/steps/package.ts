import * as path from 'path';
import { NgPackageConfig } from '../../ng-package.schema';
import { NgPackageData, DEFAULT_BUILD_FOLDER } from '../model/ng-package-data';
import { tryReadJson } from '../util/json';
import { readJson, writeJson, readdir, lstat, Stats } from 'fs-extra';
import { merge, isArray } from 'lodash';
import * as log from '../util/log';
import { PackageSearchResult } from '../model/package-search-result';

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
  let promiseChain: Promise<NgPackageConfig> = readNgPackageFile(filePath)
    .then((ngPkg: NgPackageConfig | null) => ngPkg || {});

  const defaultPath = path.join(baseDirectory, 'ng-package.json');
  if (defaultPath !== filePath) {
    // read default ng-package config file
    promiseChain = promiseChain.then(async (ngPkg: NgPackageConfig) => {
      const otherNgPkg: NgPackageConfig | null = await readNgPackageFile(defaultPath);
      // merge both ng-package config objects
      // merge will never return null
      return merge(ngPkg, otherNgPkg, arrayMergeLogic);
    });
  }

  const ngPkg: NgPackageConfig = await promiseChain;
  // resolve paths relative to `ng-package.json` file
  const packageConfigurationDirectory = path.resolve(baseDirectory, ngPkg.src || '.');

  // read 'package.json'
  log.debug('loading package.json');

  const pkg: any = await readJson(path.resolve(packageConfigurationDirectory, PACKAGE_JSON_FILE_NAME));
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
    ngPackage,
    true
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
export async function writePackage(ngPkg: NgPackageData, packageArtifacts: { [key: string]: string }): Promise<void> {

  log.debug('writePackage');
  const packageJson: any = await readJson(path.resolve(ngPkg.sourcePath, PACKAGE_JSON_FILE_NAME));
  // set additional properties
  for (const fieldName in packageArtifacts) {
    packageJson[fieldName] = packageArtifacts[fieldName];
  }

  packageJson.name = ngPkg.fullPackageName;

  // keep the dist package.json clean
  // this will not throw if ngPackage field does not exist
  delete packageJson.ngPackage;

  await writeJson(path.resolve(ngPkg.destinationPath, PACKAGE_JSON_FILE_NAME), packageJson, { spaces: 2 });
}
