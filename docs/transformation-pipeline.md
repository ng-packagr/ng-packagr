# A Transformation pipeline

> RxJS ❤️ DI = 🌳

## Excerpt

A pipeline consists of a series of transformations applied to a graph.
A transformation is representable by a lettable/pipeable rxjs operator, i.e. a unary function over the build graph.
Transformation functions may be composed through dependency injection, thus making the pipeline more "pluggable" and allowing to mash with custom transformations.

## Description

A transformation is a pipeable operator (more precise, a mono-type operator) over the build graph:

```ts
(source$: Observable<BuildGraph>) => Observable<BuildGraph>
```

Promise-based transformations and async/await-based transformations may be written as (undefined and void return values indicate that the graph wasn't altered):

```ts
(graph: BuildGraph): Promise<BuildGraph | void> | BuildGraph | void;
```

A utility helps creating such promise- and async/await-based transforms:

```ts
transformFromPromise(async graph => {
  await doAsyncOperation();
  return graph;
});

transformFromPromise(graph => {
  return Promise.resolve(/* .. *);
});
```

Writing a transformation with "plain rxjs" utilizing pipeable operators:

```ts
import { map, tap } from 'rxjs/operators';
import { pipe } from 'rxjs/util/pipe';

const myTransform: Transform = pipe(
  tap(() => console.log('About to start something...')),
  map((graph: BuildGraph) => {
    // Alter the graph
    graph.put(new Node /* ... */());

    // Return the graph instance, thus passing it to "next" (a subsequent transform)
    return graph;
  }),
  tap(() => console.log('Finished something'))
);
```

A Transformation may be composed of several "sub-transformations". Composition through dependency injection is utilized by writing a factory function that returns the composed transformation:

```ts
import { pipe } from 'rxjs/util/pipe';

function composedTransformationFactory(firstSubTransform: Transform, secondSubTransform: Transform) {
  return pipe(firstSubTransform, secondSubTransform);
}
```

The factory then needs to be wired up via [injection-js](https://github.com/mgechev/injection-js) APIs:

```ts
import { InjectionToken, Provider } from 'injection-js';

const FIRST_TRANSFORM_TOKEN: InjectionToken<Transform> = /* .. */;
const SECOND_TRANSFORM_TOKEN: InjectionToken<Transform> = /* .. */;

const COMPOSED_TRANSFORM = new InjectionToken<Transform>(/* ... */);
const COMPOSED_TRANSFORM_PROVIDER: Provider = {
  provide: COMPOSED_TRANSFORM,
  useFactory: composedTransformationFactory,
  deps: [ FIRST_TRANSFORM_TOKEN, SECOND_TRANSFORM_TOKEN ]
};
```

## Future Work and Current Limitations

The implementation of `BuildGraph` and `Node` are still very naive.
Their implementation may change and their APIs may change with breaking changes.
They **must not** be considered "stable" at this point in time.

The "default" ng-packagr transformation for Angular v5 is still heavily centered on the idea of an [entry point](https://github.com/dherges/ng-packagr/blob/master/src/lib/ng-package-format/entry-point.ts#L7).

The rxjs-ified pipeline allows to add a watch mode by marking nodes in the graph as "dirty" and then triggering the transformation processing.
The individual transformations will then be able to re-build just what has changed.
For example, the transformation for stylesheets may be skipped, when an HTML template was changed.
The TypeScript compilation may prevent partial re-builds of the TypeScript sources (i.e., just compile a single `*.ts` file that was changed), as ngc emits the bundled metadata for the full entry point and changing even a single `*.ts` source file is likely to inflict re-building the bundled metadata.

The dependency injection approach eventually allows users to customize the pipeline via the programmatic API.
An example usage may be:

```ts
import { ngPackagr } from 'ng-packagr';

ngPackagr().withProviders([
  {
    provide: STYLESHEET_TRANSFORM,
    useFactory: myCustomizedStylesheetTransformFactory
  }
]);
```

The way of providing transforms may yet be improved so as to require less boilerplate code to set up the dependency injection.
Wiring up the DI for transforms may in the future be solved through a decorator.
Example could look like – this needs to be explored further before implementing:

```ts
@Transform()
export const myTransform: Transform = pipe(/* .. */);

@Transform({
  type: 'promise'
})
export async function myTransform(graph: BuildGraph): Promise<BuildGraph> {
  await doAsync();
  return graph;
}

@Transform({
  type: 'factory',
  deps: [ firstTransformToken, secondTransformToken ]
})
export function myComposedTransform(firstTransform, secondTransform) {
  return pipe(firstTransform, tap(() => console.log('Adding my custom processing in-between')), secondTransform);
}
```

## References

[RxJS Pipeable Operators](https://github.com/ReactiveX/rxjs/blob/master/doc/pipeable-operators.md#pipeable-operators)

[Broccoli: the Build Tool, not the Vegetable](https://hashrocket.com/blog/posts/broccoli-the-build-tool-not-the-vegetable)

[Broccoli: First Release](https://www.solitr.com/blog/2014/02/broccoli-first-release/), see "3.2 Plugins Just Return New Trees" and "3.3 The File System Is The API"

[injection-js](https://github.com/mgechev/injection-js), an extraction of the Angular's ReflectiveInjector which means that it's well designed, feature complete, fast, reliable and well tested.
