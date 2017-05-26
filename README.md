# ng-packagr

> Compile and package a TypeScript library to Angular Package Format

[![npm](https://img.shields.io/npm/dt/ng-packagr.svg?style=flat-square)](https://github.com/dherges/ng-packagr)
[![GitHub stars](https://img.shields.io/github/stars/dherges/ng-packagr.svg?style=social&label=Star&style=flat-square)](https://github.com/dherges/ng-packagr)
[![npm](https://img.shields.io/npm/l/ng-packagr.svg?style=flat-square)](https://github.com/dherges/ng-packagr)
[![David](https://img.shields.io/david/dherges/ng-packagr.svg?style=flat-square)](https://github.com/dherges/ng-packagr)
[![David](https://img.shields.io/david/dev/dherges/ng-packagr.svg?style=flat-square)](https://github.com/dherges/ng-packagr)

[![GitHub contributors](https://img.shields.io/github/contributors/dherges/ng-packagr.svg?style=flat-square)](https://github.com/dherges/ng-packagr)
[![GitHub issues](https://img.shields.io/github/issues/dherges/ng-packagr.svg?style=flat-square)](https://github.com/dherges/ng-packagr)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/dherges/ng-packagr.svg?style=flat-square)](https://github.com/dherges/ng-packagr)


## Usage Example

Create a configuration file `.ng-packagr.json`:

```json
{
  "src": "my-lib-source-folder",
  "dest": "dist/my-lib",
  "workingDirectory": ".ng_build",
  "ngc": {
    "tsconfig": "tsconfig.lib.json"
  }
}
```

The `tsconfig` file is located relative to the `src` folder, e.g. in `my-lib-source-folder/tsconfig.lib.json´.
It must follow this conventions:

 * In `"angularCompilerOptions"`:
   * use `flatModuleId` and `flatModuleOutFile`
   * set `"strictMetadataEmit": true` and `"skipTemplateCodegen": true`
 * Has one single entry file to the library in `"files": []`
   * it's recommended to name it `src/public_api.ts` and set in combination with `"flatModuleOutFile": "index"` (see above)
 * In `"compilerOptions"`:
   * must transpile to a _real_ ES2015 bundle with `"target": "es2015"` and `"module": "es2015"` (transformations to ES5 and legacy bundle formats are performed by the tool later)

```json
{
  "angularCompilerOptions": {
    "annotateForClosureCompiler": true,
    "flatModuleId": "@foo/bar",
    "flatModuleOutFile": "index",
    "skipTemplateCodegen": true,
    "strictMetadataEmit": true
  },
  "buildOnSave": false,
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": "",
    "target": "es2015",
    "module": "es2015",
    "moduleResolution": "node",
    "outDir": "src",
    "declaration": true,
    "sourceMap": true,
    "inlineSources": true,
    "skipLibCheck": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "typeRoots": [
      "node_modules/@types"
    ],
    "lib": [
      "dom",
      "es2015"
    ]
  },
  "exclude": [
    "node_modules",
    "dist",
    "**/*.ngfactory.ts",
    "**/*.shim.ts",
    "**/*.spec.ts"
  ],
  "files": [
    "src/public_api.ts"
  ]
}
```



## Knowledge

* [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview)

* Packaging Angular - Jason Aden at ng-conf 2017

[![Packaging Angular - Jason Aden](https://img.youtube.com/vi/unICbsPGFIA/0.jpg)](https://youtu.be/unICbsPGFIA)

