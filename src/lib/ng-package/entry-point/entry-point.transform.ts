import { pipe } from 'rxjs';
import { EntryPointTransform, transformEntryPointFromPromise } from '../../graph/entry-point-transform';
import { STATE_DONE } from '../../graph/node';
import * as log from '../../utils/log';

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
  compileTs: EntryPointTransform,
  writeBundles: EntryPointTransform,
  writePackage: EntryPointTransform,
): EntryPointTransform =>
  pipe(
    // tap(() => log.info(`Building from sources for entry point`)),

    transformEntryPointFromPromise(async entryPoint => {
      // Peek the first entry point from the graph
      log.msg('\n------------------------------------------------------------------------------');
      log.msg(`Building entry point '${entryPoint.data.entryPoint.moduleId}'`);
      log.msg('------------------------------------------------------------------------------');
    }),
    // TypeScript sources compilation
    compileTs,
    // After TypeScript: bundling and write package
    writeBundles,
    writePackage,
    transformEntryPointFromPromise(async entryPoint => {
      entryPoint.state = STATE_DONE;
    }),
    // tap(() => log.info(`Built.`))
  );
