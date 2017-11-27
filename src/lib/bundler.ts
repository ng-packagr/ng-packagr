import { NgPackageData } from './model/ng-package-data';
import { NgArtifacts } from './model/ng-artifacts';
import { NgArtifactsFactory } from './model/ng-artifacts-factory';
import { writePackage } from './steps/package';
import { processAssets } from './steps/assets';
import { ngc } from './steps/ngc';
import { minifyJsFile } from './steps/uglify';
import { remapSourceMap, relocateSourceMapRoot } from './steps/sorcery';
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
  const artifactFactory = new NgArtifactsFactory();
  const baseBuildPath = `${ngPkg.buildDirectory}/ts${ngPkg.pathOffsetFromSourceRoot}`;
  const artifactPaths = artifactFactory.calculateArtifactPathsForBuild(ngPkg);

  // 0. CLEAN BUILD DIRECTORY
  log.info('Cleaning bundle build directory');
  await rimraf(ngPkg.buildDirectory);

  // 1. ASSETS
  log.info('Processing assets');
  await processAssets(ngPkg.sourcePath, baseBuildPath);

  // 2. NGC
  log.info('Running ngc');
  const es2015EntryFile = await ngc(ngPkg, baseBuildPath);
  // XX: see #46 - ngc only references to closure-annotated ES6 sources
  await remapSourceMap(es2015EntryFile);

  // 3. FESM15: ROLLUP
  log.info('Compiling to FESM15');
  await rollup({
    moduleName: ngPkg.moduleName,
    entry: es2015EntryFile,
    format: 'es',
    dest: artifactPaths.es2015,
    externals: ngPkg.libExternals
  });
  await remapSourceMap(artifactPaths.es2015);

  // 4. FESM5: TSC
  log.info('Compiling to FESM5');
  await downlevelWithTsc(
    artifactPaths.es2015,
    artifactPaths.module);
  await remapSourceMap(artifactPaths.module);

  // 5. UMD: ROLLUP
  log.info('Compiling to UMD');
  await rollup({
    moduleName: ngPkg.moduleName,
    entry: artifactPaths.module,
    format: 'umd',
    dest: artifactPaths.main,
    externals: ngPkg.libExternals
  });
  await remapSourceMap(artifactPaths.main);

  // 6. UMD: Minify
  log.info('Minifying UMD bundle');
  const minifiedFilePath = await minifyJsFile(artifactPaths.main);
  await remapSourceMap(minifiedFilePath);

  // 7. SOURCEMAPS: RELOCATE ROOT PATHS
  log.info('Remapping source maps');
  await relocateSourceMapRoot(ngPkg);

  // 8. COPY SOURCE FILES TO DESTINATION
  log.info('Copying staged files');
  await copySourceFilesToDestination(ngPkg, baseBuildPath);

  // 9. WRITE PACKAGE.JSON and OTHER DOC FILES
  log.info('Writing package metadata');
  const packageJsonArtifactPaths = artifactFactory.calculateArtifactPathsForPackageJson(ngPkg);
  await writePackage(ngPkg, packageJsonArtifactPaths);

  log.success(`Built Angular bundle for ${ngPkg.fullPackageName}`);
}
