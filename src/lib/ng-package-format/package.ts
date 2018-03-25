import * as path from 'path';
import { NgEntryPoint } from './entry-point';
import { DirectoryPath, SourceFilePath } from './shared';

/**
 * A package being built. Quoting Angular Package Format, a package is:
 *
 * > the smallest set of files that are published to NPM and installed together, for example
 * > `@angular/core`. (..) The package is installed with `npm install @angular/core`.
 *
 * #### Package and Entry Points
 *
 * A package is composed of several (one or more) entry points.
 * A package must contain at least the primary entry point but can have many secondary entry
 * points.
 * The module ID of the primary entry point, e.g. `@angular/core`, matches the package name, e.g.
 * the package name is given to the command `npm install @angular/core`.
 * The source code files within a package are referenced by the entry points.
 *
 * #### Representation in the domain
 *
 * A _Package_ is reflected by `NgPackage`.
 * An _Entry Point_ is reflected by `NgEntryPoint`.
 * One `NgPackage` relates to one (or many) `NgEentryPoint`,
 * one `NgEntryPoint` relates to one `NgPackage`.
 *
 * #### Watch Out
 *
 * The user's configuration `ngPackage` suggests that it reflects a `NgPackage`.
 * However, the values given in the `lib` property reflect an `NgEntryPoint`.
 * In case the package contains only one entry point, `ngPackage.lib` reflects the primary entry
 * point.
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

  /** Delete output path before build */
  public get deleteDestPath(): boolean {
    return this.primary.$get('deleteDestPath');
  }

  /** Absolute path of the package's destination directory. */
  public get dest(): DirectoryPath {
    return this.absolutePathFromPrimary('dest');
  }

  /** Absolute path of the package's working directory (used for intermediate file storage). */
  public get workingDirectory(): DirectoryPath {
    return this.absolutePathFromPrimary('workingDirectory');
  }

  public get keepLifecycleScripts(): boolean {
    return this.primary.$get('keepLifecycleScripts') === true;
  }

  public get whitelistedNonPeerDependencies(): string[] {
    // XX: default array values from JSON schema not recognized
    const defValue = ['tslib'];
    const value = (this.primary.$get('whitelistedNonPeerDependencies') as string[]) || defValue;

    // Always append 'tslib' and dedupe
    return value.concat('tslib').filter((value, index, self) => self.indexOf(value) === index);
  }

  private absolutePathFromPrimary(key: string) {
    return path.resolve(this.basePath, this.primary.$get(key));
  }

  public entryPoint(moduleId: string): NgEntryPoint {
    return [this.primary, ...this.secondaries].find(entryPoint => entryPoint.moduleId === moduleId);
  }
}
