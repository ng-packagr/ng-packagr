import * as fs from 'fs-extra';
import * as path from 'path';
import { Transform, transformFromPromise } from '../../brocc/transform';
import { NgEntryPoint } from '../../ng-package-format/entry-point';
import { NgPackage } from '../../ng-package-format/package';
import { ensureUnixPath } from '../../util/path';
import { rimraf } from '../../util/rimraf';
import * as log from '../../util/log';
import { globFiles } from '../../util/glob';
import { EntryPointNode, isEntryPointInProgress } from '../nodes';
import { copyFile } from '../../util/copy';

export const writePackageTransform: Transform = transformFromPromise(async graph => {
  const entryPoint = graph.find(isEntryPointInProgress()) as EntryPointNode;
  const ngEntryPoint: NgEntryPoint = entryPoint.data.entryPoint;
  const ngPackage: NgPackage = graph.find(node => node.type === 'application/ng-package').data;
  const { destinationFiles } = entryPoint.data;

  // we don't want to copy `dist` and 'node_modules' declaration files but only files in source
  const declarationFiles = await globFiles(`${path.dirname(ngEntryPoint.entryFilePath)}/**/*.d.ts`, {
    ignore: ['**/node_modules/**', `${ngPackage.dest}/**`],
  });

  if (declarationFiles.length) {
    // COPY SOURCE FILES TO DESTINATION
    log.info('Copying declaration files');
    await Promise.all(
      declarationFiles.map(value => {
        const relativePath = path.relative(ngEntryPoint.entryFilePath, value);
        const destination = path.resolve(destinationFiles.declarations, relativePath);
        return copyFile(value, destination, { overwrite: true, dereference: true });
      }),
    );
  }
  if (ngPackage.assets.length && !ngEntryPoint.isSecondaryEntryPoint) {
    const assets = ngPackage.assets.map(x => path.join(ngPackage.src, x));
    const assetFiles = await globFiles(assets, {
      ignore: ['**/node_modules/**', `${ngPackage.dest}/**`],
    });

    if (assetFiles.length) {
      // COPY ASSET FILES TO DESTINATION
      log.info('Copying assets files');
      await Promise.all(
        assetFiles.map(value => {
          const relativePath = path.relative(ngPackage.src, value);
          const destination = path.resolve(ngPackage.dest, relativePath);

          return copyFile(value, destination, { overwrite: true, dereference: true });
        }),
      );
    }
  }

  // 6. WRITE PACKAGE.JSON
  log.info('Writing package metadata');
  const relativeUnixFromDestPath = (filePath: string) =>
    ensureUnixPath(path.relative(ngEntryPoint.destinationPath, filePath));

  const isIvy = !!entryPoint.data.tsConfig.options.enableIvy;

  await writePackageJson(
    ngEntryPoint,
    ngPackage,
    {
      main: relativeUnixFromDestPath(destinationFiles.umd),
      module: relativeUnixFromDestPath(destinationFiles.fesm5),
      es2015: relativeUnixFromDestPath(destinationFiles.fesm2015),
      esm5: relativeUnixFromDestPath(destinationFiles.esm5),
      esm2015: relativeUnixFromDestPath(destinationFiles.esm2015),
      fesm5: relativeUnixFromDestPath(destinationFiles.fesm5),
      fesm2015: relativeUnixFromDestPath(destinationFiles.fesm2015),
      typings: relativeUnixFromDestPath(destinationFiles.declarations),
      // Ivy doesn't generate metadata files
      metadata: isIvy ? undefined : relativeUnixFromDestPath(destinationFiles.metadata),
      // webpack v4+ specific flag to enable advanced optimizations and code splitting
      sideEffects: ngEntryPoint.sideEffects,
    },
    isIvy,
  );

  log.success(`Built ${ngEntryPoint.moduleId}`);

  return graph;
});

/**
 * Creates and writes a `package.json` file of the entry point used by the `node_module`
 * resolution strategies.
 *
 * #### Example
 *
 * A consumer of the entry point depends on it by `import {..} from '@my/module/id';`.
 * The module id `@my/module/id` will be resolved to the `package.json` file that is written by
 * this build step.
 * The properties `main`, `module`, `typings` (and so on) in the `package.json` point to the
 * flattened JavaScript bundles, type definitions, (...).
 *
 * @param entryPoint An entry point of an Angular package / library
 * @param additionalProperties Additional properties, e.g. binary artefacts (bundle files), to merge into `package.json`
 */
