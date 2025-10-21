import { version as TS_VERSION } from 'typescript';
import { msg } from '../utils/log';
import { Command } from './command';

/**
 * Prints version information.
 *
 * @stable
 */
export const version: Command<any, Promise<void>> = async () => {
  msg(`ng-packagr:            ` + require('../../package.json').version);
  msg(`@angular/compiler:     ` + (await import('@angular/compiler-cli')).VERSION.full);
  msg(`typescript:            ` + TS_VERSION);
};
