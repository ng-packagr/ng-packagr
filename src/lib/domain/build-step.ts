import { Artefacts } from './build-artefacts';
import { NgEntryPoint, NgPackage } from './ng-package-format';

/**
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
