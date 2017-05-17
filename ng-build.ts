import * as ts from 'typescript';
import * as path from 'path';
import * as fs from 'fs';
import {main as tsc} from '@angular/tsc-wrapped';
import {ScriptTarget, ModuleKind} from 'typescript';

// There are no type definitions available for these imports.
const inlineNg2Template =  require('gulp-inline-ng2-template');
const rollup = require('rollup');
const sass = require('node-sass');
const sorcery = require('sorcery');
const uglify = require('uglify-js');
const vfs = require('vinyl-fs');


// TODO: this should come from cli arguments
const SOURCE = 'foo';
const TARGET = 'dist';

const TEMP = '.ng_build';

const doAssets = () => {

  return new Promise((resolve, reject) => {
    vfs.src(`${SOURCE}/**/*.ts`)
      .pipe(inlineNg2Template({
        base: `${SOURCE}`,
        useRelativePaths: true,
        styleProcessor: (path, ext, file, cb) => {

          sass.render({
            file: path
          }, (err, result) => {
            if (err) {
              cb(err);
            } else {
              cb(null, result.css.toString());
            }
          });
        }
      }))
      .on('error', reject)
      .pipe(vfs.dest(`${TEMP}/sources`))
      .on('end', resolve);
  });

}


const doNgc = () => {
  const tsconfigBuild = 'tsconfig.ng.json';
  tsc(tsconfigBuild, { basePath: `${TEMP}/sources` });
}


const doRollup = (entry: string, format: string, dest: string) => {
  const ROLLUP_GLOBALS = {
    // Angular dependencies
    '@angular/animations': 'ng.animations',
    '@angular/core': 'ng.core',
    '@angular/common': 'ng.common',
    '@angular/forms': 'ng.forms',
    '@angular/http': 'ng.http',
    '@angular/platform-browser': 'ng.platformBrowser',
    '@angular/platform-browser-dynamic': 'ng.platformBrowserDynamic',
    '@angular/platform-browser/animations': 'ng.platformBrowser.animations',
  };

  let bundleOptions = {
    context: 'this',
    external: Object.keys(ROLLUP_GLOBALS),
    entry: entry
  };

  let writeOptions = {
    // Keep the moduleId empty because we don't want to force developers to a specific moduleId.
    moduleId: '',
    moduleName: 'ng.material',
    banner: '',
    format: format,
    dest: dest,
    globals: ROLLUP_GLOBALS,
    sourceMap: true
  };

  return rollup.rollup(bundleOptions).then((bundle: any) => bundle.write(writeOptions));
}


const doTsc = (inputFile: string, outputFile: string) => {

  let input = fs.readFileSync(inputFile, 'utf-8');
  let transpiled = ts.transpileModule(input, {
    compilerOptions: {
      target: ScriptTarget.ES5,
      module: ModuleKind.ES2015,
      allowJs: true
    }
  });
  fs.writeFileSync(outputFile, transpiled.outputText);

  return Promise.resolve();
};


// X. REMAPE SOURCEMAP
async function remapSourcemap(sourceFile: string) {
  // Once sorcery loaded the chain of sourcemaps, the new sourcemap will be written asynchronously.
  return (await sorcery.load(sourceFile)).write();
}

const doPackage = () => {
  console.log('Would need to copy over files from here to there...create package.json');
}


// 1. ASSETS
doAssets()
              // 2. NGC
  .then(() => doNgc())
              // 3. FESM15: ROLLUP
  .then(() => doRollup(`${TEMP}/sources/index.js`, 'es', '.ng_build/bundles/fesm2015.js'))
              // 4. FESM5: TSC
  .then(() => doTsc('.ng_build/bundles/fesm2015.js', '.ng_build/bundles/es5.js'))
              // 5. UMD: ROLLUP
  .then(() => doRollup(`${TEMP}/bundles/es5.js`, 'umd', '.ng_build/bundles/umd.js'))
              // 6. PACKAGE
  .then(() => doPackage())
