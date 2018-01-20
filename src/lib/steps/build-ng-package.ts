import { InjectionToken, FactoryProvider } from 'injection-js';
import * as path from 'path';
import { CliArguments } from '../commands/build.command';
import { NgArtefacts } from '../ng-package-format/artefacts';
import { NgPackage } from '../ng-package-format/package';
import { copyFiles } from '../util/copy';
import * as log from '../util/log';
import { rimraf } from '../util/rimraf';
import { BuildStep } from '../deprecations';
import { discoverPackages } from './init';
import { ENTRY_POINT_TRANSFORMS_TOKEN } from './entry-point-transforms';

// XX: should eventually become a BuildStep
export function buildNgPackageFactory(entryPointTransforms: BuildStep) {

  return async function buildNgPackage(opts: CliArguments): Promise<void> {
    log.info(`Building Angular Package`);

    let ngPackage: NgPackage;
    try {
      // READ `NgPackage` from either 'package.json', 'ng-package.json', or 'ng-package.js'
      ngPackage = await discoverPackages(opts);

      // clean the primary dest folder (should clean all secondary module directories as well)
      await rimraf(ngPackage.dest);

      // Sequentially build entry points
      const entryPoints = [ ngPackage.primary, ...ngPackage.secondaries ];
      for (const entryPoint of entryPoints) {
        // Prepare artefacts. Will be populated by the entry point transformations
        const artefacts = new NgArtefacts(ngPackage.primary, ngPackage);
        await entryPointTransforms({ artefacts, entryPoint, pkg: ngPackage });
      }

      await copyFiles(`${ngPackage.src}/README.md`, ngPackage.dest);
      await copyFiles(`${ngPackage.src}/LICENSE`, ngPackage.dest);

      // clean the working directory for a successful build only
      await rimraf(ngPackage.workingDirectory);
      log.success(`Built Angular Package!
   - from: ${ngPackage.src}
   - to:   ${ngPackage.dest}
      `);
    } catch (error) {
      // Report error messages and throw the error further up
      log.error(error);
      if (ngPackage) {
        log.info(`Build failed. The working directory was not pruned. Files are stored at ${ngPackage.workingDirectory}.`);
      }

      throw error;
    }
  };
}

export type BuildCallSignature = (opts: CliArguments) => Promise<void>;

export const BUILD_NG_PACKAGE_TOKEN = new InjectionToken<BuildCallSignature>('ng.v5.buildNgPackage');

export const BUILD_NG_PACKAGE_PROVIDER: FactoryProvider = {
  provide: BUILD_NG_PACKAGE_TOKEN,
  useFactory: buildNgPackageFactory,
  deps: [ ENTRY_POINT_TRANSFORMS_TOKEN ]
};
