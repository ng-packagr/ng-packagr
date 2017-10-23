import { path } from './../util/path';
import { NgArtifacts } from './ng-artifacts';
import { NgPackageData, SCOPE_NAME_SEPARATOR } from './ng-package-data';

export class NgArtifactsFactory {
  private _makeUmdPackageName(ngPkg: NgPackageData): string {
    return ngPkg.packageNameWithoutScope.replace(SCOPE_NAME_SEPARATOR, '-') + '.umd.js';
  }

  private _unixPathJoin(...paths: string[]): string {
    const joined: string = path.join(...paths);
    return path.ensureUnixPath(joined);
  }

  public calculateArtifactPathsForBuild(ngPkg: NgPackageData): NgArtifacts {
    const pathFromRoot: string = path.resolve(ngPkg.buildDirectory, ngPkg.pathOffsetFromSourceRoot);

    return {
      main: path.join(ngPkg.buildDirectory,'bundles', this._makeUmdPackageName(ngPkg)),
      module: path.join(ngPkg.buildDirectory, ngPkg.fullPackageName + '.es5.js'),
      es2015: path.join(ngPkg.buildDirectory, ngPkg.fullPackageName + '.js'),
      typings: path.join(pathFromRoot, ngPkg.flatModuleFileName + '.d.ts'),
      metadata: path.join(pathFromRoot, ngPkg.flatModuleFileName + '.metadata.json')
    }
  }

  public calculateArtifactPathsForPackageJson(ngPkg: NgPackageData): NgArtifacts {
    const rootPathFromSelf: string = path.relative(ngPkg.sourcePath, ngPkg.rootSourcePath);

    return {
      main: this._unixPathJoin(rootPathFromSelf, 'bundles', this._makeUmdPackageName(ngPkg)),
      module: this._unixPathJoin(rootPathFromSelf, `${ngPkg.fullPackageName}.es5.js`),
      es2015: this._unixPathJoin(rootPathFromSelf, `${ngPkg.fullPackageName}.js`),
      typings: path.ensureUnixPath(`${ngPkg.flatModuleFileName}.d.ts`),
      metadata: path.ensureUnixPath(`${ngPkg.flatModuleFileName}.metadata.json`)
    }
  }
}
