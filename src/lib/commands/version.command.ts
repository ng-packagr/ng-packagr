import { VERSION as ROLLUP_VERSION } from 'rollup';
import { version as TS_VERSION } from 'typescript';
import { ngCompilerCli } from '../utils/load-esm';
import { msg } from '../utils/log';
import { Command } from './command';

/**
 * Prints version information.
 *
 * @stable
 */
export const version: Command<any, Promise<void>> = async () => {
  msg(`ng-packagr:            ` + require('../../package.json').version);
  msg(`@angular/compiler:     ` + (await ngCompilerCli()).VERSION.full);
  msg(`rollup:                ` + ROLLUP_VERSION);
  msg(`typescript:            ` + TS_VERSION);
};
