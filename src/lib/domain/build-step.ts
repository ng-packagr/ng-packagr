import { Artefacts } from './build-artefacts';
import { NgEntryPoint, NgPackage } from './ng-package-format';

/**
 *
 *
 */
export interface BuildStep {

  ({}: {
    artefacts: Artefacts,
    entryPoint: NgEntryPoint,
    pkg: NgPackage
  }): void | any | Promise<void | any>;

}
