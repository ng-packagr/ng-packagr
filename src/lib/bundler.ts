import { NgEntrypoint, NgArtefacts, NgPackage } from './model/ng-package';
import { processAssets } from './steps/assets';
import { prepareTsConfig, ngc } from './steps/ngc';
import { remapSourcemap } from './steps/sorcery';
import { rollup } from './steps/rollup';
import { downlevelWithTsc } from './steps/tsc';
import { copyFiles } from './util/copy';
import { modifyJsonFiles } from './util/json';

/**
 * Main Angular bundling processing.
 *
 * @param entry A TypeScript source file (`*.ts`) of the bundle's entrypoint.
 * @param ngPkg Parent Angular package.
 * @returns Distribution-ready build artefacts.
 */
export const generateNgBundle = (entry: NgEntrypoint, ngPkg: NgPackage): Promise<NgArtefacts> => Promise.resolve()
  // 1. ASSETS
  .then(() => processAssets(ngPkg.src, `${ngPkg.workingDirectory}/ts`))
  // 2. NGC
  .then(() => prepareTsConfig(ngPkg, `${ngPkg.workingDirectory}/ts/tsconfig.lib.json`)
    .then((tsConfigFile: string) => ngc(tsConfigFile, `${ngPkg.workingDirectory}/ts`))
    .then((es2015EntryFile: string) =>
      // XX: see #46 - ngc only references to closure-annotated ES6 sources
      remapSourcemap(`${ngPkg.workingDirectory}/ts/${ngPkg.flatModuleFileName}.js`)
        .then(() => Promise.resolve(es2015EntryFile)))
  )
  // 3. FESM15: ROLLUP
  .then((es2015EntryFile: string) =>
    rollup({
      moduleName: ngPkg.meta.name,
      entry: es2015EntryFile,
      format: 'es',
      dest: `${ngPkg.workingDirectory}/${ngPkg.artefacts.es2015}`,
      externals: ngPkg.libExternals
    })
    // XX ... rollup generates relative paths in sourcemaps. It would be nice to re-locate source map files
    // so that `@scope/name/foo/bar.ts` shows up as path in the browser...
    .then(() => remapSourcemap(`${ngPkg.workingDirectory}/${ngPkg.artefacts.es2015}`))
  )
  // 4. FESM5: TSC
  .then(() =>
    downlevelWithTsc(
      `${ngPkg.workingDirectory}/${ngPkg.artefacts.es2015}`,
      `${ngPkg.workingDirectory}/${ngPkg.artefacts.module}`)
    .then(() => remapSourcemap(`${ngPkg.workingDirectory}/${ngPkg.artefacts.module}`))
  )
  // 5. UMD: ROLLUP
  .then(() =>
    rollup({
      moduleName: ngPkg.meta.name,
      entry: `${ngPkg.workingDirectory}/${ngPkg.artefacts.module}`,
      format: 'umd',
      dest: `${ngPkg.workingDirectory}/${ngPkg.artefacts.main}`,
      externals: ngPkg.libExternals
    })
    .then(() => remapSourcemap(`${ngPkg.workingDirectory}/${ngPkg.artefacts.main}`))
  )
  // 6. COPY FILES
  .then(() => copyFiles(`${ngPkg.workingDirectory}/${ngPkg.meta.scope}/**/*.{js,js.map}`, `${ngPkg.dest}/${ngPkg.meta.scope}`))
  .then(() => copyFiles(`${ngPkg.workingDirectory}/bundles/**/*.{js,js.map}`, `${ngPkg.dest}/bundles`))
  .then(() => copyFiles(`${ngPkg.workingDirectory}/ts/**/*.{d.ts,metadata.json}`, `${ngPkg.dest}`))
  // 7. SOURCEMAPS: RELOCATE PATHS
  // XX ... modifyJsonFiles() should maybe called 'relocateSourceMaps()' in 'steps' folder
  .then(() => modifyJsonFiles(`${ngPkg.dest}/**/*.js.map`, (sourceMap: any): any => {
    sourceMap['sources'] = sourceMap['sources']
      .map((path: string): string => path.replace('../ts',
        ngPkg.meta.scope ? `~/${ngPkg.meta.scope}/${ngPkg.meta.name}` : `~/${ngPkg.meta.name}`));

    return sourceMap;
  }))
  // 8. COLLECT GENERATED ARTEFACTS
  .then(() => {

    return ngPkg.artefacts;
    /*
    return {
      main: '',
      module: '',
      es2015: '',
      typings: '',
      metadata: ''
    };
    */
  });
