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
    const { buildDirectory, pathOffsetFromSourceRoot, flatModuleFileName } = ngPkg;
    const pathFromRoot: string = path.resolve(buildDirectory, pathOffsetFromSourceRoot);

    return {
      main: path.join(buildDirectory, 'bundles', this._makeUmdPackageName(ngPkg)),
      module: path.join(buildDirectory, 'esm5', `${flatModuleFileName}.js`),
      es2015: path.join(buildDirectory, 'esm2015', `${flatModuleFileName}.js`),
      typings: path.join(pathFromRoot, `${flatModuleFileName}.d.ts`),
      metadata: path.join(pathFromRoot, `${flatModuleFileName}.metadata.json`)
    }
  }

  public calculateArtifactPathsForPackageJson(ngPkg: NgPackageData): NgArtifacts {
    const { sourcePath, rootSourcePath, flatModuleFileName } = ngPkg;
    const rootPathFromSelf: string = path.relative(sourcePath, rootSourcePath);

    return {
      main: this._unixPathJoin(rootPathFromSelf, 'bundles', this._makeUmdPackageName(ngPkg)),
      module: this._unixPathJoin(rootPathFromSelf, 'esm5', `${flatModuleFileName}.js`),
      es2015: this._unixPathJoin(rootPathFromSelf, 'esm2015', `${flatModuleFileName}.js`),
      typings: path.ensureUnixPath(`${flatModuleFileName}.d.ts`),
      metadata: path.ensureUnixPath(`${flatModuleFileName}.metadata.json`)
    }
  }
}
