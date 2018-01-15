import * as path from 'path';
import { SchemaClass } from '@ngtools/json-schema';
import { NgPackageConfig } from '../../ng-package.schema';
import { DirectoryPath, SourceFilePath } from './shared';

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
    public readonly packageJson: any,
    public readonly ngPackageJson: NgPackageConfig,
    private readonly $schema: SchemaClass<NgPackageConfig>,
    private basePath: string,
    private readonly secondaryData?: { [key: string]: any }
  ) {}

  /** Absolute file path of the entry point's source code entry file. */
  public get entryFilePath(): SourceFilePath {
    return path.resolve(this.basePath, this.entryFile);
  }

  /** Absolute directory path of the entry point's 'package.json'. */
  public get destinationPath(): DirectoryPath {
    if (this.secondaryData) {
      return this.secondaryData.destinationPath;
    } else {
      return path.resolve(this.basePath, this.$get('dest'));
    }
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

  public get embedded(): string[] {
    return this.$get('lib.embedded');
  }

  public get jsxConfig(): string {
    return this.$get('lib.jsx');
  }

  public get flatModuleFile(): string {
    return this.$get('lib.flatModuleFile') || this.flattenModuleId('-');
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
   * The UMD module ID is a string value used for registering the module on the old-fashioned
   * JavaScript global scope.
   * Example: `@my/foo/bar` registers as `global['my']['foo']['bar']`.
   */
  public get umdModuleId(): string {
    return this.flattenModuleId();
  }

  private flattenModuleId(separator: string = '.') {
    if (this.moduleId.startsWith('@')) {
      return this.moduleId.substring(1).split('/').join(separator);
    } else {
      return this.moduleId.split('/').join(separator);
    }
  }

}

export enum CssUrl {
  inline = 'inline',
  none = 'none'
}
