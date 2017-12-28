import * as path from 'path';
import { SchemaClass } from '@ngtools/json-schema';
import { NgPackageConfig } from '../../ng-package.schema';
import { DirectoryPath, SourceFilePath } from './shared';

/**
 * XX: to be renamed to EntryPoint?
 *
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
