import { NgPackageData } from './model/ng-package-data';
import { NgArtifacts } from './model/ng-artifacts';
import { NgArtifactsFactory } from './model/ng-artifacts-factory';
import { writePackage } from './steps/package';
import { processAssets } from './steps/assets';
import { ngc } from './steps/ngc';
import { remapSourcemap, relocateSourcemapRoot } from './steps/sorcery';
import { rollup } from './steps/rollup';
import { downlevelWithTsc } from './steps/tsc';
import { copySourceFilesToDestination } from './steps/transfer';
import { rimraf } from './util/rimraf';
import * as log from './util/log';

/**
 * Main Angular bundling processing.
 *
 * @param ngPkg Parent Angular package.
 */
export async function generateNgBundle(ngPkg: NgPackageData): Promise<void> {

  log.info(`Generating bundle for ${ngPkg.fullPackageName}`);
  const artifactFactory: NgArtifactsFactory = new NgArtifactsFactory();
  const baseBuildPath: string = `${ngPkg.buildDirectory}/ts${ngPkg.pathOffsetFromSourceRoot}`;
  const artifactPaths: NgArtifacts = artifactFactory.calculateArtifactPathsForBuild(ngPkg);

  // 0. CLEAN BUILD DIRECTORY
  await rimraf(ngPkg.buildDirectory);

  // 1. ASSETS
  await processAssets(ngPkg.sourcePath, baseBuildPath);

  // 2. NGC
  const es2015EntryFile: string = await ngc(ngPkg, baseBuildPath);
  // XX: see #46 - ngc only references to closure-annotated ES6 sources
  await remapSourcemap(`${baseBuildPath}/${ngPkg.flatModuleFileName}.js`);

  // 3. FESM15: ROLLUP
  await rollup({
    moduleName: ngPkg.packageNameWithoutScope,
    entry: es2015EntryFile,
    format: 'es',
    dest: artifactPaths.es2015,
    externals: ngPkg.libExternals
  });
  await remapSourcemap(artifactPaths.es2015);

  // 4. FESM5: TSC
  await downlevelWithTsc(
    artifactPaths.es2015,
    artifactPaths.module);
  await remapSourcemap(artifactPaths.module);

  // 5. UMD: ROLLUP
  await rollup({
    moduleName: ngPkg.packageNameWithoutScope,
    entry: artifactPaths.module,
    format: 'umd',
    dest: artifactPaths.main,
    externals: ngPkg.libExternals
  });
  await remapSourcemap(artifactPaths.main);

  // 6. SOURCEMAPS: RELOCATE ROOT PATHS
  await relocateSourcemapRoot(ngPkg);

  // 7. COPY SOURCE FILES TO DESTINATION
  await copySourceFilesToDestination(ngPkg, baseBuildPath);

  // 8. WRITE PACKAGE.JSON and OTHER DOC FILES
  const packageJsonArtifactPaths: NgArtifacts = artifactFactory.calculateArtifactPathsForPackageJson(ngPkg);
  await writePackage(ngPkg, packageJsonArtifactPaths);

  log.success(`Built Angular bundle for ${ngPkg.fullPackageName}`);
}
