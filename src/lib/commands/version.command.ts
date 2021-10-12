import { VERSION as ROLLUP_VERSION } from 'rollup';
import { version as TS_VERSION } from 'typescript';
import { msg } from '../utils/log';
import { ngCompilerCli } from '../utils/ng-compiler-cli';
import { Command } from './command';

/**
 * Prints version information.
 *
 * @stable
 */
export const version: Command<any, Promise<void>> = async () => {
  msg(`ng-packagr:            ` + require('../../package.json').version);
  msg(`@angular/compiler:     ` + (await ngCompilerCli()).VERSION);
  msg(`rollup:                ` + ROLLUP_VERSION);
  msg(`typescript:            ` + TS_VERSION);
};
