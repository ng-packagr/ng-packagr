// BUILD STEP IMPLEMENTATIONS
import { discoverPackages } from './steps/package';
import { rimraf } from './util/rimraf';
import { copyFiles } from './util/copy';
import { generateNgBundle } from './bundler';
import { PackageSearchResult } from './model/package-search-result';

// Node API
import * as path from 'path';

// Logging
import * as log from './util/log';

// `ng-package.json` config
import { NgPackageData } from './model/ng-package-data';


/** CLI arguments passed to `ng-packagr` and `ngPackage()`. */
export interface NgPackagrCliArguments {
  /** Path to the 'ng-package.json' file */
  project: string
}

export async function createNgPackage(opts: NgPackagrCliArguments): Promise<void> {
  log.info(`Building Angular library`);

  let buildDirectoryRoot: string;
  try {
    // READ `ng-package.json` and obtain model, as well as secondary packages
    const ngPackages: PackageSearchResult = await discoverPackages(opts.project);

    const rootPackage: NgPackageData = ngPackages.rootPackage;

    // clean the root (should clean all secondary module directories as well)
    await rimraf(rootPackage.destinationPath);

    const packageSpecificPath: string = path.basename(rootPackage.buildDirectory);
    buildDirectoryRoot = rootPackage.buildDirectory.substring(0, rootPackage.buildDirectory.lastIndexOf(packageSpecificPath));
    await generateNgBundle(rootPackage);

    for(const secondaryPackage of ngPackages.secondaryPackages) {
      await generateNgBundle(secondaryPackage);
    }

    await copyFiles(`${rootPackage.sourcePath}/README.md`, rootPackage.destinationPath);
    await copyFiles(`${rootPackage.sourcePath}/LICENSE`, rootPackage.destinationPath);

    log.success(`Built Angular library from ${rootPackage.sourcePath}, written to ${rootPackage.destinationPath}`);
  } catch (error) {
    // Report error messages and throw the error further up
    log.error(error);
    throw error;
  } finally {
    if (buildDirectoryRoot) {
      await rimraf(buildDirectoryRoot);
    }
  }
}
