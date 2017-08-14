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

  /*
  const foo = this.$schema.$$get('lib.entryFile'); // --> "src/public_api.ts"
  const bar = this.$schema.$$get('lib'); // --> undefined
  console.log(foo);
  console.log(bar);
  */

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
  public get artefacts() {
    const main: string = `bundles/${this.meta.name}.umd.js`;
    const module: string = `${this.meta.scope}/${this.meta.name}.es5.js`;
    const es2015: string = `${this.meta.scope}/${this.meta.name}.js`;
    const typings: string = `${this.flatModuleFileName}.d.ts`;

    return { main, module, es2015, typings };
  }

}
