import { VERSION as ROLLUP_VERSION } from 'rollup';
import { VERSION as COMPILER_VERSION } from '@angular/compiler';
import { VERSION as COMPILER_CLI_VERSION } from '@angular/compiler-cli';
import { version as TS_VERSION } from 'typescript';
import { Command } from './command';

const TSICKLE_VERSION = require('tsickle/package.json').version;

let NG_PACKAGR_VERSION: string = 'unknown';
function tryReadVersion(paths: string[] = []) {
  if (paths.length === 0) {
    return;
  }
  try {
    const PKG = require(paths.shift());
    if (PKG.name === 'ng-packagr') {
      NG_PACKAGR_VERSION = PKG.version;
    } else {
      tryReadVersion(paths)
    }
  } catch (e) {
    tryReadVersion(paths);
  }
}

/** @stable */
export const version: Command<undefined, void> =
  () => {
    tryReadVersion(['../../package.json', '../../../package.json']);

    console.log(`ng-packagr:            ` + NG_PACKAGR_VERSION);
    console.log(`@angular/compiler:     ` + COMPILER_VERSION.full);
    console.log(`@angular/compiler-cli: ` + COMPILER_CLI_VERSION.full);
    console.log(`rollup:                ` + ROLLUP_VERSION);
    console.log(`tsickle:               ` + TSICKLE_VERSION);
    console.log(`typescript:            ` + TS_VERSION);
  };
