// BUILD STEP IMPLEMENTATIONS
import { discoverPackages } from './steps/init';
import { rimraf } from './util/rimraf';
import { copyFiles } from './util/copy';
import { transformSources } from './entry-point-transforms';

// Domain
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

    // clean the primar dest folder (should clean all secondary module directories as well)
    await rimraf(ngPackage.dest);

    await transformSources({ entryPoint: ngPackage.primary, pkg: ngPackage });
    for (const secondary of ngPackage.secondaries) {
      await transformSources({ entryPoint: secondary, pkg: ngPackage });
    }

    await copyFiles(`${ngPackage.src}/README.md`, ngPackage.dest);
    await copyFiles(`${ngPackage.src}/LICENSE`, ngPackage.dest);

    log.success(`Built Angular Package!
 - from: ${ngPackage.src}
 - to:   ${ngPackage.dest}
    `);
  } catch (error) {
    // Report error messages and throw the error further up
    log.error(error);
    throw error;
  } finally {
    if (ngPackage) {
      await rimraf(ngPackage.workingDirectory);
    }
  }
}
