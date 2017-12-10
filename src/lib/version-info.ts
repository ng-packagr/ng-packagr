import * as rollup from 'rollup';
import { VERSION as COMPILER_VERSION } from '@angular/compiler';
import { VERSION as COMPILER_CLI_VERSION } from '@angular/compiler-cli';
import { version as tsVersion } from 'typescript';

const NGC_VERSION = COMPILER_VERSION.full;
const CLI_VERSION = COMPILER_CLI_VERSION.full;
const ROLLUP_VERSION = (rollup as any).VERSION;
const TS_VERSION = tsVersion;
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

tryReadVersion(['../../package.json', '../../../package.json']);

export function printVersionInfo() {
  console.log(`ng-packagr:            ` + NG_PACKAGR_VERSION);
  console.log(`@angular/compiler:     ` + NGC_VERSION);
  console.log(`@angular/compiler-cli: ` + NGC_VERSION);
  console.log(`rollup:                ` + ROLLUP_VERSION);
  console.log(`tsickle:               ` + TSICKLE_VERSION);
  console.log(`typescript:            ` + TS_VERSION);
}
