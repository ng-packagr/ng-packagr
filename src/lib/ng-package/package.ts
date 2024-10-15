import * as path from 'path';
import { AssetPattern, NgPackageConfig } from '../../ng-package.schema';
import { ensureUnixPath } from '../utils/path';
import { NgEntryPoint } from './entry-point/entry-point';

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
 * One `NgPackage` relates to one (or many) `NgEntryPoint`,
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
     * An array of secondary entry points.
     */
    public readonly secondaries: NgEntryPoint[] = [],
  ) {}

  /** Absolute path of the package's source folder, derived from the user's (primary) package location. */
  public get src(): string {
    return this.basePath;
  }

  /** Delete output path before build */
  public get deleteDestPath(): boolean {
    return this.primary.$get('deleteDestPath');
  }

  /** Absolute path of the package's destination directory. */
  public get dest(): string {
    const dest = path.join(this.basePath, this.primary.$get('dest'));

    return ensureUnixPath(dest[dest.length - 1] === '/' ? dest.slice(0, -1) : dest);
  }

  public get keepLifecycleScripts(): boolean {
    return this.primary.$get('keepLifecycleScripts');
  }

  public get assets(): AssetPattern[] {
    return this.primary.$get('assets');
  }

  public get inlineStyleLanguage(): NgPackageConfig['inlineStyleLanguage'] {
    return this.primary.$get('inlineStyleLanguage');
  }

  public get allowedNonPeerDependencies(): string[] {
    const alwaysInclude = ['tslib'];
    const allowedNonPeerDependencies = this.primary.$get('allowedNonPeerDependencies') as string[];

    return Array.from(new Set([...allowedNonPeerDependencies, ...alwaysInclude]));
  }

  public entryPoint(moduleId: string): NgEntryPoint {
    return [this.primary, ...this.secondaries].find(entryPoint => entryPoint.moduleId === moduleId);
  }
}
