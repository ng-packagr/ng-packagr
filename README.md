# ng-packagr

> Compile and package a TypeScript library to Angular Package Format

[![npm](https://img.shields.io/npm/v/ng-packagr.svg?style=flat-square)](https://www.npmjs.com/package/ng-packagr)
[![npm License](https://img.shields.io/npm/l/ng-packagr.svg?style=flat-square)](https://github.com/dherges/ng-packagr/blob/master/LICENSE)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square)](https://conventionalcommits.org)
[![CircleCI](https://img.shields.io/circleci/project/github/dherges/ng-packagr/master.svg?style=flat-square)](https://circleci.com/gh/dherges/ng-packagr)
[![Travis](https://img.shields.io/travis/dherges/ng-packagr/master.svg?style=flat-square)](https://travis-ci.org/dherges/ng-packagr)

[![GitHub stars](https://img.shields.io/github/stars/dherges/ng-packagr.svg?style=social&label=Star&style=flat-square)](https://github.com/dherges/ng-packagr)
[![npm Downloads](https://img.shields.io/npm/dt/ng-packagr.svg?style=flat-square)](https://www.npmjs.com/package/ng-packagr)
[![GitHub contributors](https://img.shields.io/github/contributors/dherges/ng-packagr.svg?style=flat-square)](https://github.com/dherges/ng-packagr)
[![GitHub issues](https://img.shields.io/github/issues/dherges/ng-packagr.svg?style=flat-square)](https://github.com/dherges/ng-packagr)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/dherges/ng-packagr.svg?style=flat-square)](https://github.com/dherges/ng-packagr)

[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovateapp.com/)
[![Greenkeeper badge](https://badges.greenkeeper.io/dherges/ng-packagr.svg)](https://greenkeeper.io/)
[![David](https://img.shields.io/david/dherges/ng-packagr.svg?style=flat-square)](https://david-dm.org/dherges/ng-packagr)
[![David](https://img.shields.io/david/dev/dherges/ng-packagr.svg?style=flat-square)](https://david-dm.org/dherges/ng-packagr?type=dev)



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


Paths are resolved relative to the location of the `ng-package.json` file.
The `package.json` describing the library should be located in the same folder, next to `ng-package.json`.

#### Configuration Locations

Configuration is picked up from the cli `-p` parameter, then from the default location for 
`ng-package.json`, then from `package.json`.

To configure with `package.json`, put your ng-package configuration 
in the `ngPackage` field:

```json
{
  "$schema": "./node_modules/ng-packagr/package.schema.json",
  "ngPackage": {
    "lib": {
      "entryFile": "public_api.ts"
    }
  }
}
```

Note: the JSON `$schema` reference enables JSON editing support (autocompletion) for the custom `ngPackage` property in an IDE like [VSCode](https://github.com/Microsoft/vscode).

#### More Examples

Nikolas LeBlanc has written a story on medium.com on [Building an Angular 4 Component Library with the Angular CLI and ng-packagr](https://medium.com/@ngl817/building-an-angular-4-component-library-with-the-angular-cli-and-ng-packagr-53b2ade0701e)

The demo repository [ng-packaged](https://github.com/dherges/ng-packaged) shows Angular CLI together with `ng-packagr`.

#### Further documentation

We keep track of user questions in GitHub's issue tracker and try to build a documentation from it.
[Explore issues w/ label documentation](https://github.com/dherges/ng-packagr/issues?q=label%3Adocumentation%20).


## Features

 - :gift: Implements [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview)
   - :checkered_flag: Bundles your library in FESM2015, FESM5, and UMD formats
   - :school_satchel: npm package can be consumed by [Angular CLI](https://github.com/angular/angular-cli), [Webpack](https://github.com/webpack/webpack), or [SystemJS](https://github.com/systemjs/systemjs)
   - :dancer: Creates type definitions (`.d.ts`)
   - :runner: Generates [Ahead-of-Time](https://angular.io/guide/aot-compiler#why-do-aot-compilation) metadata (`.metadata.json`)
 - :surfer: Inlines Templates and Stylesheets
 - :sparkles: CSS Features
   - :camel: Runs [SCSS](http://sass-lang.com/guide) preprocessor, supporting the [relative `~` import syntax](https://github.com/webpack-contrib/sass-loader#imports)
   - :elephant: Runs [less](http://lesscss.org/#getting-started) preprocessor
   - :snake: Runs [Stylus](http://stylus-lang.com) preprocessor, resolves relative paths relative to ng-package.json
   - :monkey: Adds vendor-specific prefixes w/ [autoprefixer](https://github.com/postcss/autoprefixer#autoprefixer-) and [browserslist](https://github.com/ai/browserslist#queries) &mdash; just tell your desired `.browserslistrc`


## Knowledge

[Angular Package Format v4.0](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview), design document at Google Docs

Packaging Angular - Jason Aden at ng-conf 2017 ([28min talk](https://youtu.be/unICbsPGFIA)):
[![Packaging Angular - Jason Aden](https://img.youtube.com/vi/unICbsPGFIA/0.jpg)](https://youtu.be/unICbsPGFIA)

