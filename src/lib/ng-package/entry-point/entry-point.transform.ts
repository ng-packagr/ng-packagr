import { pipe, tap } from 'rxjs';
import { STATE_DONE } from '../../graph/node';
import { Transform } from '../../graph/transform';
import log from '../../utils/log';
import { getActiveEntryPoint } from '../nodes';

/**
 * A transform that compiles an entry point from sources to distributable files (ESM, APF).
 *
 * The current transformation pipeline is:
 *
 *  - compileNgc
 *  - writeBundles
 *  - writePackage
 *
 * The transformation pipeline is pluggable through the dependency injection system.
 * Sub-transformations are passed to this factory function as arguments.
 *
 * @param compileNgc Transformation compiling typescript sources to ES2022 modules.
 * @param writeBundles Transformation flattening ES2022 modules to ESM2022, UMD, and minified UMD.
 * @param writePackage Transformation writing a distribution-ready `package.json` (for publishing to npm registry).
 */
export const entryPointTransformFactory = (
  compileNgc: Transform,
  writeBundles: Transform,
  writePackage: Transform,
): Transform =>
  pipe(
    tap(graph => {
      // Peek the first entry point from the graph
      const entryPoint = getActiveEntryPoint(graph);
      log.msg('\n------------------------------------------------------------------------------');
      log.msg(`Building entry point '${entryPoint.data.entryPoint.moduleId}'`);
      log.msg('------------------------------------------------------------------------------');
    }),
    // Angular + TypeScript sources compilation
    compileNgc,
    // Bundling in ECMAScript Modules (ESM)
    writeBundles,
    // Packaging in Angular Package Format (APF)
    writePackage,
    tap(graph => {
      const entryPoint = getActiveEntryPoint(graph);
      entryPoint.state = STATE_DONE;
    }),
  );
