import { SchemaClassFactory } from '@ngtools/json-schema';
import { pathExists, readJson, lstat } from 'fs-extra';
import * as glob from 'glob';
import * as path from 'path';
import * as log from '../util/log';
import { ensureUnixPath } from '../util/path';
import { NgPackageConfig } from '../../ng-package.schema';
import { NgPackage, NgEntryPoint } from '../domain/ng-package-format';

/** Creates a SchemaClass for `NgPackageConfig` */
const NgPackageSchemaClass =
  SchemaClassFactory<NgPackageConfig>(require('../../ng-package.schema.json'));

/** Instantiates a concrete schema from `NgPackageConfig` */
const instantiateSchemaClass =
  (ngPackageJson: NgPackageConfig) => new NgPackageSchemaClass(ngPackageJson);

const fileExists =
  async (pathLike: string): Promise<boolean> =>
    await pathExists(pathLike) && (await lstat(pathLike)).isFile();

interface UserPackage {
  packageJson: any,
  ngPackageJson: any,
  basePath: string
}

/**
 * Resolves a package conf by testing for 'package.json', 'ng-package.json', or 'ng-package.js'.
 *
 * @param folderPathOrFilePath A path pointing either to a file or a directory
 * @return The user's package conf
 */
const resolvePackageConf =
  async (folderPathOrFilePath: string): Promise<UserPackage> => {

    const pathStats = await lstat(folderPathOrFilePath);
    if (pathStats.isDirectory()) {
      const basePath = path.isAbsolute(folderPathOrFilePath) ? folderPathOrFilePath : path.resolve(folderPathOrFilePath);
      const packageJson = await readJson(path.resolve(folderPathOrFilePath, 'package.json'));

      if (packageJson['ngPackage']) {
        log.debug(`Found package file ${folderPathOrFilePath}`);

        return {
          packageJson: packageJson,
          ngPackageJson: Object.assign({}, packageJson['ngPackage']),
          basePath
        };
      } else if (await fileExists(path.resolve(basePath, 'ng-package.json'))) {

        return {
          packageJson: packageJson,
          ngPackageJson: await readJson(path.resolve(basePath, 'ng-package.json')),
          basePath
        };
      } else if ((await fileExists(path.resolve(basePath, 'ng-package.js')))) {

        // TODO: enable this, see #278
        if (4 == 4) {
          throw new Error(`Reading 'ngPackage' from a .js file is not yet implemented.`);
        }
      }

    } else if (pathStats.isFile()) {

      const fileName = path.basename(folderPathOrFilePath);
      const folderPath = path.dirname(folderPathOrFilePath);
      if (fileName=== 'ng-package.json') {

        return {
          packageJson: await readJson(path.resolve(folderPath, 'package.json')),
          ngPackageJson: await readJson(folderPathOrFilePath),
          basePath: folderPath
        };
      } else if (fileName === 'package.json') {
        const packageJson = await readJson(folderPathOrFilePath);
        if (!packageJson['ngPackage']) {
          throw new Error(`Cannot read a package from 'package.json' without 'ngPackage' property.`);
        }

        return {
          packageJson: packageJson,
          ngPackageJson: Object.assign({}, packageJson['ngPackage']),
          basePath: folderPath
        };
      } else if (path.extname(folderPathOrFilePath) === '.js') {

        // TODO: enable this, see #278
        if (4 == 4) {
          throw new Error(`Reading 'ngPackage' from a .js file is not yet implemented.`);
        }

      } else {
        throw new Error(`Trying to read a package from unsupported file extension. Path=${folderPathOrFilePath}`);
      }

    }

    throw new Error(`Cannot discover package sources at ${folderPathOrFilePath}`);
  }

/** Reads a primary entry point from it's package file. */
const primaryEntryPoint =
  ({ packageJson, ngPackageJson, basePath }: UserPackage): NgEntryPoint =>
    new NgEntryPoint(
      packageJson,
      ngPackageJson,
      instantiateSchemaClass(ngPackageJson),
      basePath
    );

/**
 * Scans `directoryPath` and sub-folders, looking for `package.json` files.
 * Similar to `find ${directoryPath} --name package.json --exec dirname {}`.
 *
 * @param directoryPath Path pointing to a directory
 * @param excludeFolder A sub-folder of `directoryPath` that is excluded from search results.
 */
const findSecondaryPackagesPaths =
  async (directoryPath: string, excludeFolder: string): Promise<string[]> => {
    const EXCLUDE_FOLDERS = [
      'node_modules',
      'dist',
      '.ng_build',
      '.ng_pkg_build',
    ]
    .map((directoryName) => `**/${directoryName}/**/package.json`)
    .concat([
      path.resolve(directoryPath, 'package.json'),
      path.resolve(directoryPath, 'ng-package.json'),
      path.resolve(directoryPath, excludeFolder) + '/**/package.json'
    ]);

    return new Promise<string[]>((resolve, reject) => {
      glob(`${directoryPath}/**/*package.json`,
        { ignore: EXCLUDE_FOLDERS, cwd: directoryPath },
        (err, files) => {
          if (err) {
            reject(err);
          }

          resolve(files);
        }
      );
    })
    .then((filePaths) => Promise.all(
      filePaths
        .map((filePath) => path.dirname(filePath))
        .filter((value, index, array) => array.indexOf(value) === index)
    ));
  }

/**
 * Reads a secondary entry point from it's package file.
 *
 * @param primaryDirectoryPath A path pointing to the directory of the primary entry point.
 * @param primary The primary entry point.
 */
const secondaryEntryPoint =
  (primaryDirectoryPath: string, primary: NgEntryPoint, { packageJson, ngPackageJson, basePath}: UserPackage) : NgEntryPoint => {

    if (basePath === primaryDirectoryPath) {
      log.error(`Cannot read secondary entry point. It's already a primary entry point. path=${basePath}`);
      throw new Error(`Secondary entry point is already a primary.`);
    }

    const relativeSourcePath = path.relative(primaryDirectoryPath, basePath);
    const secondaryModuleId = ensureUnixPath(`${primary.moduleId}/${relativeSourcePath}`);

    return new NgEntryPoint(
      packageJson,
      ngPackageJson,
      instantiateSchemaClass(ngPackageJson),
      basePath,
      {
        moduleId: secondaryModuleId,
        destinationPath: path.resolve(primary.destinationPath, relativeSourcePath)
      }
    );
  }

export const discoverPackages =
  async ({ project }: { project: string }): Promise<NgPackage> => {
    project = path.isAbsolute(project) ? project : path.resolve(project);

    const primaryPackage = await resolvePackageConf(project);
    const primary = primaryEntryPoint(primaryPackage);
    log.debug(`Found primary entry point: ${primary.moduleId}`);

    const secondaries = await (findSecondaryPackagesPaths(primaryPackage.basePath, primary.$get('dest'))
      .then((folderPaths) => Promise.all(folderPaths
        .map((folderPath) => resolvePackageConf(folderPath)
          .catch(() => {
            log.warn(`Cannot read secondary entry point at ${folderPath}. Skipping.`);

            return null;
          })
        )
      ))
      .then((secondaryPackages) => secondaryPackages
        .filter((value) => !!value)
        .map((secondaryPackage) => secondaryEntryPoint(primaryPackage.basePath, primary, secondaryPackage))
      )
    );
    if (secondaries.length > 0) {
      log.debug(`Found secondary entry points: ${secondaries.map(e => e.moduleId).join(', ')}`);
    }

    return new NgPackage(
      primaryPackage.basePath,
      primary,
      secondaries
    );
  }
