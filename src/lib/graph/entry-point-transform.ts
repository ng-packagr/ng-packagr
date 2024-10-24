import { MonoTypeOperatorFunction, Observable, pipe, switchMap } from 'rxjs';
import { EntryPointNode } from '../ng-package/nodes';
import { BuildGraph } from './build-graph';

/**
 * An entry point transformation data.
 */
export interface EntryPointTransformData {
  graph: BuildGraph;
  entryPoint: EntryPointNode;
}

/**
 * A transformation applied over an entry point.
 */
export interface EntryPointTransform extends MonoTypeOperatorFunction<EntryPointTransformData> {
  (source$: Observable<EntryPointTransformData>): Observable<EntryPointTransformData>;
}

export interface PromiseBasedEntryPointTransform {
  (
    entryPoint: EntryPointNode,
    graph: BuildGraph,
  ): Promise<EntryPointTransformData | void> | EntryPointTransformData | void;
}

export const transformEntryPointFromPromise = (transformFn: PromiseBasedEntryPointTransform): EntryPointTransform =>
  pipe(
    switchMap(async transformData => {
      const transformResult = await transformFn(transformData.entryPoint, transformData.graph);

      return transformResult || transformData;
    }),
  );
