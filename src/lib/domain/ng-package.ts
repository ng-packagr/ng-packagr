import * as path from 'path';
import { SchemaClass } from '@ngtools/json-schema';
import { NgPackageConfig } from '../../ng-package.schema';

/**
 * An Angular package being built.
 *
 * #### Representation in the domain
 *
 * Angular Package Format defines the terms _Package_ and _Entry Point_.
 * A _Package_ is a "set of files that are published to NPM and installed together".
 * An _Entry Point_ is "referenced by a unique module ID and exports the public API referenced
 * by that module ID. An example is @angular/core or @angular/core/testing. Both entry points
 * exist in the @angular/core package, but they export different symbols. A package can have
 * many entry points."
 *
 * The term 'Package' is reflected by the domain class `NgPackage`.
 * An `NgPackage` is transformed to exactly one distribution-ready npm package.
 * Further, an `NgPackage` is composed of at least one entrypoint, one primary entry point and
 * zero or more secondary entry points.
 * Each of those entrypoints is reflected by `NgLibrary` and is considered the root of the source
 * code compilation / transformation process.
 *
 * #### Watch Out
 *
 * The user's configuration `ngPackage` suggests that the configuration object is reflected by
 * `NgPackage`. Is is not.
 *
 * The user's `ngPackage` configueation is represented in `NgEntryPoint`. In case of the
 * _Package_ (`NgPackage`), the configuration is reflected in the primary `NgEntryPoint`.
 *
 * @link https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/edit#
 */
export class NgPackage {

  constructor(
    private readonly basePath: string,

    /**
     * A reference to the primary entry point.
     */
    public readonly primary: NgEntryPoint,

    /**
     * An array of seconary entry points.
     */
    public readonly secondaries: NgEntryPoint[] = []
  ) {}

}

/**
 * An Angular library being compiled and transpiled to Angular Package Format.
 *
 * #### Relationship in the domain
 *
 * _TBD_ the thing that - in effect - gets compiled from `*.ts`, `*.html`, `*.css` (and so on)
 * to FESM'5, FESM2015, UMD, AoT metadata, typings.
 *
 * An `NgEntryPoint` serves as the root of a library's source tree.
 * During the compilation process (a tree transformation / transformation pipeline) it will be
 * transpiled to a set of artefacts such as a FESM'5 bundle, a FESM2015 bundle, AoT metadata,
 * and so on.
 * The set of artefacts is reflected in `NgArtefacts`.
 */
export class NgEntryPoint {

  constructor(
    public readonly packageJson: any,
    public readonly ngPackageJson: NgPackageConfig,
    private $schema: SchemaClass<NgPackageConfig>
  ) {}

  // this.$schema.$$get('lib.flatModuleFile')

  entryFile: SourceFilePath;
}


/**
 * An entrypoint of an Angular library.
 *
 * Typically, an entrypoint refers to the `public_api.ts` source file, referencing all other
 * source files that are considered in the compilation (transformation) process, as well as
 * describing the API surface of a library.
 */
export type SourceFilePath = string;
