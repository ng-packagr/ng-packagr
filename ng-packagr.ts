// BUILD STEP IMPLEMENTATIONS
import { processAssets } from './steps/assets';
import { copyFiles } from './steps/copy';
import { ngc } from './steps/ngc';
import { createPackage, readPackage, preparePackage } from './steps/package';
import { rimraf } from './steps/rimraf';
import { rollup } from './steps/rollup';
import { remapSourcemap } from './steps/sorcery';
import { downlevelWithTsc } from './steps/tsc';


// Logging
import { error, warn, info, success, debug } from './util/log';

// There are no type definitions available for these imports.
const sorcery = require('sorcery');
const uglify = require('uglify-js');


export interface NgPackagrOptions {
  src: string,
  dest: string,
  workingDirectory: string
}


export const packageAngular = (opts: NgPackagrOptions): Promise<any> => {
  info(`Building Angular library in ${opts.src}`);

  let sourcePkg: any;

  return rimraf(opts.dest)
    .then(() => rimraf(opts.workingDirectory))
    // 1. READ PACKGE
    .then(() => preparePackage(opts.src))
    .then((pkg) => {
      sourcePkg = pkg;

      return Promise.resolve(pkg);
    })
    // 2. ASSETS
    .then(() => processAssets(opts.src, `${opts.workingDirectory}`))
    // 3. NGC
    .then(() => ngc(`${opts.src}/tsconfig.lib.json`, `${opts.workingDirectory}`))
    .then(() => remapSourcemap(`${opts.workingDirectory}/src/index.js`))
    // 4. FESM15: ROLLUP
    .then(() => rollup({
      moduleName: `${sourcePkg.meta.name}`,
      entry: `${opts.workingDirectory}/src/index.js`, // TODO: this could come from tsconfig.lib.json being parsed (OR override tsconfig with default value)
      format: 'es',
      dest: `${opts.workingDirectory}/${sourcePkg.dest.es2015}`
    }))
    .then(() => remapSourcemap(`${opts.workingDirectory}/${sourcePkg.dest.es2015}`))
    // 5. FESM5: TSC
    .then(() => downlevelWithTsc(
      `${opts.workingDirectory}/${sourcePkg.dest.es2015}`,
      `${opts.workingDirectory}/${sourcePkg.dest.module}`))
    .then(() => remapSourcemap(`${opts.workingDirectory}/${sourcePkg.dest.module}`))
    // 6. UMD: ROLLUP
    .then(() => rollup({
      moduleName: `${sourcePkg.meta.name}`,
      entry: `${opts.workingDirectory}/${sourcePkg.dest.module}`,
      format: 'umd',
      dest: `${opts.workingDirectory}/${sourcePkg.dest.main}`
    }))
    .then(() => remapSourcemap(`${opts.workingDirectory}/${sourcePkg.dest.main}`))
    // 7. COPY FILES
    .then(() => copyFiles(`${opts.workingDirectory}/${sourcePkg.meta.prefix}/**/*.{js,js.map}`, `${opts.dest}/${sourcePkg.meta.prefix}`))
    .then(() => copyFiles(`${opts.workingDirectory}/bundles/**/*.{js,js.map}`, `${opts.dest}/bundles`))
    .then(() => copyFiles(`${opts.workingDirectory}/**/*.{d.ts,metadata.json}`, `${opts.dest}`))
    .then(() => copyFiles(`${opts.src}/README.md`, opts.dest))
    .then(() => copyFiles(`${opts.src}/LICENSE`, opts.dest))
    // 8. PACKAGE
    .then(() => createPackage(`${opts.src}`, `${opts.dest}`, sourcePkg.dest))
    .then(() => {
      success(`Built Angular library in ${opts.src}, written to ${opts.dest}`);
    })

}
