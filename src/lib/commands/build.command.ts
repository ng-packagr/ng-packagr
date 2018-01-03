import { Command } from './command';
import { buildNgPackage } from '../steps/build-ng-package';

/** CLI arguments passed to `ng-packagr` executable and `build()` command. */
export interface CliArguments {

  /** Path to the project file 'package.json', 'ng-package.json', or 'ng-package.js'. */
  project: string
}

export const build: Command<CliArguments, void> =
  (opts) => buildNgPackage(opts);