async function writePackageJson(
  entryPoint: NgEntryPoint,
  pkg: NgPackage,
  additionalProperties: { [key: string]: string | boolean | string[] },
  isIvy: boolean,
): Promise<void> {
  log.debug('Writing package.json');

  // set additional properties
  const packageJson = { ...entryPoint.packageJson, ...additionalProperties };

  // read tslib version from `@angular/compiler` so that our tslib
  // version at least matches that of angular if we use require('tslib').version
  // it will get what installed and not the minimum version nor if it is a `~` or `^`
  // this is only required for primary
  if (
    !entryPoint.isSecondaryEntryPoint &&
    !(packageJson.peerDependencies && packageJson.peerDependencies.tslib) &&
    !(packageJson.dependencies && packageJson.dependencies.tslib)
  ) {
    const {
      peerDependencies: angularPeerDependencies = {},
      dependencies: angularDependencies = {},
    } = require('@angular/compiler/package.json');
    const tsLibVersion = angularPeerDependencies.tslib || angularDependencies.tslib;

    if (tsLibVersion) {
      packageJson.peerDependencies = {
        ...packageJson.peerDependencies,
        tslib: tsLibVersion,
      };
    }
  }

  // Verify non-peerDependencies as they can easily lead to duplicate installs or version conflicts
  // in the node_modules folder of an application
  const whitelist = pkg.whitelistedNonPeerDependencies.map(value => new RegExp(value));
  try {
    checkNonPeerDependencies(packageJson, 'dependencies', whitelist);
  } catch (e) {
    await rimraf(entryPoint.destinationPath);
    throw e;
  }

  // Removes scripts from package.json after build
  if (packageJson.scripts) {
    if (pkg.keepLifecycleScripts !== true) {
      log.info(`Removing scripts section in package.json as it's considered a potential security vulnerability.`);
      delete packageJson.scripts;
    } else {
      log.warn(
        `You enabled keepLifecycleScripts explicitly. The scripts section in package.json will be published to npm.`,
      );
    }
  }

  if (isIvy && !entryPoint.isSecondaryEntryPoint) {
    const scripts = packageJson.scripts || (packageJson.scripts = {});
    scripts.prepublishOnly =
      'node --eval "console.error(\'' +
      'ERROR: Trying to publish a package that has been compiled by Ivy. This is not allowed.\\n' +
      'Please delete and rebuild the package, without compiling with Ivy, before attempting to publish.\\n' +
      '\')" ' +
      '&& exit 1';
  }

  // keep the dist package.json clean
  // this will not throw if ngPackage field does not exist
  delete packageJson.ngPackage;

  const packageJsonPropertiesToDelete = [
    'stylelint',
    'prettier',
    'browserslist',
    'devDependencies',
    'jest',
    'workspaces',
    'husky',
  ];

  for (const prop of packageJsonPropertiesToDelete) {
    if (prop in packageJson) {
      delete packageJson[prop];
      log.info(`Removing ${prop} section in package.json.`);
    }
  }

  packageJson.name = entryPoint.moduleId;

  // `outputJson()` creates intermediate directories, if they do not exist
  // -- https://github.com/jprichardson/node-fs-extra/blob/master/docs/outputJson.md
  await fs.outputJson(path.join(entryPoint.destinationPath, 'package.json'), packageJson, {
    spaces: 2,
  });
}

function checkNonPeerDependencies(packageJson: { [key: string]: any }, property: string, whitelist: RegExp[]) {
  if (packageJson[property]) {
    Object.keys(packageJson[property]).forEach(dep => {
      if (whitelist.find(regex => regex.test(dep))) {
        log.debug(`Dependency ${dep} is whitelisted in '${property}'`);
      } else {
        log.warn(
          `Distributing npm packages with '${property}' is not recommended. Please consider adding ${dep} to 'peerDependencies' or remove it from '${property}'.`,
        );
        throw new Error(`Dependency ${dep} must be explicitly whitelisted.`);
      }
    });
  }
}
