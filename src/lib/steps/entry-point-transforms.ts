import * as path from 'path';
import { InjectionToken, FactoryProvider } from 'injection-js';
import { NgArtefacts } from '../ng-package-format/artefacts';
import { NgEntryPoint } from '../ng-package-format/entry-point';
import { NgPackage } from '../ng-package-format/package';
import { BuildStep } from '../deprecations';
import { writePackage } from '../steps/package';
import { processAssets } from '../steps/assets';
import { ngc, extractTemplateAndStylesheetFiles, inlineTemplatesAndStyles } from '../steps/ngc';
import { FlattenOpts, writeFlatBundleFiles } from '../flatten/flatten';
import { relocateSourceMaps } from '../sourcemaps/relocate';
import { copySourceFilesToDestination } from '../steps/transfer';
import * as log from '../util/log';
import { ensureUnixPath } from '../util/path';
import { rimraf } from '../util/rimraf';
import { INIT_TS_CONFIG_TOKEN } from '../ts/init-tsconfig';

/**
 * Transforms TypeScript source files to Angular Package Format.
 *
 * @param entryPoint The entry point that will be transpiled to a set of artefacts.
 */
export function transformSourcesFactory(prepareTsConfig: BuildStep) {
  return async (args): Promise<void> => {
    const { artefacts, entryPoint, pkg } = args;
    log.info(`Building from sources for entry point '${entryPoint.moduleId}'`);

    // 0. CLEAN BUILD DIRECTORY
    log.info('Cleaning build directory');
    await rimraf(artefacts.outDir);
    await rimraf(artefacts.stageDir);

    // 1. TWO-PASS TSC TRANSFORMATION
    prepareTsConfig(args);

    // First pass: collect templateUrl and styleUrls referencing source files.
    log.info('Extracting templateUrl and styleUrls');
    extractTemplateAndStylesheetFiles(args);

    // Then, process assets keeping transformed contents in memory.
    log.info('Processing assets');
    await processAssets(args);

    // Second pass: inline templateUrl and styleUrls
    log.info('Inlining templateUrl and styleUrls');
    inlineTemplatesAndStyles(args);

    // 2. NGC
    log.info('Compiling with ngc');
    const tsOutput = await ngc(entryPoint, artefacts);
    artefacts.es2015EntryFile = tsOutput.js;
    artefacts.typingsEntryFile = tsOutput.typings;
    artefacts.aotBundleFile = tsOutput.metadata;

    // 3. FESM15, FESM5, UMD, Minified UMD
    log.info('Writing flat bundle files');
    await writeFlatBundleFiles({
      entryFile: artefacts.es2015EntryFile,
      outDir: artefacts.stageDir,
      flatModuleFile: entryPoint.flatModuleFile,
      esmModuleId: entryPoint.moduleId,
      umdModuleId: entryPoint.umdModuleId,
      embedded: entryPoint.embedded,
      umdModuleIds: entryPoint.umdModuleIds
    });

    // 4. SOURCEMAPS: RELOCATE ROOT PATHS
    log.info('Remapping source maps');
    await relocateSourceMaps(`${artefacts.stageDir}/+(bundles|esm2015|esm5)/**/*.js.map`, path => {
      let trimmedPath = path;
      // Trim leading '../' path separators
      while (trimmedPath.startsWith('../')) {
        trimmedPath = trimmedPath.substring(3);
      }

      return `ng://${entryPoint.moduleId}/${trimmedPath}`;
    });

    // 5. COPY SOURCE FILES TO DESTINATION
    log.info('Copying staged files');
    // TODO: doesn't work any more
    await copySourceFilesToDestination({ artefacts, entryPoint, pkg });

    // 6. WRITE PACKAGE.JSON
    log.info('Writing package metadata');
    const relativeDestPath: string = path.relative(entryPoint.destinationPath, pkg.primary.destinationPath);
    await writePackage(entryPoint, {
      main: ensureUnixPath(path.join(relativeDestPath, 'bundles', entryPoint.flatModuleFile + '.umd.js')),
      module: ensureUnixPath(path.join(relativeDestPath, 'esm5', entryPoint.flatModuleFile + '.js')),
      es2015: ensureUnixPath(path.join(relativeDestPath, 'esm2015', entryPoint.flatModuleFile + '.js')),
      typings: ensureUnixPath(`${entryPoint.flatModuleFile}.d.ts`),
      // XX 'metadata' property in 'package.json' is non-standard. Keep it anyway?
      metadata: ensureUnixPath(`${entryPoint.flatModuleFile}.metadata.json`)
    });

    log.success(`Built ${entryPoint.moduleId}`);
  };
}

export const ENTRY_POINT_TRANSFORMS_TOKEN = new InjectionToken<BuildStep>('ng.v5.entryPointTransforms');

export const ENTRY_POINT_TRANSFORMS_PROVIDER: FactoryProvider = {
  provide: ENTRY_POINT_TRANSFORMS_TOKEN,
  useFactory: transformSourcesFactory,
  deps: [INIT_TS_CONFIG_TOKEN]
};
