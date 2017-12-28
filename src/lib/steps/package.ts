import { outputJson } from 'fs-extra';
import * as path from 'path';
import * as log from '../util/log';
import { NgEntryPoint } from '../ng-package-format/entry-point';

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
export async function writePackage(entryPoint: NgEntryPoint, binaries: { [key: string]: string }): Promise<void> {

  log.debug('writePackage');
  const packageJson: any = entryPoint.packageJson;
  // set additional properties
  for (const fieldName in binaries) {
    packageJson[fieldName] = binaries[fieldName];
  }

  packageJson.name = entryPoint.moduleId;

  // keep the dist package.json clean
  // this will not throw if ngPackage field does not exist
  delete packageJson.ngPackage;

  // `outputJson()` creates intermediate directories, if they do not exist
  // -- https://github.com/jprichardson/node-fs-extra/blob/master/docs/outputJson.md
  await outputJson(
    path.resolve(entryPoint.destinationPath, 'package.json'),
    packageJson,
    { spaces: 2 }
  );
}
