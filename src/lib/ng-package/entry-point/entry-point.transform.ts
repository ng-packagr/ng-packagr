import { pipe, tap } from 'rxjs';
import { BuildGraph } from '../../graph/build-graph';
import { STATE_DONE } from '../../graph/node';
import { PromiseBasedTransform, Transform } from '../../graph/transform';
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
 * @deprecated
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


export const entryPointTransformFactory2 = (
  compileNgc2: PromiseBasedTransform,
  writeBundles2: PromiseBasedTransform,
  writePackage2: PromiseBasedTransform,
): PromiseBasedTransform => {
  return async (graph: BuildGraph): Promise<void> => {
    const entryPoint = getActiveEntryPoint(graph);
    log.msg('\n------------------------------------------------------------------------------');
    log.msg(`Building entry point '${entryPoint.data.entryPoint.moduleId}'`);
    log.msg('------------------------------------------------------------------------------');

    await compileNgc2(graph);
    await writeBundles2(graph);
    await writePackage2(graph);

    const activeEntryPoint = getActiveEntryPoint(graph);
    activeEntryPoint.state = STATE_DONE;
  };
};
