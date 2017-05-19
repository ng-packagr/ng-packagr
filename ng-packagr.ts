// BUILD STEP IMPLEMENTATIONS
import { processAssets } from './steps/assets';
import { copyFiles } from './steps/copy';
import { ngc } from './steps/ngc';
import { createPackage, readPackage, preparePackage } from './steps/package';
import { rimraf } from './steps/rimraf';
import { rollup } from './steps/rollup';
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
    .then(() => processAssets(opts.src, `${opts.workingDirectory}/sources`))
    // 3. NGC
    .then(() => ngc(`${opts.src}/tsconfig.lib.json`, `${opts.workingDirectory}/sources`))
    // 4. FESM15: ROLLUP
    .then(() => rollup({
      moduleName: `${sourcePkg.meta.name}`,
      entry: `${opts.workingDirectory}/sources/index.js`,
      format: 'es',
      dest: `${opts.workingDirectory}/packages/${sourcePkg.dest.es2015}`
    }))
    // 5. FESM5: TSC
    .then(() => downlevelWithTsc(
      `${opts.workingDirectory}/packages/${sourcePkg.dest.es2015}`,
      `${opts.workingDirectory}/packages/${sourcePkg.dest.module}`))
    // 6. UMD: ROLLUP
    .then(() => rollup({
      moduleName: `${sourcePkg.meta.name}`,
      entry: `${opts.workingDirectory}/packages/${sourcePkg.dest.module}`,
      format: 'umd',
      dest: `${opts.workingDirectory}/packages/${sourcePkg.dest.main}`
    }))
    // 7. COPY FILES
    .then(() => copyFiles(`${opts.workingDirectory}/packages/**/*.{js,js.map}`, `${opts.dest}`))
    .then(() => copyFiles(`${opts.workingDirectory}/sources/**/*.{d.ts,metadata.json}`, `${opts.dest}/src`))
    .then(() => copyFiles(`${opts.src}/README.md`, opts.dest))
    .then(() => copyFiles(`${opts.src}/LICENSE`, opts.dest))
    // 8. PACKAGE
    .then(() => createPackage(`${opts.src}`, `${opts.dest}`, sourcePkg.dest))
    .then(() => {
      success(`Built Angular library in ${opts.src}, written to ${opts.dest}`);
    })

}



// TODO: need to re-map sourcemaps for EVERY transformation step to keep reference to original sources
// X. REMAPE SOURCEMAP
async function remapSourcemap(sourceFile: string) {
  // Once sorcery loaded the chain of sourcemaps, the new sourcemap will be written asynchronously.
  return (await sorcery.load(sourceFile)).write();
}
