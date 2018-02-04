import { NgArtefacts } from './ng-package-format/artefacts';
import { NgEntryPoint } from './ng-package-format/entry-point';
import { NgPackage } from './ng-package-format/package';
import { build, CliArguments } from './commands/build.command';
import { execute } from './commands/command';
import * as log from './util/log';

/** @deprecated */
export async function createNgPackage(opts: CliArguments): Promise<void> {
  log.warn(
    `DEPRECATED: createNgPackage() is deprecated and will be removed in v3. Invoke the Command 'build()' instead.`
  );
  return execute(build, opts);
}

/**
 * `BuildStep` is deprecated.
 * See the architectural re-write for a [transformation pipeline](./docs/transformation-pipeline.md).
 *
 * @deprecated Will be removed in v3.
 */
export interface BuildStep {
  (
    {

    }: {
      artefacts: NgArtefacts;
      entryPoint: NgEntryPoint;
      pkg: NgPackage;
    }
  ): void | any | Promise<void | any>;
}
