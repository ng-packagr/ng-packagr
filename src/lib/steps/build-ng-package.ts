import * as path from 'path';
import { CliArguments } from '../commands/build.command';
import { Artefacts } from '../ng-package-format/artefacts';
import { NgPackage } from '../ng-package-format/package';
import { copyFiles } from '../util/copy';
import * as log from '../util/log';
import { rimraf } from '../util/rimraf';
import { discoverPackages } from './init';
import { transformSources } from './entry-point-transforms';

// XX: should eventually become a BuildStep
export async function buildNgPackage(opts: CliArguments): Promise<void> {
  log.info(`Building Angular Package`);

  let ngPackage: NgPackage;
  try {
    // READ `NgPackage` from either 'package.json', 'ng-package.json', or 'ng-package.js'
    ngPackage = await discoverPackages(opts);

    // clean the primary dest folder (should clean all secondary module directories as well)
    await rimraf(ngPackage.dest);

    const artefacts = new Artefacts(ngPackage.primary, ngPackage);
    await transformSources({ artefacts, entryPoint: ngPackage.primary, pkg: ngPackage });
    for (const secondary of ngPackage.secondaries) {
      const artefacts = new Artefacts(secondary, ngPackage);
      await transformSources({ artefacts, entryPoint: secondary, pkg: ngPackage });
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
}
