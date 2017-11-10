# ng-packagr

> Compile a TypeScript library to Angular Package Format

[![npm](https://img.shields.io/npm/v/ng-packagr.svg?style=flat-square)](https://www.npmjs.com/package/ng-packagr)
[![npm License](https://img.shields.io/npm/l/ng-packagr.svg?style=flat-square)](https://github.com/dherges/ng-packagr/blob/master/LICENSE)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square)](https://conventionalcommits.org)
[![CircleCI](https://img.shields.io/circleci/project/github/dherges/ng-packagr/master.svg?style=flat-square)](https://circleci.com/gh/dherges/ng-packagr)
[![Travis](https://img.shields.io/travis/dherges/ng-packagr/master.svg?style=flat-square)](https://travis-ci.org/dherges/ng-packagr)

[![GitHub stars](https://img.shields.io/github/stars/dherges/ng-packagr.svg?label=GitHub%20Stars&style=flat-square)](https://github.com/dherges/ng-packagr)
[![npm Downloads](https://img.shields.io/npm/dw/ng-packagr.svg?style=flat-square)](https://www.npmjs.com/package/ng-packagr)
[![GitHub contributors](https://img.shields.io/github/contributors/dherges/ng-packagr.svg?style=flat-square)](https://github.com/dherges/ng-packagr)
[![GitHub issues](https://img.shields.io/github/issues/dherges/ng-packagr.svg?style=flat-square)](https://github.com/dherges/ng-packagr)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/dherges/ng-packagr.svg?style=flat-square)](https://github.com/dherges/ng-packagr)

[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg?style=flat-square)](https://renovateapp.com/)
[![David](https://img.shields.io/david/dherges/ng-packagr.svg?style=flat-square)](https://david-dm.org/dherges/ng-packagr)
[![David](https://img.shields.io/david/dev/dherges/ng-packagr.svg?style=flat-square)](https://david-dm.org/dherges/ng-packagr?type=dev)
[![David](https://img.shields.io/david/peer/dherges/ng-packagr.svg?style=flat-square)](https://david-dm.org/dherges/ng-packagr?type=dev)



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

Nikolas LeBlanc's story on medium.com: [Building an Angular 4 Component Library with the Angular CLI and ng-packagr](https://medium.com/@ngl817/building-an-angular-4-component-library-with-the-angular-cli-and-ng-packagr-53b2ade0701e)

Here is a [demo repository showing ng-packagr and Angular CLI](https://github.com/dherges/ng-packaged) in action.

What about [ng-packagr alongside Nx Workspace](https://github.com/dherges/nx-packaged)? Well, they work well together!


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

#### Secondary Entry Points

Beside the primary entry point, a package can contain one or more secondary entry points (e.g. `@angular/core/testing`, `@angular/cdk/a11y`, …).
These contain symbols that we don't want to group together with the symbols in the main entry.
The module id of a secondary entry directs the module loader to a sub-directory by the secondary's name.
For instance, `@angular/core/testing` resolves to a directory under `node_modules/@angular/core/testing` containing a `package.json` file that directs the loader to the correct location for what it's looking for.

For library developers, secondary entry points are dynamically discovered by searching for `package.json` files within sub directories of the main `package.json` file's folder!

##### So how do I use secondary entry points (sub-packages)?

All you have to do is create a `package.json` file and put it where you want a secondary entry point to be created.
One way this can be done is by mimicking the folder structure of the following example which has a testing entry point in addition to its main entry point.

```
my_package
├── src
|   └── *.ts
├── public_api.ts
├── ng-package.json
├── package.json
├── testing
    ├── src
    |   └── *.ts
    ├── public_api.ts
    └── package.json
```

The contents of the secondary `package.json` can be as simple as:
```json
{
  "ngPackage": {}
}
```

No, that is not a typo. No name is required. No version is required.
It's all handled for you by ng-packagr!
When built, the primary entry is imported with `@my/library` and the secondary entry with `@my/library/testing`.

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

##### What if I want to use React Components?

If you have React Components that you're using in your library, and want to use proper JSX/TSX syntax in order to
construct them, you can set the `jsx` flag for your library through `ng-package` like so:

```json
{
  "$schema": "../../../src/ng-package.schema.json",
  "lib": {
    "entryFile": "public_api.ts",
    "externals": {
      "react": "React",
      "react-dom": "ReactDOM"
    },
    "jsx": "react"
  }
}
```

The `jsx` flag will accept anything that `tsconfig` accepts, more information [here](https://www.typescriptlang.org/docs/handbook/jsx.html).

Note: Don't forget to include `react` and `react-dom` in your `externals` so that you're not bundling those dependencies.


## Further documentation

We keep track of user questions in GitHub's issue tracker and try to build a documentation from it.
[Explore issues w/ label documentation](https://github.com/dherges/ng-packagr/issues?q=label%3Adocumentation%20).



## Knowledge

[Angular Package Format v4.0](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview), design document at Google Docs

Packaging Angular - Jason Aden at ng-conf 2017 ([28min talk](https://youtu.be/unICbsPGFIA)):
[![Packaging Angular - Jason Aden](https://img.youtube.com/vi/unICbsPGFIA/0.jpg)](https://youtu.be/unICbsPGFIA)

