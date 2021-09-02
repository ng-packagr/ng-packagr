import * as path from 'path';
import { NgPackageConfig } from '../../../ng-package.schema';
import { CssUrl } from '../../styles/stylesheet-processor';

/** A list of output absolute paths for various formats */
export interface DestinationFiles {
  /** Absolute path of this entry point `declarations` */
  declarations: string;
  /** Absolute path of this entry point `FESM2020` module */
  fesm2020: string;
  /** Absolute path of this entry point `FESM2015` module */
  fesm2015: string;
  /** Absolute path of this entry point `ESM2020` module */
  esm2020: string;
}

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
    public readonly packageJson: Record<string, any>,
    /** Values from either the `ngPackage` option (from `package.json`) or values from `ng-package.json`. */
    public readonly ngPackageJson: NgPackageConfig,
    /** Absolute directory path of this entry point's `package.json` location. */
    public readonly basePath: string,
    /** XX: additional auto-configured data passed for secondary entry point's. Needs better docs. */
    private readonly secondaryData?: { [key: string]: any },
  ) {}

  /** Absolute file path of the entry point's source code entry file. */
  public get entryFilePath(): string {
    return path.resolve(this.basePath, this.entryFile);
  }

  /** Whether or not the entrypoint is secondary */
  public get isSecondaryEntryPoint(): boolean {
    return !!this.secondaryData;
  }

  /** Absolute directory path of this entry point's 'package.json'. */
  public get destinationPath(): string {
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
      declarations: pathJoinWithDest(secondaryDir, `${flatModuleFile}.d.ts`),
      esm2020: pathJoinWithDest('esm2020', secondaryDir, `${flatModuleFile}.js`),
      fesm2020: pathJoinWithDest('fesm2020', `${flatModuleFile}.js`),
      fesm2015: pathJoinWithDest('fesm2015', `${flatModuleFile}.js`),
    };
  }

  public $get(key: string): any {
    const parts = key.split('.');
    let value = this.ngPackageJson as unknown;
    for (const key of parts) {
      if (typeof value === 'object' && value.hasOwnProperty(key)) {
        value = value[key];
      } else {
        return undefined;
      }
    }

    return value;
  }

  public get entryFile(): string {
    return this.$get('lib.entryFile');
  }

  public get cssUrl(): CssUrl {
    return this.$get('lib.cssUrl');
  }

  public get flatModuleFile(): string {
    return this.$get('lib.flatModuleFile') || this.flattenModuleId('-');
  }

  public get styleIncludePaths(): string[] {
    const includePaths = this.$get('lib.styleIncludePaths') || [];
    return includePaths.map(includePath =>
      path.isAbsolute(includePath) ? includePath : path.resolve(this.basePath, includePath),
    );
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

  private flattenModuleId(separator: string = '.') {
    if (this.moduleId.startsWith('@')) {
      return this.moduleId.substring(1).split('/').join(separator);
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
