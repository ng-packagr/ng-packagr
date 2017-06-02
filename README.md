# ng-packagr

> Compile and package a TypeScript library to Angular Package Format

[![npm](https://img.shields.io/npm/v/ng-packagr.svg?style=flat-square)](https://www.npmjs.com/package/ng-packagr)
[![npm](https://img.shields.io/npm/l/ng-packagr.svg?style=flat-square)](https://github.com/dherges/ng-packagr/blob/master/LICENSE)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square)](https://conventionalcommits.org)
[![CircleCI](https://img.shields.io/circleci/project/github/dherges/ng-packagr/master.svg?style=flat-square)](https://circleci.com/gh/dherges/ng-packagr)
[![Travis](https://img.shields.io/travis/dherges/ng-packagr/master.svg?style=flat-square)](https://circleci.com/gh/dherges/ng-packagr)
[![David](https://img.shields.io/david/dherges/ng-packagr.svg?style=flat-square)](https://david-dm.org/dherges/ng-packagr)
[![David](https://img.shields.io/david/dev/dherges/ng-packagr.svg?style=flat-square)](https://david-dm.org/dherges/ng-packagr?type=dev)

[![Greenkeeper badge](https://badges.greenkeeper.io/dherges/ng-packagr.svg)](https://greenkeeper.io/)
[![GitHub stars](https://img.shields.io/github/stars/dherges/ng-packagr.svg?style=social&label=Star&style=flat-square)](https://github.com/dherges/ng-packagr)
[![npm](https://img.shields.io/npm/dt/ng-packagr.svg?style=flat-square)](https://www.npmjs.com/package/ng-packagr)
[![GitHub contributors](https://img.shields.io/github/contributors/dherges/ng-packagr.svg?style=flat-square)](https://github.com/dherges/ng-packagr)
[![GitHub issues](https://img.shields.io/github/issues/dherges/ng-packagr.svg?style=flat-square)](https://github.com/dherges/ng-packagr)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/dherges/ng-packagr.svg?style=flat-square)](https://github.com/dherges/ng-packagr)


## Usage Example

For an Angular library, create one configuration file `ng-package.json`:

```json
{
  "$schema": "./node_modules/ng-packagr/ng-package.schema.json",
  "lib": {
    "entryFile": "public_api.ts"
  }
}
```

Then, build the library from a npm/yarn script defined in `package.json`:

```json
{
  "scripts": {
    "build": "ng-packagr -p ng-package.json"
  }
}
```

```bash
$ yarn build
```

Alternatively, build the library with the following command:

```bash
$ node_modules/.bin/ng-packagr -p ng-package.json
```


Pathes are resolved relative to the location of the `ng-package.json` file.
The `package.json` describing the library should be located in the same folder, next to `ng-package.json`.


## Knowledge

* [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview)

* Packaging Angular - Jason Aden at ng-conf 2017

[![Packaging Angular - Jason Aden](https://img.youtube.com/vi/unICbsPGFIA/0.jpg)](https://youtu.be/unICbsPGFIA)

