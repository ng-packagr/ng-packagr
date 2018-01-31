import * as fs from 'fs-extra';
import * as path from 'path';
import { Transform, transformFromPromise } from '../../brocc/transform';
import { writeFlatBundleFiles, FlattenOpts } from '../../flatten/flatten';
import { NgEntryPoint } from '../../ng-package-format/entry-point';
import { NgPackage } from '../../ng-package-format/package';
import { relocateSourceMaps } from '../../sourcemaps/relocate';
import { ensureUnixPath } from '../../util/path';
import { copyFiles } from '../../util/copy';
import * as log from '../../util/log';
import { byEntryPoint, isInProgress } from '../entry-point.node';

export const writePackageTransform: Transform = transformFromPromise(async graph => {
  const entryPoint = graph.find(byEntryPoint().and(isInProgress));
  const ngEntryPoint: NgEntryPoint = entryPoint.data.entryPoint;
  const ngPackage: NgPackage = graph.find(node => node.type === 'application/ng-package').data;

  // 5. COPY SOURCE FILES TO DESTINATION
  log.info('Copying staged files');
  await copyJavaScriptBundles(entryPoint.data.stageDir, ngPackage.dest);
  await copyTypingsAndMetadata(entryPoint.data.outDir, ngEntryPoint.destinationPath);

  // 6. WRITE PACKAGE.JSON
  log.info('Writing package metadata');
  const relativeDestPath: string = path.relative(ngEntryPoint.destinationPath, ngPackage.primary.destinationPath);
  await writePackageJson(ngEntryPoint, {
    main: ensureUnixPath(path.join(relativeDestPath, 'bundles', ngEntryPoint.flatModuleFile + '.umd.js')),
    module: ensureUnixPath(path.join(relativeDestPath, 'esm5', ngEntryPoint.flatModuleFile + '.js')),
    es2015: ensureUnixPath(path.join(relativeDestPath, 'esm2015', ngEntryPoint.flatModuleFile + '.js')),
    typings: ensureUnixPath(`${ngEntryPoint.flatModuleFile}.d.ts`),
    // XX 'metadata' property in 'package.json' is non-standard. Keep it anyway?
    metadata: ensureUnixPath(`${ngEntryPoint.flatModuleFile}.metadata.json`)
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
export async function writePackageJson(entryPoint: NgEntryPoint, binaries: { [key: string]: string }): Promise<void> {
  log.debug('Writing package.json');
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
  await fs.outputJson(path.resolve(entryPoint.destinationPath, 'package.json'), packageJson, { spaces: 2 });
}

/**
 * Copies the JavaScript bundles from the staging directory to the npm package.
 */
export async function copyJavaScriptBundles(stageDir: string, destDir: string): Promise<void> {
  await copyFiles(`${stageDir}/bundles/**/*.{js,js.map}`, path.resolve(destDir, 'bundles'));
  await copyFiles(`${stageDir}/esm5/**/*.{js,js.map}`, path.resolve(destDir, 'esm5'));
  await copyFiles(`${stageDir}/esm2015/**/*.{js,js.map}`, path.resolve(destDir, 'esm2015'));
}

export async function copyTypingsAndMetadata(from: string, to: string): Promise<void> {
  await copyFiles(`${from}/**/*.{d.ts,metadata.json}`, to);
}
