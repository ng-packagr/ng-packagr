import { NgPackageConfig } from '../conf/ng-package.conf';
const path = require('path');

const SCOPE_PREFIX = '@';
const SCOPE_NAME_SEPARATOR = '/';


export class NgPackage {

  constructor(
    private basePath: string,
    /** Contents of `ng-package.json` file. */
    public ngPackageJson: NgPackageConfig,
    /** Contents of `package.json` file. */
    public packageJson: any
  ) {
    if (!ngPackageJson.src) this.ngPackageJson.src = '.';
    if (!ngPackageJson.dest) this.ngPackageJson.dest = 'dist';
    if (!ngPackageJson.workingDirectory) this.ngPackageJson.workingDirectory = '.ng_build';
    if (ngPackageJson.lib) {
      if (!ngPackageJson.lib.entryFile) this.ngPackageJson.lib.entryFile = 'src/public_api.ts';
      //if (!ngPackageJson.lib.flatModuleFile) this.ngPackageJson.lib.flatModuleFile = 'index';
    }
  }

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
    return path.basename(this.ngPackageJson.lib.flatModuleFile || this.meta.name || 'index');
  }

  /** Package meta information */
  public get meta(): { name: string, scope?: string } {
    // split into name and scope (`@<scope>/<name>`)
    let scope: string, name: string = `${this.packageJson.name}`;
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
