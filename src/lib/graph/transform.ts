import { MonoTypeOperatorFunction, Observable, pipe } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { BuildGraph } from './build-graph';

/**
 * A transformation applied over the build graph.
 *
 * By design, a pipeable operator over `BuildGraph`.
 *  - A transformation takes a `BuildGraph` as input (from previous transformations).
 *  - A transformation performs some operations based on the graph's data, potentially modifying nodes in the graph.
 *  - It returns a `BuildGraph` that will be passed to subsequent transformations.
 *
 * @link https://github.com/ReactiveX/rxjs/blob/master/doc/pipeable-operators.md#pipeable-operators
 */
export interface Transform extends MonoTypeOperatorFunction<BuildGraph> {
  (source$: Observable<BuildGraph>): Observable<BuildGraph>;
}

export interface PromiseBasedTransform {
  (graph: BuildGraph): Promise<BuildGraph | void> | BuildGraph | void;
}

export const transformFromPromise = (transformFn: PromiseBasedTransform): Transform =>
  pipe(
    switchMap(async graph => {
      const transformResult = await transformFn(graph);

      return transformResult || graph;
    }),
  );
