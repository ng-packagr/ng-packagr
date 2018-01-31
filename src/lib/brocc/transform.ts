import { MonoTypeOperatorFunction } from 'rxjs/interfaces';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of as observableOf } from 'rxjs/observable/of';
import { map, switchMap } from 'rxjs/operators';
import { pipe } from 'rxjs/util/pipe';
import { BuildGraph } from './build-graph';

/**
 * A tranformation applied over the build graph.
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
    switchMap(graph => {
      const transformResult = transformFn(graph);

      if (transformResult instanceof Promise) {
        return fromPromise(transformResult).pipe(map(result => (result ? result : graph)));
      } else {
        return observableOf(transformResult ? transformResult : graph);
      }
    })
  );
