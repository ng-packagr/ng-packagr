import { SchemaClass } from '@ngtools/json-schema';
import { NgPackageConfig } from '../../ng-package.schema';
const path = require('path');

const SCOPE_PREFIX = '@';
const SCOPE_NAME_SEPARATOR = '/';


/** POVO (plain-old value object :-)) of the Angular package being built. */
export class NgPackage {

  constructor(
    /** Unmodified contents of the project's `package.json` file. */
    public packageJson: any,
    /** Unmodified contents of the project's `ng-package.json` file. */
    public ngPackageJson: NgPackageConfig,
    private basePath: string,
    private $schema: SchemaClass<NgPackageConfig>
  ) {}

  public get dest(): string {
    return path.resolve(this.basePath, this.$schema.$$get('dest'));
  }

  public get src(): string {
    return path.resolve(this.basePath, this.$schema.$$get('src'));
  }

  public get workingDirectory(): string {
    return path.resolve(this.basePath, this.$schema.$$get('workingDirectory'));
  }

  public get flatModuleFileName(): string {
    let name: string = this.$schema.$$get('lib.flatModuleFile');
    if (!name) {
      name = this.meta.name;
    }

    return path.basename(name);
  }

  public get libExternals(): Object {
    if (this.ngPackageJson.lib) {
      return this.ngPackageJson.lib.externals;
    } else {
      return {};
    }
  }

  public get entryFile(): string {
    return this.$schema.$$get('lib.entryFile');
  }

  /** Package meta information */
  public get meta(): { name: string, scope?: string } {
    // split into name and scope (`@<scope>/<name>`)
    let scope: string = `${this.packageJson.name}`, name: string = `${this.packageJson.name}`;
    if (name.startsWith(SCOPE_PREFIX) && name.indexOf(SCOPE_NAME_SEPARATOR) > 0) {
      const idx = name.indexOf(SCOPE_NAME_SEPARATOR);
      scope = name.substring(0, idx);
      name = name.substring(idx + 1);
    }

    return { name, scope };
  }

  /** Build artefacts */
  public get artefacts(): NgArtefacts {
    const main: string = `bundles/${this.meta.name}.umd.js`;
    const module: string = `${this.meta.scope}/${this.meta.name}.es5.js`;
    const es2015: string = `${this.meta.scope}/${this.meta.name}.js`;
    const typings: string = `${this.flatModuleFileName}.d.ts`;
    const metadata: string = `${this.flatModuleFileName}.metadata.json`;

    return { main, module, es2015, typings, metadata };
  }

}

/** Generated build artefacts for an Angular library. */
export interface NgArtefacts {

  /** Main JavaScript bundle in UMD (universal-module definition) and ES5 syntax. */
  main: string;

  /** Flat ECMAScript module in ES5 sxntax (FESM'5). */
  module: string;

  /** Flat ECMAScript module in ES2015 syntax (FESM'15). */
  es2015: string;

  /** TypeScript type definition file. */
  typings: string;

  /** Ahead-of-Time metadata (`.metadata.json`) file. */
  metadata: string;
}

/**
 * One individual entrypoint for an Angular library that is being packaged.
 *
 * An `NgPackage` may have several entrypoints (primary and secondaries).
 * One `NgEntrypoint` gets compiled and bundled to a set of `NgArtefacts`.
 */
export interface NgEntrypoint {

  /** TypeScript source file that serves as the entrypoint. */
  entryFile: string;
}
