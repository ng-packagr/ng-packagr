import * as path from 'path';
import { SchemaClass } from '@ngtools/json-schema';
import { NgPackageConfig } from '../../ng-package.schema';
import { DirectoryPath, SourceFilePath, CssUrl, DestinationFiles } from './shared';

/**
 * An entry point - quoting Angular Package Format - is:
 *
 * > a module intended to be imported by the user. It is referenced by a unique module ID and
 * > exports the public API referenced by that module ID. An example is `@angular/core` or
 * > `@angular/core/testing`. Both entry points exist in the `@angular/core` package, but they
 * > export different symbols. A package can have many entry points.
 *
 * #### Public API, source file tree and build output
 *
 * An entry point serves as the root of a source tree.
 * The entry point's public API references one TypeScript source file (`*.ts`).
 * That source file, e.g. `public_api.ts`, references other source files who in turn may reference
 * other source files, thus creating a tree of source code files.
 * The source files may be TypeScript (`*.ts`), Templates (`.html`) or Stylesheets
 * (`.css`, `.scss`, ..), or other formats.
 *
 * The compilation process for an entry point is a series of transformations applied to the source
 * files, e.g. TypeScript compilation, Inlining of Stylesheets and Templates, and so on.
 * As a result of the compilation process, an entry point is transpiled to a set of artefacts
 * (the build output) which include a FESM'15 Bundle, a FESM'5 Bundle, AoT metadata, TypeScript
 * type definitions, and so on.
 *
 * #### Representation in the domain
 *
 * The set of artefacts is reflected by `NgArtefacts`;
 * one `NgEntryPoint` relates to one `NgArtefacts`.
 * The parent package of an entry point is reflected by `NgPackage`.
 */
export class NgEntryPoint {
  constructor(
    /** Values from the `package.json` file of this entry point. */
    public readonly packageJson: any,
    /** Values from either the `ngPackage` option (from `package.json`) or values from `ng-package.json`. */
    public readonly ngPackageJson: NgPackageConfig,
    /** Corresponding JSON schema class instantiated from `ngPackageJson` values. */
    private readonly $schema: SchemaClass<NgPackageConfig>,
    /** Absolute directory path of this entry point's `package.json` location. */
    public readonly basePath: string,
    /** XX: additional auto-configured data passed for scondary entry point's. Needs better docs. */
    private readonly secondaryData?: { [key: string]: any }
  ) {}

  /** Absolute file path of the entry point's source code entry file. */
  public get entryFilePath(): SourceFilePath {
    return path.resolve(this.basePath, this.entryFile);
  }

  /** Whether or not the entrypoint is secondary */
  public get isSecondaryEntryPoint(): boolean {
    return !!this.secondaryData;
  }

  /** Absolute directory path of this entry point's 'package.json'. */
  public get destinationPath(): DirectoryPath {
    if (this.secondaryData) {
      return this.secondaryData.destinationPath;
    } else {
      return path.resolve(this.basePath, this.$get('dest'));
    }
  }

  public get destinationFiles(): DestinationFiles {
    let primaryDestPath = this.destinationPath;
    let secondaryDir = '';

    if (this.secondaryData) {
      primaryDestPath = this.secondaryData.primaryDestinationPath;
      secondaryDir = path.relative(primaryDestPath, this.secondaryData.destinationPath);
    }

    const flatModuleFile = this.flatModuleFile;
    const pathJoinWithDest = (...paths: string[]) => path.join(primaryDestPath, ...paths);

    return {
      metadata: pathJoinWithDest(secondaryDir, `${flatModuleFile}.metadata.json`),
      declarations: pathJoinWithDest(secondaryDir, `${flatModuleFile}.d.ts`),
      esm2015: pathJoinWithDest('esm2015', secondaryDir, `${flatModuleFile}.js`),
      esm5: pathJoinWithDest('esm5', secondaryDir, `${flatModuleFile}.js`),
      fesm2015: pathJoinWithDest('fesm2015', `${flatModuleFile}.js`),
      fesm5: pathJoinWithDest('fesm5', `${flatModuleFile}.js`),
      umd: pathJoinWithDest('bundles', `${flatModuleFile}.umd.js`),
      umdMinified: pathJoinWithDest('bundles', `${flatModuleFile}.umd.min.js`)
    };
  }

  public $get(key: string): any {
    return this.$schema.$$get(key);
  }

  public get entryFile(): SourceFilePath {
    return this.$get('lib.entryFile');
  }

  public get cssUrl(): CssUrl {
    return this.$get('lib.cssUrl');
  }

  public get umdModuleIds(): { [key: string]: string } {
    return this.$get('lib.umdModuleIds');
  }

  public get jsxConfig(): string {
    return this.$get('lib.jsx');
  }

  public get flatModuleFile(): string {
    return this.$get('lib.flatModuleFile') || this.flattenModuleId('-');
  }

  public get styleIncludePaths(): string[] {
    const includePaths = this.$get('lib.styleIncludePaths') || [];
    return includePaths.map(
      includePath => (path.isAbsolute(includePath) ? includePath : path.resolve(this.basePath, includePath))
    );
  }

  public get languageLevel(): string[] {
    return this.$get('lib.languageLevel');
  }

  /**
   * The module ID is an "identifier of a module used in the import statements, e.g.
   * '@angular/core'. The ID often maps directly to a path on the filesystem, but this
   * is not always the case due to various module resolution strategies."
   */
  public get moduleId(): string {
    if (this.secondaryData) {
      return this.secondaryData.moduleId;
    } else {
      return this.packageJson['name'];
    }
  }

  /**
   * The UMD module ID registers a module on the old-fashioned JavaScript global scope.
   * Used by UMD bundles only.
   * Example: `@my/foo/bar` registers as `global['my']['foo']['bar']`.
   */
  public get umdId(): string {
    return this.$get('lib.umdId') || this.flattenModuleId();
  }

  /**
   * The AMD ID reflects a named module that is distributed in the UMD bundles.
   * @link http://requirejs.org/docs/whyamd.html#namedmodules
   */
  public get amdId(): string {
    return this.$get('lib.amdId') || this.moduleId;
  }

  private flattenModuleId(separator: string = '.') {
    if (this.moduleId.startsWith('@')) {
      return this.moduleId
        .substring(1)
        .split('/')
        .join(separator);
    } else {
      return this.moduleId.split('/').join(separator);
    }
  }

  /**
   * Enables the `"sideEffects": false` flag in `package.json`.
   * The flag is enabled and set to `false` by default which results in more aggressive optimizations applied by webpack v4 builds consuming the library.
   * To override the default behaviour, you need to set `"sideEffects": true` explicitly in your `package.json`.
   *
   * @link https://github.com/webpack/webpack/tree/master/examples/side-effects
   */
  public get sideEffects(): boolean | string[] {
    return this.packageJson['sideEffects'] || false;
  }
}
