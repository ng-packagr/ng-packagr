import * as path from 'path';

// BUILD STEP IMPLEMENTATIONS
import { readPackage, writePackage } from './steps/package';
import { copyFiles } from './util/copy';
import { rimraf } from './util/rimraf';
import { generateNgBundle } from './bundler';

// Logging
import * as log from './util/log';

// `ng-package.json` config
import { NgPackage } from './model/ng-package';
import { NgPackageConfig } from '../ng-package.schema';



/** CLI arguments passed to `ng-packagr` and `ngPackage()`. */
export interface NgPackagrCliArguments {
  /** Path to the 'ng-package.json' file */
  project: string
}


export const ngPackage = (opts: NgPackagrCliArguments): Promise<any> => {
  log.info(`Building Angular library from ${opts.project}`);
  if (!path.isAbsolute(opts.project)) {
    opts.project = path.resolve(process.cwd(), opts.project);
  }

  /** Project configuration */
  let ngPkg: NgPackage;

  // 0. READ `ng-package.json` and obtain model
  return readPackage(opts.project)
    .then((p) => {
      ngPkg = p;

      // 1. CLEAN
      return Promise.all([
        rimraf(p.dest),
        rimraf(p.workingDirectory)
      ]);
    })
    // 1. Generate bundle for primary entrypoint
    .then(() => generateNgBundle(ngPkg, ngPkg))
    // TODO: generate bundles for secondary entrypoints
    // TODO: write package.json 'lite' for secondary entrypoints
    // 2. WRITE NPM PACKAGE
    .then(() => copyFiles(`${ngPkg.src}/README.md`, ngPkg.dest))
    .then(() => copyFiles(`${ngPkg.src}/LICENSE`, ngPkg.dest))
    .then(() => writePackage(ngPkg.src, ngPkg.dest, ngPkg.artefacts))
    .then(() => {
      log.success(`Built Angular library from ${ngPkg.src}, written to ${ngPkg.dest}`);
    })
    .catch((err) => {
      // Report error messages and throw the error further up
      log.error(err);
      return Promise.reject(err);
    });

}
