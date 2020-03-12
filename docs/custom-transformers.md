# Custom transformers

Custom transformers let you interact with the TypeScript AST after type checking has been performed, but before the output JavaScript is emitted and before any packaging actually happens.

TypeScript offers an API to specify custom transformers programmatically. Unfortunately the typescript CLI has no support for custom transformers at the moment.

ng-packagr supports user-provided custom transformers in `tsconfig.json`.

## Configuration

Add custom transformers in `tsconfig.json` as shown below.

```json
{
  "compilerOptions": {
    "plugins": [{ "transform": "transformer-module" }]
  }
}
```

## Differences with ttypescript

Note that ng-packagr **does not use [ttypescript](https://github.com/cevek/ttypescript)** and only implements a subset of the capabilities offered by ttypescript.

Unlike ttypescript, ng-packagr only supports the `transform` key. Parameters for the transform plugin can be specified alongside the `transform` key in the configuration object, but there is no equivalent for the other features of ttypescript at the moment.  
In particular, a transform can not be applied in `after` mode and the only supported transform `type` is `program` (the default in ttypescript).
