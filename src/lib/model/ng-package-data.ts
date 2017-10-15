import { NgPackageConfig } from '../../ng-package.schema';
import * as path from 'path';

export const SCOPE_PREFIX = '@';
export const SCOPE_NAME_SEPARATOR = '/';
export const DEFAULT_BUILD_FOLDER = '.ng_pkg_build';

export class NgPackageData {
  public readonly pathOffsetFromSourceRoot: string;
  public readonly fullPackageName: string;
  public readonly packageNameWithoutScope: string;
  public readonly scope?: string;
  public readonly flatModuleFileName: string;
  public readonly entryFile: string;
  public readonly destinationPath: string;
  public readonly buildDirectory: string;
  public readonly libExternals: any;

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
    ngPackageConfig: NgPackageConfig
  ) {
    this.pathOffsetFromSourceRoot = this.sourcePath.substring(rootSourcePath.length);
    // destination path of secondary modules is not configurable - this is to meet the Angular package format.
    this.destinationPath = rootDestinationPath + this.pathOffsetFromSourceRoot;
    this.fullPackageName = rootPackageName + this.pathOffsetFromSourceRoot.replace('\\', SCOPE_NAME_SEPARATOR);

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

    // Each entry point gets it's own unique build directory based upon the package name.
    const packageBuildFolderName: string = this.fullPackageName.replace(SCOPE_NAME_SEPARATOR, '-');
    this.buildDirectory = path.resolve(this.rootSourcePath, DEFAULT_BUILD_FOLDER, packageBuildFolderName);
  }
}

