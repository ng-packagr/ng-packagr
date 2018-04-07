import * as fs from 'fs-extra';
import * as path from 'path';
import { Transform, transformFromPromise } from '../../brocc/transform';
import { NgEntryPoint } from '../../ng-package-format/entry-point';
import { NgPackage } from '../../ng-package-format/package';
import { ensureUnixPath } from '../../util/path';
import { rimraf } from '../../util/rimraf';
import * as log from '../../util/log';
import { isEntryPointInProgress, EntryPointNode, isEntryPointDirty } from '../nodes';
import { copyFiles } from '../../util/copy';

export const writePackageTransform: Transform = transformFromPromise(async graph => {
  const entryPoint = graph.find(isEntryPointInProgress()) as EntryPointNode;
  const ngEntryPoint: NgEntryPoint = entryPoint.data.entryPoint;
  const ngPackage: NgPackage = graph.find(node => node.type === 'application/ng-package').data;
  const { destinationFiles } = entryPoint.data;

  // 5. COPY SOURCE FILES TO DESTINATION
  log.info('Copying declaration files');
  await copyFiles(`${path.dirname(ngEntryPoint.entryFilePath)}/**/*.d.ts`, path.dirname(destinationFiles.declarations));

  // 6. WRITE PACKAGE.JSON
  log.info('Writing package metadata');
  const relativeUnixFromDestPath = (filePath: string) =>
    ensureUnixPath(path.relative(ngEntryPoint.destinationPath, filePath));

  await writePackageJson(ngEntryPoint, ngPackage, {
    main: relativeUnixFromDestPath(destinationFiles.umd),
    module: relativeUnixFromDestPath(destinationFiles.fesm5),
    es2015: relativeUnixFromDestPath(destinationFiles.fesm2015),
    esm5: relativeUnixFromDestPath(destinationFiles.esm5),
    esm2015: relativeUnixFromDestPath(destinationFiles.esm2015),
    fesm5: relativeUnixFromDestPath(destinationFiles.fesm5),
    fesm2015: relativeUnixFromDestPath(destinationFiles.fesm2015),
    typings: relativeUnixFromDestPath(destinationFiles.declarations),
    // XX 'metadata' property in 'package.json' is non-standard. Keep it anyway?
    metadata: relativeUnixFromDestPath(destinationFiles.metadata)
  });

  log.success(`Built ${ngEntryPoint.moduleId}`);

  return graph;
});

/**
 * Creates and writes a `package.json` file of the entry point used by the `node_module`
 * resolution strategies.
 *
 * #### Example
 *
 * A consumer of the enty point depends on it by `import {..} from '@my/module/id';`.
 * The module id `@my/module/id` will be resolved to the `package.json` file that is written by
 * this build step.
 * The proprties `main`, `module`, `typings` (and so on) in the `package.json` point to the
 * flattened JavaScript bundles, type definitions, (...).
 *
 * @param entryPoint An entry point of an Angular package / library
 * @param binaries Binary artefacts (bundle files) to merge into `package.json`
 */
export async function writePackageJson(
  entryPoint: NgEntryPoint,
  pkg: NgPackage,
  binaries: { [key: string]: string }
): Promise<void> {
  log.debug('Writing package.json');
  const packageJson: any = entryPoint.packageJson;
  // set additional properties
  for (const fieldName in binaries) {
    packageJson[fieldName] = binaries[fieldName];
  }

  // read tslib version from `@angular/compiler` so that our tslib
  // version at least matches that of angular if we use require('tslib').version
  // it will get what installed and not the minimum version nor if it is a `~` or `^`
  if (!(packageJson.dependencies && packageJson.dependencies.tslib)) {
    const { dependencies: angularDependencies = {} } = require('@angular/compiler/package.json');
    const tsLibVersion = angularDependencies.tslib;

    if (tsLibVersion) {
      packageJson.dependencies = {
        ...packageJson.dependencies,
        tslib: tsLibVersion
      };
    }
  }

  // Verify non-peerDependencies as they can easily lead to duplicated installs or version conflicts
  // in the node_modules folder of an application
  const whitelist = pkg.whitelistedNonPeerDependencies.map(value => new RegExp(value));
  try {
    checkNonPeerDependencies(packageJson, 'dependencies', whitelist);
  } catch (e) {
    await rimraf(entryPoint.destinationPath);
    throw e;
  }

  // Removes scripts from package.json after build
  if (pkg.keepLifecycleScripts !== true) {
    log.info(`Removing scripts section in package.json as it's considered a potential security vulnerability.`);
    delete packageJson.scripts;
  } else {
    log.warn(
      `You enabled keepLifecycleScripts explicitly. The scripts section in package.json will be published to npm.`
    );
  }

  // keep the dist package.json clean
  // this will not throw if ngPackage field does not exist
  delete packageJson.ngPackage;
  packageJson.name = entryPoint.moduleId;

  // `outputJson()` creates intermediate directories, if they do not exist
  // -- https://github.com/jprichardson/node-fs-extra/blob/master/docs/outputJson.md
  await fs.outputJson(path.join(entryPoint.destinationPath, 'package.json'), packageJson, { spaces: 2 });
}

function checkNonPeerDependencies(packageJson: { [key: string]: any }, property: string, whitelist: RegExp[]) {
  if (packageJson[property]) {
    Object.keys(packageJson[property]).forEach(dep => {
      if (whitelist.find(regex => regex.test(dep))) {
        log.debug(`Dependency ${dep} is whitelisted in '${property}'`);
      } else {
        log.warn(
          `Distributing npm packages with '${property}' is not recommended. Please consider adding ${dep} to 'peerDependencies' or remove it from '${property}'.`
        );
        throw new Error(`Dependency ${dep} must be explicitly whitelisted.`);
      }
    });
  }
}
