// BUILD STEP IMPLEMENTATIONS
import { discoverPackages } from './steps/init';
import { rimraf } from './util/rimraf';
import { copyFiles } from './util/copy';
import { transformSources } from './entry-point-transforms';

// Domain
import { Artefacts } from './domain/build-artefacts';
import { CliArguments } from './domain/cli-arguments';
import { NgPackage } from './domain/ng-package-format';

// Node API
import * as path from 'path';

// Logging
import * as log from './util/log';


export async function createNgPackage(opts: CliArguments): Promise<void> {
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
      log.info(`Build failed. The working directory was not pruned. Files are stored at {ngPackage.workingDirectory}.`);
    }

    throw error;
  }
}
