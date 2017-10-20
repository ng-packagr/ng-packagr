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

Now build with this command:

```bash
$ yarn build
```

Paths are resolved relative to the location of the `ng-package.json` file.
The `package.json` describing the library should be located in the same folder, next to `ng-package.json`.

## Features

 - :gift: Implements [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview)
   - :checkered_flag: Bundles your library in FESM2015, FESM5, and UMD formats
   - :school_satchel: npm package can be consumed by [Angular CLI](https://github.com/angular/angular-cli), [Webpack](https://github.com/webpack/webpack), or [SystemJS](https://github.com/systemjs/systemjs)
   - :dancer: Creates type definitions (`.d.ts`)
   - :runner: Generates [Ahead-of-Time](https://angular.io/guide/aot-compiler#why-do-aot-compilation) metadata (`.metadata.json`)
 - :trophy: Supports dynamic discovery and bundling of secondary entry points
 - :mag_right: Creates either [a scoped or a non-scoped packages](https://docs.npmjs.com/misc/scope) for publishing to npm registry
 - :surfer: Inlines Templates and Stylesheets
 - :sparkles: CSS Features
   - :camel: Runs [SCSS](http://sass-lang.com/guide) preprocessor, supporting the [relative `~` import syntax](https://github.com/webpack-contrib/sass-loader#imports)
   - :elephant: Runs [less](http://lesscss.org/#getting-started) preprocessor
   - :snake: Runs [Stylus](http://stylus-lang.com) preprocessor, resolves relative paths relative to ng-package.json
   - :monkey: Adds vendor-specific prefixes w/ [autoprefixer](https://github.com/postcss/autoprefixer#autoprefixer-) and [browserslist](https://github.com/ai/browserslist#queries) &mdash; just tell your desired `.browserslistrc`


## Advanced Use Cases

#### Examples and Tutorials

Nikolas LeBlanc has written a story on medium.com on [Building an Angular 4 Component Library with the Angular CLI and ng-packagr](https://medium.com/@ngl817/building-an-angular-4-component-library-with-the-angular-cli-and-ng-packagr-53b2ade0701e)

The demo repository [ng-packaged](https://github.com/dherges/ng-packaged) shows Angular CLI together with `ng-packagr`.


#### Configuration Locations

Configuration is picked up from the cli `-p` parameter, then from the default location for  `ng-package.json`, then from `package.json`.

To configure with `package.json`, put your ng-package configuration in the `ngPackage` field:

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

#### Secondary Entry-Points

Besides the primary entry point, a package can contain one or more secondary entry points (e.g. `@angular/core/testing`, `@angular/cdk/a11y`, …).
These contain symbols that we don't want to group together with the symbols in the main entry point.
The module id of a secondary entry point directs the module loader to a sub-directory by the name of the secondary entry point.
For instance, “@angular/core/testing” resolves to a directory by the same name, “@angular/core/testing”.
This directory contains a package.json file that directs the loader to the correct location for what it's looking for.

For library developers, secondary entry points are dynamically discovered by searching for `package.json` files within sub directories of the main `package.json` file's folder!

##### So how do I use sub-packages?

All you have to do is create a `package.json` file and put it where you want a secondary entry point to be created.
One way this can be done is by mimicking the folder structure of the following example which has a testing entry point in addition to its main entry point.

```
src  
├── testing   
│   ├── *.ts   
│   ├── public_api.ts  
│   └── package.json  
├── *.ts  
├── public_api.ts  
├── ng-package.json   
└── package.json   
```

The contents of the secondary `package.json` can be as simple as:
```json
```

No, that is not a typo. No name is required. No version is required. Not even a json object is required. 
It's all handled for you by ng-packagr!
When built, the secondary bundles would be accessible as `$(your-primary-package-name)/testing`.

##### What if I don't like `public_api.ts`?

You can change the entry point file by using the `ngPackage` configuration field in your secondary `package.json`.
For example, the following would use `index.ts` as the secondary entry point:

```json
{
  "ngPackage": {
    "lib": {
      "entryFile": "index.ts"
    }
  }
}
```


#### Further documentation

We keep track of user questions in GitHub's issue tracker and try to build a documentation from it.
[Explore issues w/ label documentation](https://github.com/dherges/ng-packagr/issues?q=label%3Adocumentation%20).



## Knowledge

[Angular Package Format v4.0](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview), design document at Google Docs

Packaging Angular - Jason Aden at ng-conf 2017 ([28min talk](https://youtu.be/unICbsPGFIA)):
[![Packaging Angular - Jason Aden](https://img.youtube.com/vi/unICbsPGFIA/0.jpg)](https://youtu.be/unICbsPGFIA)

