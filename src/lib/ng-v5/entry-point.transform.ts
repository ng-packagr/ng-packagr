import { InjectionToken, FactoryProvider, ValueProvider } from 'injection-js';
import { Observable } from 'rxjs/Observable';
import { of as observableOf } from 'rxjs/observable/of';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { map, switchMap, tap } from 'rxjs/operators';
import { pipe } from 'rxjs/util/pipe';
import { BuildGraph } from '../brocc/build-graph';
import { Node, STATE_IN_PROGESS, STATE_DONE } from '../brocc/node';
import { isDirty, isInProgress } from '../brocc/select';
import { Transform, transformFromPromise } from '../brocc/transform';
import * as log from '../util/log';
import { rimraf } from '../util/rimraf';
import { byEntryPoint } from './nodes';

/**
 * A re-write of the `transformSources()` script that transforms an entry point from sources to distributable format.
 *
 * Sources are TypeScript source files accompanied by HTML templates and xCSS stylesheets.
 * See the Angular Package Format for a detailed description of what the distributables include.
 *
 * The current transformation pipeline can be thought of as:
 *
 *  - clean
 *  - initTsConfig
 *  - analyzeTsSources (thereby extracting template and stylesheet files)
 *  - renderTemplates
 *  - renderStylesheets
 *  - transformTsSources (thereby inlining template and stylesheet data)
 *  - compileTs
 *  - writeBundles
 *    - bundleToFesm15
 *    - bundleToFesm5
 *    - bundleToUmd
 *    - bundleToUmdMin
 *  - relocateSourceMaps
 *  - writePackage
 *   - copyStagedFiles (bundles, esm, dts, metadata, sourcemaps)
 *   - writePackageJson
 *
 * The transformation pipeline is pluggable through the dependency injection system.
 * Sub-transformations are passed to this factory function as arguments.
 *
 * @param initTsConfig Transformation initializing the tsconfig of the entry point.
 * @param analyzeTsSources Transformation analyzing the typescript source files of the entry point.
 * @param renderTemplates Transformation rendering HTML templates.
 * @param renderStylesheets Transformation rendering xCSS stylesheets.
 * @param transformTsSources Transformation manipulating the typescript source files (thus inlining template and stylesheet data).
 * @param compileTs Transformation compiling typescript sources to ES2015 modules.
 * @param writeBundles Transformation flattening ES2015 modules to ESM2015, ESM5, UMD, and minified UMD.
 * @param relocateSourceMaps Transformation re-locating (adapting) paths in the source maps.
 * @param writePackage Transformation writing a distribution-ready `package.json` (for publishing to npm registry).
 */
export const entryPointTransformFactory = (
  initTsConfig: Transform,
  analyzeTsSources: Transform,
  renderStylesheets: Transform,
  renderTemplates: Transform,
  transformTsSources: Transform,
  compileTs: Transform,
  writeBundles: Transform,
  relocateSourceMaps: Transform,
  writePackage: Transform
): Transform =>
  pipe(
    //tap(() => log.info(`Building from sources for entry point`)),

    transformFromPromise(async graph => {
      // Peek the first entry point from the graph
      const entryPoint = graph.find(byEntryPoint().and(isDirty));

      // Mark the entry point as 'in-progress'
      entryPoint.state = STATE_IN_PROGESS;
      log.info(`Building entry point '${entryPoint.data.entryPoint.moduleId}'`);

      // Clean build directory
      await clean(entryPoint.data.stageDir, entryPoint.data.outDir);
    }),
    // TypeScript sources compilation
    initTsConfig,
    analyzeTsSources,
    renderStylesheets,
    renderTemplates,
    transformTsSources,
    compileTs,
    // After TypeScript: bundling and write package
    pipe(writeBundles, relocateSourceMaps, writePackage),

    transformFromPromise(async graph => {
      const entryPoint = graph.find(byEntryPoint().and(isInProgress));
      entryPoint.state = STATE_DONE;
    })

    //tap(() => log.info(`Built.`))
  );

async function clean(...paths: string[]) {
  log.info('Cleaning build directory');
  for (let path of paths) {
    await rimraf(path);
  }
}
