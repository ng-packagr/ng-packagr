import { pipeFromArray } from 'rxjs/util/pipe';
import { STATE_DONE } from '../brocc/node';
import { isInProgress } from '../brocc/select';
import { Transform, transformFromPromise } from '../brocc/transform';
import * as log from '../util/log';
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
 *  - renderTemplates
 *  - renderStylesheets
 *  - transformTsSources (thereby inlining template and stylesheet data)
 *  - compileTs
 *  - downlevelTs
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
 * @param renderTemplates Transformation rendering HTML templates.
 * @param renderStylesheets Transformation rendering xCSS stylesheets.
 * @param transformTsSources Transformation manipulating the typescript source files (thus inlining template and stylesheet data).
 * @param compileTs Transformation compiling typescript sources to ES2015 modules.
 * @param downlevelTs Transformation downlevel compilation from ES2015 TO ESM5.
 * @param writeBundles Transformation flattening ES2015 modules to ESM2015, ESM5, UMD, and minified UMD.
 * @param remapSourceMaps Transformation re-mapping of sourcemaps over a series of transpilations.
 * @param relocateSourceMaps Transformation re-locating (adapting) paths in the source maps.
 * @param writePackage Transformation writing a distribution-ready `package.json` (for publishing to npm registry).
 */
export const entryPointTransformFactory = (
  renderStylesheets: Transform,
  renderTemplates: Transform,
  transformTsSources: Transform,
  compileTs: Transform,
  downlevelTs: Transform,
  writeBundles: Transform,
  remapSourceMaps: Transform,
  relocateSourceMaps: Transform,
  writePackage: Transform
): Transform =>
  pipeFromArray([
    //tap(() => log.info(`Building from sources for entry point`)),

    transformFromPromise(async graph => {
      // Peek the first entry point from the graph
      const entryPoint = graph.find(byEntryPoint().and(isInProgress));
      log.info(`Building entry point '${entryPoint.data.entryPoint.moduleId}'`);
    }),
    // Stylesheet and template rendering
    renderStylesheets,
    renderTemplates,
    // Inlining of stylesheets and templates
    transformTsSources,
    // TypeScript sources compilation
    compileTs,
    // Downlevel es2015 to es5
    downlevelTs,
    // After TypeScript: bundling and write package
    writeBundles,
    remapSourceMaps,
    relocateSourceMaps,
    writePackage,

    transformFromPromise(async graph => {
      const entryPoint = graph.find(byEntryPoint().and(isInProgress));
      entryPoint.state = STATE_DONE;
    })

    //tap(() => log.info(`Built.`))
  ]);
