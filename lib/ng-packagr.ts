// BUILD STEP IMPLEMENTATIONS
import { processAssets } from './steps/assets';
import { copyFiles } from './steps/copy';
import { ngc } from './steps/ngc';
import { createPackage, readJson, preparePackage } from './steps/package';
import { rimraf } from './steps/rimraf';
import { rollup } from './steps/rollup';
import { remapSourcemap } from './steps/sorcery';
import { downlevelWithTsc } from './steps/tsc';


// Logging
import { error, warn, info, success, debug } from './util/log';

// There are no type definitions available for these imports.
const fs = require('mz/fs');
const uglify = require('uglify-js');


/** Options passed to the main entry of the packaging script */
export interface NgPackagrOptions {
  /** Path to the '.ng-packagr.json' file */
  project: string
}

/** Config object from '.ng-packagr.json' */
export interface NgPackagrConfig {
  src: string,
  dest: string,
  workingDirectory: string,
  ngc: {
    tsconfig: string
  },
  rollup: {
    config: string
  }
}


export const packageAngular = (opts: NgPackagrOptions): Promise<any> => {
  info(`Building Angular library from ${opts.project}`);

  /** Project configuration */
  let project: NgPackagrConfig;
  let tsConfig: any;
  let flatModuleFile: string;
  let sourcePkg: any;

  return readJson(opts.project)
    .then((p) => {
      project = p;

      // 0. CLEAN
      return Promise.all([
        rimraf(p.dest),
        rimraf(p.workingDirectory)
      ]);
    })
    // 1. READ PACKGE
    .then(() => preparePackage(project.src)
      .then((pkg) => {
        sourcePkg = pkg;

        return Promise.resolve(pkg);
      })
    )
    .then(() => readJson(`${project.src}/${project.ngc.tsconfig}`)
      .then((cfg) => {
        tsConfig = cfg;

        flatModuleFile = `${project.workingDirectory}/${tsConfig.compilerOptions.outDir}/${tsConfig.angularCompilerOptions.flatModuleOutFile}.js`;
      })
    )
    // 2. ASSETS
    .then(() => processAssets(project.src, `${project.workingDirectory}`))
    // 3. NGC
    .then(() => ngc(`${project.src}/${project.ngc.tsconfig}`, `${project.workingDirectory}`))
    .then(() => remapSourcemap(flatModuleFile))
    // 4. FESM15: ROLLUP
    .then(() => rollup({
      moduleName: `${sourcePkg.meta.name}`,
      entry: flatModuleFile,
      format: 'es',
      dest: `${project.workingDirectory}/${sourcePkg.dest.es2015}`
    }))
    .then(() => remapSourcemap(`${project.workingDirectory}/${sourcePkg.dest.es2015}`))
    // 5. FESM5: TSC
    .then(() => downlevelWithTsc(
      `${project.workingDirectory}/${sourcePkg.dest.es2015}`,
      `${project.workingDirectory}/${sourcePkg.dest.module}`))
    .then(() => remapSourcemap(`${project.workingDirectory}/${sourcePkg.dest.module}`))
    // 6. UMD: ROLLUP
    .then(() => rollup({
      moduleName: `${sourcePkg.meta.name}`,
      entry: `${project.workingDirectory}/${sourcePkg.dest.module}`,
      format: 'umd',
      dest: `${project.workingDirectory}/${sourcePkg.dest.main}`
    }))
    .then(() => remapSourcemap(`${project.workingDirectory}/${sourcePkg.dest.main}`))
    // 7. COPY FILES
    .then(() => copyFiles(`${project.workingDirectory}/${sourcePkg.meta.prefix}/**/*.{js,js.map}`, `${project.dest}/${sourcePkg.meta.prefix}`))
    .then(() => copyFiles(`${project.workingDirectory}/bundles/**/*.{js,js.map}`, `${project.dest}/bundles`))
    .then(() => copyFiles(`${project.workingDirectory}/**/*.{d.ts,metadata.json}`, `${project.dest}`))
    .then(() => copyFiles(`${project.src}/README.md`, project.dest))
    .then(() => copyFiles(`${project.src}/LICENSE`, project.dest))
    // 8. PACKAGE
    .then(() => createPackage(`${project.src}`, `${project.dest}`, sourcePkg.dest))
    .then(() => {
      success(`Built Angular library in ${project.src}, written to ${project.dest}`);
    });

}
