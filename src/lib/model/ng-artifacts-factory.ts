import { pathExistsSync } from 'fs-extra';
import { path } from './../util/path';
import { NgArtifacts } from './ng-artifacts';
import { NgPackageData, SCOPE_NAME_SEPARATOR } from './ng-package-data';

export class NgArtifactsFactory {

  private _makeEsmPackageNameVal: string | undefined;
  private _makeEsmPackageName(ngPkg: NgPackageData): string {
    // The below is done in order to avoid same collisions in package name.
    if (this._makeEsmPackageNameVal) {
      return this._makeEsmPackageNameVal;
    }

    const { packageNameWithoutScope, flatModuleFileName, buildDirectory, pathOffsetFromSourceRoot } = ngPkg;

    if (packageNameWithoutScope === flatModuleFileName) {
      this._makeEsmPackageNameVal = `${flatModuleFileName}.js`;
    } else {
      const pathFromRoot = buildDirectory.replace(pathOffsetFromSourceRoot, '');
      const modulePath = path.join(pathFromRoot, 'esm2015', `${flatModuleFileName}.js`);
      const pkgName = pathExistsSync(modulePath) ? packageNameWithoutScope : flatModuleFileName;
      this._makeEsmPackageNameVal = `${pkgName}.js`;
    }

    return this._makeEsmPackageNameVal;
  }

  private _makeUmdPackageName(ngPkg: NgPackageData): string {
    return ngPkg.packageNameWithoutScope.replace(SCOPE_NAME_SEPARATOR, '-') + '.umd.js';
  }

  private _unixPathJoin(...paths: string[]): string {
    const joined = path.join(...paths);
    return path.ensureUnixPath(joined);
  }

  public calculateArtifactPathsForBuild(ngPkg: NgPackageData): NgArtifacts {
    const { buildDirectory, pathOffsetFromSourceRoot, flatModuleFileName } = ngPkg;
    const pathFromRoot = path.resolve(buildDirectory, pathOffsetFromSourceRoot);

    return {
      main: path.join(buildDirectory, 'bundles', this._makeUmdPackageName(ngPkg)),
      module: path.join(buildDirectory, 'esm5', this._makeEsmPackageName(ngPkg)),
      es2015: path.join(buildDirectory, 'esm2015', this._makeEsmPackageName(ngPkg)),
      typings: path.join(pathFromRoot, `${flatModuleFileName}.d.ts`),
      metadata: path.join(pathFromRoot, `${flatModuleFileName}.metadata.json`)
    }
  }

  public calculateArtifactPathsForPackageJson(ngPkg: NgPackageData): NgArtifacts {
    const { sourcePath, rootSourcePath, flatModuleFileName } = ngPkg;
    const rootPathFromSelf = path.relative(sourcePath, rootSourcePath);

    return {
      main: this._unixPathJoin(rootPathFromSelf, 'bundles', this._makeUmdPackageName(ngPkg)),
      module: this._unixPathJoin(rootPathFromSelf, 'esm5', this._makeEsmPackageName(ngPkg)),
      es2015: this._unixPathJoin(rootPathFromSelf, 'esm2015', this._makeEsmPackageName(ngPkg)),
      typings: path.ensureUnixPath(`${flatModuleFileName}.d.ts`),
      metadata: path.ensureUnixPath(`${flatModuleFileName}.metadata.json`)
    }
  }
}
