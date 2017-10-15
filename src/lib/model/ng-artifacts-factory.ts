import * as path from "path";
import {NgArtifacts} from "./ng-artifacts";
import {NgPackageData, SCOPE_NAME_SEPARATOR} from "./ng-package-data";

export class NgArtifactsFactory {
  private _makeUmdPackageName(ngPkg: NgPackageData): string {
    return ngPkg.packageNameWithoutScope.replace(SCOPE_NAME_SEPARATOR, '-');
  }

  private _unixPathJoin(...paths: string[]): string {
    return path.join(...paths).replace('\\', '/');
  }

  public calculateArtifactPathsForBuild(ngPkg: NgPackageData): NgArtifacts {
    const pathFromRoot: string = path.resolve(ngPkg.buildDirectory, ngPkg.pathOffsetFromSourceRoot);

    return {
      main: `${ngPkg.buildDirectory}/bundles/${this._makeUmdPackageName(ngPkg)}.umd.js`,
      module: `${ngPkg.buildDirectory}/${ngPkg.fullPackageName}.es5.js`,
      es2015: `${ngPkg.buildDirectory}/${ngPkg.fullPackageName}.js`,
      typings: `${pathFromRoot}/${ngPkg.flatModuleFileName}.d.ts`,
      metadata: `${pathFromRoot}/${ngPkg.flatModuleFileName}.metadata.json`
    }
  }

  public calculateArtifactPathsForPackageJson(ngPkg: NgPackageData): NgArtifacts {
    const rootPathFromSelf: string = path.relative(ngPkg.sourcePath, ngPkg.rootSourcePath);

    return {
      main: this._unixPathJoin(rootPathFromSelf, 'bundles', `${this._makeUmdPackageName(ngPkg)}.umd.js`),
      module: this._unixPathJoin(rootPathFromSelf, `${ngPkg.fullPackageName}.es5.js`),
      es2015: this._unixPathJoin(rootPathFromSelf, `${ngPkg.fullPackageName}.js`),
      typings: `${ngPkg.flatModuleFileName}.d.ts`,
      metadata: `${ngPkg.flatModuleFileName}.metadata.json`
    }
  }
}
