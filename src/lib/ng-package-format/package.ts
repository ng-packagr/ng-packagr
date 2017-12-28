import * as path from 'path';
import { NgEntryPoint } from './entry-point';
import { DirectoryPath, SourceFilePath } from './shared';

/**
 * XX: to be renamed to NpmPackage?
 *
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

  /** Absolute path of the package's source folder, derived from the user's (primary) package location. */
  public get src(): DirectoryPath {
    return this.basePath;
  }

  /** Absolute path of the package's destination directory. */
  public get dest(): DirectoryPath {
    return this.absolutePathFromPrimary('dest');
  }

  /** Absolute path of the package's working directory (used for intermediate file storage). */
  public get workingDirectory(): DirectoryPath {
    return this.absolutePathFromPrimary('workingDirectory');
  }

  private absolutePathFromPrimary(key: string) {
    return path.resolve(this.basePath, this.primary.$get(key));
  }

  public entryPoint(moduleId: string): NgEntryPoint {
    return [ this.primary, ...this.secondaries]
      .find((entryPoint) => entryPoint.moduleId === moduleId);
  }

}
