import { NgPackageConfig } from '../../ng-package.schema';
const path = require('path');

const SCOPE_PREFIX = '@';
const SCOPE_NAME_SEPARATOR = '/';


/** POVO (plain-old value object) of the Angular package being built. */
export class NgPackage {

  constructor(
    private basePath: string,
    /** Contents of `ng-package.json` file. */
    public ngPackageJson: NgPackageConfig,
    /** Contents of `package.json` file. */
    public packageJson: any
  ) {}

  public get dest(): string {
    return path.resolve(this.basePath, this.ngPackageJson.dest);
  }

  public get src(): string {
    return path.resolve(this.basePath, this.ngPackageJson.src);
  }

  public get workingDirectory(): string {
    return path.resolve(this.basePath, this.ngPackageJson.workingDirectory);
  }

  public get flatModuleFileName(): string {
    return path.basename(this.ngPackageJson.lib.flatModuleFile || this.meta.name);
  }

  public get libExternals(): Object {
    return this.ngPackageJson.lib.externals || {};
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
