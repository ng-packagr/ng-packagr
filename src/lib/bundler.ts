import * as path from 'path';
import { NgArtefacts } from './domain/ng-artefacts';
import { NgPackageData } from './model/ng-package-data';
import { writePackage } from './steps/package';
import { processAssets } from './steps/assets';
import { ngc, prepareTsConfig, collectTemplateAndStylesheetFiles, inlineTemplatesAndStyles } from './steps/ngc';
import { minifyJsFile } from './steps/uglify';
import { remapSourceMap, relocateSourceMapSources } from './steps/sorcery';
import { rollup } from './steps/rollup';
import { downlevelWithTsc } from './steps/tsc';
import { copySourceFilesToDestination } from './steps/transfer';
import * as log from './util/log';
import { ensureUnixPath } from './util/path';
import { rimraf } from './util/rimraf';

/**
 * Transforms TypeScript source files to Angular Package Format.
 *
 * @param ngPkg Parent Angular package.
 */
export async function transformSources(ngPkg: NgPackageData): Promise<void> {
  log.info(`Building from sources for entry point '${ngPkg.fullPackageName}'`);
  const artefacts = new NgArtefacts(ngPkg);

  // 0. CLEAN BUILD DIRECTORY
  log.info('Cleaning build directory');
  await rimraf(ngPkg.buildDirectory);

  // 0. TWO-PASS TSC TRANSFORMATION
  artefacts.tsConfig = prepareTsConfig(ngPkg);

  // First pass: collect templateUrl and styleUrls referencing source files.
  log.info('Extracting templateUrl and styleUrls');
  const result = collectTemplateAndStylesheetFiles(artefacts.tsConfig, artefacts);
  result.dispose();

  // Then, process assets keeping transformed contents in memory.
  log.info('Processing assets');
  await processAssets(artefacts, ngPkg);

  // Second pass: inline templateUrl and styleUrls
  log.info('Inlining templateUrl and styleUrls');
  artefacts.tsSources = inlineTemplatesAndStyles(artefacts.tsConfig, artefacts);

  // 1. NGC
  log.info('Compiling with ngc');
  const tsOutput = await ngc(ngPkg, artefacts.tsSources, artefacts.tsConfig);
  artefacts.tsSources.dispose();

  // await remapSourceMap(tsOutput.js);

  // 3. FESM15: ROLLUP
  log.info('Bundling to FESM15');
  const fesm15File = path.resolve(ngPkg.buildDirectory, 'esm2015', ngPkg.esmPackageName);
  await rollup({
    moduleName: ngPkg.moduleName,
    entry: tsOutput.js,
    format: 'es',
    dest: fesm15File,
    externals: ngPkg.libExternals
  });
  await remapSourceMap(fesm15File);

  // 4. FESM5: TSC
  log.info('Bundling to FESM5');
  const fesm5File = path.resolve(ngPkg.buildDirectory, 'esm5', ngPkg.esmPackageName);
  await downlevelWithTsc(fesm15File, fesm5File);
  await remapSourceMap(fesm5File);

  // 5. UMD: ROLLUP
  log.info('Bundling to UMD');
  const umdFile = path.resolve(ngPkg.buildDirectory, 'bundles', ngPkg.umdPackageName);
  await rollup({
    moduleName: ngPkg.moduleName,
    entry: fesm5File,
    format: 'umd',
    dest: umdFile,
    externals: ngPkg.libExternals
  });
  await remapSourceMap(umdFile);

  // 6. UMD: Minify
  log.info('Minifying UMD bundle');
  const minUmdFile: string = await minifyJsFile(umdFile);
  await remapSourceMap(minUmdFile);

  // 7. SOURCEMAPS: RELOCATE ROOT PATHS
  log.info('Remapping source maps');
  await relocateSourceMapSources(ngPkg);

  // 8. COPY SOURCE FILES TO DESTINATION
  log.info('Copying staged files');
  await copySourceFilesToDestination(ngPkg);

  // 9. WRITE PACKAGE.JSON
  log.info('Writing package metadata');
  const rootPathFromSelf: string = path.relative(ngPkg.sourcePath, ngPkg.rootSourcePath);
  await writePackage(ngPkg, {
    main: ensureUnixPath(path.join(rootPathFromSelf, 'bundles', ngPkg.umdPackageName)),
    module: ensureUnixPath(path.join(rootPathFromSelf, 'esm5', ngPkg.esmPackageName)),
    es2015: ensureUnixPath(path.join(rootPathFromSelf, 'esm2015', ngPkg.esmPackageName)),
    typings: ensureUnixPath(`${ngPkg.flatModuleFileName}.d.ts`),
    metadata: ensureUnixPath(`${ngPkg.flatModuleFileName}.metadata.json`)
  });

  log.success(`Built ${ngPkg.fullPackageName}`);
}
