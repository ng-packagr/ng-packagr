import { VERSION as ROLLUP_VERSION } from 'rollup';
import { VERSION as COMPILER_VERSION } from '@angular/compiler';
import { version as TS_VERSION } from 'typescript';
import { Command } from './command';

const TSICKLE_VERSION = require('tsickle/package.json').version;

/**
 * Prints version information.
 *
 * @stable
 */
export const version: Command<any, void> = (pkg: any) => {
  const NG_PACKAGR_VERSION = pkg ? pkg.version : 'unknown';

  console.log(`ng-packagr:            ` + NG_PACKAGR_VERSION);
  console.log(`@angular/compiler:     ` + COMPILER_VERSION.full);
  console.log(`rollup:                ` + ROLLUP_VERSION);
  console.log(`tsickle:               ` + TSICKLE_VERSION);
  console.log(`typescript:            ` + TS_VERSION);
};
