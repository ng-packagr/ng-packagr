import { parse as parseJson } from 'jsonc-parser';
import * as path from 'path';
import { exists, readFile, stat } from '../utils/fs';
import { globFiles } from '../utils/glob';
import * as log from '../utils/log';
import { ensureUnixPath } from '../utils/path';
import { NgEntryPoint } from './entry-point/entry-point';
import { NgPackage } from './package';
import { validateNgPackageEntryPointSchema, validateNgPackageSchema } from './schema';

interface UserPackage {
  /** Values from the `package.json` file of this user package. */
  packageJson: Record<string, any>;
  /** NgPackageConfig for this user package. */
  ngPackageJson: Record<string, any>;
  /** Absolute directory path of this user package. */
  basePath: string;
}

async function readConfigFile(filePath: string): Promise<any> {
  if (!(await exists(filePath))) {
    return undefined;
  }

  if (filePath.endsWith('.js')) {
    return import(filePath);
  }

  const data = await readFile(filePath, 'utf-8');

  return parseJson(data, undefined, { allowTrailingComma: true });
}

/**
 * Resolves a user's package by testing 'ng-package.json', or 'ng-package.js'.
 *
 * @param folderPathOrFilePath A path pointing either to a file or a directory
 * @param isSecondary A boolean determining if this is a secondary package
 * @return The user's package
 */
async function resolveUserPackage(folderPathOrFilePath: string, isSecondary = false): Promise<UserPackage | undefined> {
  const fullPath = path.resolve(folderPathOrFilePath);
  const pathStats = await stat(fullPath);
  const basePath = pathStats.isDirectory() ? fullPath : path.dirname(fullPath);

  let ngPackageJson: unknown;
  if (pathStats.isDirectory()) {
    ngPackageJson = await readConfigFile(path.join(basePath, 'ng-package.json'));
    if (!ngPackageJson) {
      ngPackageJson = await readConfigFile(path.join(basePath, 'ng-package.js'));
    }
  } else {
    ngPackageJson = await readConfigFile(fullPath);
  }

  if (ngPackageJson) {
    ngPackageJson = ngPackageJson['default'] ?? ngPackageJson;
    try {
      if (isSecondary) {
        validateNgPackageEntryPointSchema(ngPackageJson);
      } else {
        validateNgPackageSchema(ngPackageJson);
      }
    } catch (e) {
      log.error(`An error has occurred while validating config at ${folderPathOrFilePath}`);
      throw e;
    }

    let packageJson: {} = {};
    if (!isSecondary) {
      const pkgJsonPath = path.join(basePath, 'package.json');
      packageJson = await readConfigFile(pkgJsonPath);

      if (!packageJson) {
        throw new Error(`Cannot discover package sources at ${folderPathOrFilePath} as 'package.json' was not found.`);
      }

      if (packageJson && typeof packageJson !== 'object') {
        throw new Error(`Invalid 'package.json' at ${folderPathOrFilePath}.`);
      }
    }

    return {
      basePath,
      packageJson,
      ngPackageJson,
    };
  }

  if (pathStats.isDirectory()) {
    // return even if it's undefined and use defaults when it's not a file
    return undefined;
  }

  if (pathStats.isFile()) {
    throw new Error(`Trying to read a package from unsupported file extension. Path: ${folderPathOrFilePath}`);
  }

  throw new Error(`Cannot discover package sources at ${folderPathOrFilePath}`);
}

/**
 * Scans `directoryPath` and sub-folders, looking for `ng-package` files.
 * Similar to `find ${directoryPath} --name ng-package --exec dirname {}`.
 *
 * @param directoryPath Path pointing to a directory
 * @param excludeFolder A sub-folder of `directoryPath` that is excluded from search results.
 */
async function findSecondaryPackagesPaths(directoryPath: string, excludeFolder: string): Promise<string[]> {
  const ignore = ['**/node_modules/**', '**/.git/**', `${excludeFolder}/**`, 'ng-package.json'];

  const filePaths = await globFiles(`**/ng-package.json`, {
    ignore,
    onlyFiles: true,
    cwd: directoryPath,
  });

  return filePaths.map(subpath => path.dirname(path.join(directoryPath, subpath)));
}

/**
 * Reads a secondary entry point from it's package file.
 *
 * @param primary The primary entry point.
 * @param userPackage The user package for the secondary entry point.
 */
function secondaryEntryPoint(primary: NgEntryPoint, userPackage: UserPackage): NgEntryPoint {
  const { packageJson, ngPackageJson, basePath } = userPackage;
  if (path.resolve(basePath) === path.resolve(primary.basePath)) {
    log.error(`Cannot read secondary entry point. It's already a primary entry point. Path: ${basePath}`);
    throw new Error(`Secondary entry point is already a primary.`);
  }

  const relativeSourcePath = path.relative(primary.basePath, basePath);
  const secondaryModuleId = ensureUnixPath(`${primary.moduleId}/${relativeSourcePath}`);

  return new NgEntryPoint(packageJson, ngPackageJson, basePath, {
    moduleId: secondaryModuleId,
    primaryDestinationPath: primary.destinationPath,
    destinationPath: path.join(primary.destinationPath, relativeSourcePath),
  });
}

export async function discoverPackages({ project }: { project: string }): Promise<NgPackage> {
  project = path.isAbsolute(project) ? project : path.resolve(project);

  const { packageJson, ngPackageJson, basePath } = await resolveUserPackage(project);
  const primary = new NgEntryPoint(packageJson, ngPackageJson, basePath);
  log.debug(`Found primary entry point: ${primary.moduleId}`);

  const folderPaths = await findSecondaryPackagesPaths(basePath, primary.$get('dest'));
  const secondaries: NgEntryPoint[] = [];

  for (const folderPath of folderPaths) {
    const secondaryPackage = await resolveUserPackage(folderPath, true);
    if (secondaryPackage) {
      secondaries.push(secondaryEntryPoint(primary, secondaryPackage));
    }
  }

  if (secondaries.length > 0) {
    log.debug(`Found secondary entry points: ${secondaries.map(e => e.moduleId).join(', ')}`);
  }

  return new NgPackage(ensureUnixPath(basePath), primary, secondaries);
}
