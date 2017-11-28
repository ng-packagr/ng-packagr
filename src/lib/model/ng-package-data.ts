import * as path from 'path';
import { NgPackageConfig } from '../../ng-package.schema';
import { ensureUnixPath } from '../util/path';

export const SCOPE_PREFIX = '@';
export const SCOPE_NAME_SEPARATOR = '/';
export const DEFAULT_BUILD_FOLDER = '.ng_pkg_build';

// TODO: this is obviously stuff derived from 'ng-package.json'
// TODO: use @ngtools/json-schema to parse the JSON configuration
export class NgPackageData {
  public readonly pathOffsetFromSourceRoot: string;
  public readonly fullPackageName: string;
  public readonly packageNameWithoutScope: string;
  public readonly moduleName: string;
  public readonly scope?: string;
  public readonly flatModuleFileName: string;
  public readonly entryFile: string;
  /** Destination path for `package.json` (either equal to rootDestinationPath or sub-path for secondaries) */
  public readonly destinationPath: string;
  public readonly buildDirectory: string;
  public readonly libExternals: any;
  public readonly jsxConfig?: string;

  constructor(
    /**
     * Source path of the root package (equivalent to the `src` field configured in the root ng-package.json).
     */
    public readonly rootSourcePath: string,
    rootPackageName: string,
    /**
     * Destination path of the root package (equivalent to the `dest` field configured in the root ng-package.json).
     */
    public readonly rootDestinationPath: string,
    /**
     * Source path of the current package (equivalent to a sub folder of the `src` field configured in the root ng-package.json).
     */
    public readonly sourcePath: string,
    ngPackageConfig: NgPackageConfig,
    public readonly isSecondary: boolean = false
  ) {
    this.pathOffsetFromSourceRoot = this.sourcePath.substring(rootSourcePath.length);
    // destination path of secondary modules is not configurable - this is to meet the Angular package format.
    this.destinationPath = rootDestinationPath + this.pathOffsetFromSourceRoot;
    this.fullPackageName = ensureUnixPath(rootPackageName + this.pathOffsetFromSourceRoot);
    this.moduleName = this.fullPackageName.replace(SCOPE_PREFIX, '').split(SCOPE_NAME_SEPARATOR).join('.');

    if (this.fullPackageName.startsWith(SCOPE_PREFIX)) {
      const firstSeparatorIndex: number = this.fullPackageName.indexOf(SCOPE_NAME_SEPARATOR);
      if (firstSeparatorIndex > -1) { // if there is no scope name separator
        this.scope = this.fullPackageName.substring(0, firstSeparatorIndex);
        this.packageNameWithoutScope = this.fullPackageName.substring(firstSeparatorIndex + 1);
      }
    }

    if (!this.packageNameWithoutScope) { // no scope was detected
      this.packageNameWithoutScope = this.fullPackageName;
    }

    if (ngPackageConfig.lib) {
      this.libExternals = ngPackageConfig.lib.externals;
      this.flatModuleFileName = ngPackageConfig.lib.flatModuleFile;
      this.entryFile = ngPackageConfig.lib.entryFile;
      this.jsxConfig = ngPackageConfig.lib.jsx;
    }

    if (!this.libExternals) {
      this.libExternals = {};
    }
    if (!this.flatModuleFileName) {
      this.flatModuleFileName = path.basename(this.fullPackageName);
    }
    if (!this.entryFile) {
      this.entryFile = 'public_api.ts';
    }

    // Each entry point gets its own unique build directory based upon the package name.
    const packageBuildFolderName: string = this.fullPackageName.replace(SCOPE_NAME_SEPARATOR, '-');
    this.buildDirectory = path.resolve(this.rootSourcePath, DEFAULT_BUILD_FOLDER, packageBuildFolderName);
  }

  /**  */
  get umdPackageName(): string {
    return this.packageNameWithoutScope.replace(SCOPE_NAME_SEPARATOR, '-') + '.umd.js';
  }

  get esmPackageName(): string {
    return this.packageNameWithoutScope + '.js';
  }

  private _unixPathJoin(...paths: string[]): string {
    const joined: string = path.join(...paths);
    return ensureUnixPath(joined);
  }

}
