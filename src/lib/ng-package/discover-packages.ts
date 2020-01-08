import * as ajv from 'ajv';
import { pathExistsSync, lstat } from 'fs-extra';
import * as path from 'path';
import * as log from '../utils/log';
import { ensureUnixPath } from '../utils/path';
import { NgEntryPoint } from './entry-point/entry-point';
import { NgPackage } from './package';
import { globFiles } from '../utils/glob';

const ngPackageSchemaJson = require('../../ng-package.schema.json');

interface UserPackage {
  packageJson: object;
  ngPackageJson: object;
  basePath: string;
}

function formatSchemaValidationErrors(errors: ajv.ErrorObject[]): string {
  return errors
    .map(err => {
      let message = `Data path ${JSON.stringify(err.dataPath)} ${err.message}`;
      if (err.keyword === 'additionalProperties') {
        message += ` (${(err.params as any).additionalProperty})`;
      }

      return message + '.';
    })
    .join('\n');
}

/**
 * Resolves a user's package by testing for 'package.json', 'ng-package.json', or 'ng-package.js'.
 *
 * @param folderPathOrFilePath A path pointing either to a file or a directory
 * @param isSecondary A boolean determining if this is a secondary package
 * @return The user's package
 */
async function resolveUserPackage(folderPathOrFilePath: string, isSecondary = false): Promise<UserPackage | undefined> {
  const readConfigFile = async (filePath: string) => (pathExistsSync(filePath) ? import(filePath) : undefined);
  const fullPath = path.resolve(folderPathOrFilePath);
  const pathStats = await lstat(fullPath);
  const basePath = pathStats.isDirectory() ? fullPath : path.dirname(fullPath);
  const packageJson = await readConfigFile(path.join(basePath, 'package.json'));

  if (!packageJson && !isSecondary) {
    throw new Error(`Cannot discover package sources at ${folderPathOrFilePath} as 'package.json' was not found.`);
  }

  let ngPackageJson: undefined | object;
  if (packageJson && packageJson['ngPackage']) {
    // Read `ngPackage` from `package.json`
    ngPackageJson = { ...packageJson['ngPackage'] };
  } else if (pathStats.isDirectory()) {
    ngPackageJson = await readConfigFile(path.join(basePath, 'ng-package.json'));
    if (!ngPackageJson) {
      ngPackageJson = await readConfigFile(path.join(basePath, 'ng-package.js'));
    }
  } else {
    ngPackageJson = await readConfigFile(fullPath);
  }

  if (ngPackageJson) {
    const _ajv = ajv({
      schemaId: 'auto',
      useDefaults: true,
    });

    const validate = _ajv.compile(ngPackageSchemaJson);
    const isValid = validate(ngPackageJson);
    if (!isValid) {
      throw new Error(
        `Configuration doesn\'t match the required schema.\n${formatSchemaValidationErrors(validate.errors)}`,
      );
    }

    return {
      basePath,
      packageJson: packageJson || {},
      ngPackageJson,
    };
  }

  if (pathStats.isDirectory()) {
    // return even if it's undefined and use defaults when it's not a file
    return undefined;
  }

  if (pathStats.isFile()) {
    // a project file was specified but was in valid
    if (path.basename(folderPathOrFilePath) === 'package.json') {
      throw new Error(`Cannot read a package from 'package.json' without 'ngPackage' property.`);
    }

    throw new Error(`Trying to read a package from unsupported file extension. Path: ${folderPathOrFilePath}`);
  }

  throw new Error(`Cannot discover package sources at ${folderPathOrFilePath}`);
}

/**
 * Scans `directoryPath` and sub-folders, looking for `package.json` files.
 * Similar to `find ${directoryPath} --name package.json --exec dirname {}`.
 *
 * @param directoryPath Path pointing to a directory
 * @param excludeFolder A sub-folder of `directoryPath` that is excluded from search results.
 */
async function findSecondaryPackagesPaths(directoryPath: string, excludeFolder: string): Promise<string[]> {
  const ignore = [
    '**/node_modules/**',
    '**/.git/**',
    `${path.resolve(directoryPath, excludeFolder)}/**`,
    `${directoryPath}/package.json`,
    `${directoryPath}/ng-package.json`,
  ];

  const filePaths = await globFiles(`${directoryPath}/**/{package,ng-package}.json`, {
    ignore,
    cwd: directoryPath,
  });

  return filePaths.map(path.dirname);
}

/**
 * Reads a secondary entry point from it's package file.
 *
 * @param primaryDirectoryPath A path pointing to the directory of the primary entry point.
 * @param primary The primary entry point.
 */
function secondaryEntryPoint(
  primaryDirectoryPath: string,
  primary: NgEntryPoint,
  { packageJson, ngPackageJson, basePath }: UserPackage,
): NgEntryPoint {
  if (path.resolve(basePath) === path.resolve(primaryDirectoryPath)) {
    log.error(`Cannot read secondary entry point. It's already a primary entry point. Path: ${basePath}`);
    throw new Error(`Secondary entry point is already a primary.`);
  }

  const relativeSourcePath = path.relative(primaryDirectoryPath, basePath);
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
    try {
      const secondaryPackage = await resolveUserPackage(folderPath, true);
      if (secondaryPackage) {
        secondaries.push(secondaryEntryPoint(basePath, primary, secondaryPackage));
      }
    } catch {
      log.warn(`Cannot read secondary entry point at ${folderPath}. Skipping.`);
    }
  }

  if (secondaries.length > 0) {
    log.debug(`Found secondary entry points: ${secondaries.map(e => e.moduleId).join(', ')}`);
  }

  return new NgPackage(basePath, primary, secondaries);
}
