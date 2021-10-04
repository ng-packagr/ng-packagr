import { VERSION as ROLLUP_VERSION } from 'rollup';
import { version as TS_VERSION } from 'typescript';
import { Command } from './command';
import { ngCompilerCli } from '../utils/ng-compiler-cli';

/**
 * Prints version information.
 *
 * @stable
 */
export const version: Command<any, Promise<void>> = async () => {
  console.log(`ng-packagr:            ` + require('../../package.json').version);
  console.log(`@angular/compiler:     ` + (await ngCompilerCli()).VERSION);
  console.log(`rollup:                ` + ROLLUP_VERSION);
  console.log(`typescript:            ` + TS_VERSION);
};
