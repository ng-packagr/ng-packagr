import { VERSION as ROLLUP_VERSION } from 'rollup';
import { VERSION as COMPILER_VERSION } from '@angular/compiler';
import { version as TS_VERSION } from 'typescript';
import { Command } from './command';

/**
 * Prints version information.
 *
 * @stable
 */
export const version: Command<any, void> = () => {
  console.log(`ng-packagr:            ` + require('../../package.json').version);
  console.log(`@angular/compiler:     ` + COMPILER_VERSION.full);
  console.log(`rollup:                ` + ROLLUP_VERSION);
  console.log(`typescript:            ` + TS_VERSION);
};
