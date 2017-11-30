import { SchemaClass } from '@ngtools/json-schema';
import { NgPackageConfig } from '../../ng-package.schema';

/**
 * An Angular package being built.
 *
 * #### Relationship in the domain
 *
 * An `NgPackage` is reflected by exactly one distribution-ready npm package.
 * An `NgPackage` is composed of at least one entrypoint, one primary entrypoint and
 * zero or more secondary entrypoints. Each of those entrypoints is considered a library and
 * reflected in `NgLibrary`.
 */
export class NgPackage {

  constructor(
    public readonly primary: NgLibrary,
    public readonly secondaries: NgLibrary[] = []
  ) {}

}

/**
 * An Angular library being compiled and transpiled to Angular Package Format.
 *
 * #### Relationship in the domain
 *
 * _TBD_ the thing that - in effect - gets compiled from `*.ts`, `*.html`, `*.css` (and so on)
 * to FESM'5, FESM2015, UMD, AoT metadata, typings.
 */
export class NgLibrary {

  constructor(
    public readonly packageJson: any,
    public readonly ngPackageJson: NgPackageConfig,
    private $schema: SchemaClass<NgPackageConfig>
  ) {}

  // this.$schema.$$get('lib.flatModuleFile')

  entryFile: Entrypoint;
}


/**
 * An entrypoint of an Angular library.
 *
 * Typically, an entrypoint refers to the `public_api.ts` source file, referencing all other
 * source files that are considered in the compilation (transformation) process, as well as
 * describing the API surface of a library.
 *
 * #### Relationship in the domain
 *
 * An `Entrypoint` serves as the root of a library's source tree.
 * During the compilation process (a tree transformation / transformation pipeline) it will be
 * transpiled to a set of artefacts such as a FESM'5 bundle, a FESM2015 bundle, AoT metadata,
 * and so on. The set of artefacts is reflected in `NgArtefacts`.
 */
export type Entrypoint = string;
