import { pipe, tap } from 'rxjs';
import { STATE_DONE } from '../../graph/node';
import { Transform } from '../../graph/transform';
import * as log from '../../utils/log';
import { isEntryPointInProgress } from '../nodes';

/**
 * A re-write of the `transformSources()` script that transforms an entry point from sources to distributable format.
 *
 * Sources are TypeScript source files accompanied by HTML templates and xCSS stylesheets.
 * See the Angular Package Format for a detailed description of what the distributables include.
 *
 * The current transformation pipeline can be thought of as:
 *
 *  - clean
 *  - compileTs
 *  - downlevelTs
 *  - writeBundles
 *    - bundleToFesm15
 *  - relocateSourceMaps
 *  - writePackage
 *   - copyStagedFiles (bundles, esm, dts, sourcemaps)
 *   - writePackageJson
 *
 * The transformation pipeline is pluggable through the dependency injection system.
 * Sub-transformations are passed to this factory function as arguments.
 *
 * @param compileTs Transformation compiling typescript sources to ES2022 modules.
 * @param writeBundles Transformation flattening ES2022 modules to ESM2022, UMD, and minified UMD.
 * @param writePackage Transformation writing a distribution-ready `package.json` (for publishing to npm registry).
 */
export const entryPointTransformFactory = (
  compileTs: Transform,
  writeBundles: Transform,
  writePackage: Transform,
): Transform =>
  pipe(
    tap(graph => {
      // Peek the first entry point from the graph
      const entryPoint = graph.find(isEntryPointInProgress());
      log.msg('\n------------------------------------------------------------------------------');
      log.msg(`Building entry point '${entryPoint.data.entryPoint.moduleId}'`);
      log.msg('------------------------------------------------------------------------------');
    }),
    // TypeScript sources compilation
    compileTs,
    // After TypeScript: bundling and write package
    writeBundles,
    writePackage,
    tap(graph => {
      const entryPoint = graph.find(isEntryPointInProgress());
      entryPoint.state = STATE_DONE;
    }),
  );
