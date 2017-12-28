import { Artefacts } from './ng-package-format/artefacts';
import { NgEntryPoint } from './ng-package-format/entry-point';
import { NgPackage } from './ng-package-format/package';
import { build, CliArguments } from './commands/build.command';
import { execute } from './commands/command';
import * as log from './util/log';

export async function createNgPackage(opts: CliArguments): Promise<void> {
  log.warn(`DEPRECATED: createNgPackage() is becoming deprecated. Invoke the 'build: Command' instead.`);
  return execute(build, opts);
}

/**
 * XX: to be renamed to `BuildTask`, `BuildStep`, `Task`, ... ??!??
 *
 * Call signature for a build step.
 *
 * @experimental Might change in the future!
 */
export interface BuildStep {

  ({}: {
    artefacts: Artefacts,
    entryPoint: NgEntryPoint,
    pkg: NgPackage
  }): void | any | Promise<void | any>;

}
