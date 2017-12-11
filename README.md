# ng-packagr

> Transpile your libraries to Angular Package Format

[![npm](https://img.shields.io/npm/v/ng-packagr.svg?style=flat-square)](https://www.npmjs.com/package/ng-packagr)
[![npm License](https://img.shields.io/npm/l/ng-packagr.svg?style=flat-square)](https://github.com/dherges/ng-packagr/blob/master/LICENSE)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square)](https://conventionalcommits.org)
[![CircleCI](https://img.shields.io/circleci/project/github/dherges/ng-packagr/master.svg?label=Circle%20CI&style=flat-square)](https://circleci.com/gh/dherges/ng-packagr)
[![Travis](https://img.shields.io/travis/dherges/ng-packagr/master.svg?label=Travis%20CI&style=flat-square)](https://travis-ci.org/dherges/ng-packagr)

[![GitHub contributors](https://img.shields.io/github/contributors/dherges/ng-packagr.svg?style=flat-square)](https://github.com/dherges/ng-packagr)
[![GitHub PR Stats](http://issuestats.com/github/dherges/ng-packagr/badge/pr?style=flat-square)](http://issuestats.com/github/dherges/ng-packagr)
[![GitHub Issue Stats](http://issuestats.com/github/dherges/ng-packagr/badge/issue?style=flat-square)](http://issuestats.com/github/dherges/ng-packagr)

[![GitHub stars](https://img.shields.io/github/stars/dherges/ng-packagr.svg?label=GitHub%20Stars&style=flat-square)](https://github.com/dherges/ng-packagr)
[![npm Downloads](https://img.shields.io/npm/dw/ng-packagr.svg?style=flat-square)](https://www.npmjs.com/package/ng-packagr)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg?style=flat-square)](https://renovateapp.com/)


## Usage Example

For publishing your Angular library, create a `package.json` file and add the custom `ngPackage` property:

```json
{
  "$schema": "./node_modules/ng-packagr/package.schema.json",
  "name": "@my/foo",
  "version": "1.0.0",
  "ngPackage": {
    "lib": {
      "entryFile": "public_api.ts"
    }
  }
}
```

Paths in the `ngPackage` configuration are resolved relative to the location of the `package.json` file.
You should use a npm/yarn script to run _ng-packagr_:

```json
{
  "scripts": {
    "build": "ng-packagr -p ng-package.json"
  }
}
```

Now, build with the following command:

```bash
$ yarn build
```

You like to publish more libraries to npm?
Create one `package.json` per npm package, run _ng-packagr_ for each!


## Features

 - :gift: Implements [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview)
   - :checkered_flag: Bundles your library in FESM2015, FESM5, and UMD formats
   - :school_satchel: npm package can be consumed by [Angular CLI](https://github.com/angular/angular-cli), [Webpack](https://github.com/webpack/webpack), or [SystemJS](https://github.com/systemjs/systemjs)
   - :dancer: Creates type definitions (`.d.ts`)
   - :runner: Generates [Ahead-of-Time](https://angular.io/guide/aot-compiler#why-do-aot-compilation) metadata (`.metadata.json`)
   - :trophy: Auto-discovers and bundles secondary entry points such as `@my/foo`, `@my/foo/testing`, `@my/foo/bar`
 - :mag_right: Creates [scoped and non-scoped packages](https://docs.npmjs.com/misc/scope) for publishing to npm registry
 - :surfer: Inlines Templates and Stylesheets
 - :sparkles: CSS Features
   - :camel: Runs [SCSS](http://sass-lang.com/guide) preprocessor, supporting the [relative `~` import syntax](https://github.com/webpack-contrib/sass-loader#imports)
   - :elephant: Runs [less](http://lesscss.org/#getting-started) preprocessor
   - :snake: Runs [Stylus](http://stylus-lang.com) preprocessor, resolves relative paths relative to ng-package.json
   - :monkey: Adds vendor-specific prefixes w/ [autoprefixer](https://github.com/postcss/autoprefixer#autoprefixer-) and [browserslist](https://github.com/ai/browserslist#queries) &mdash; just tell your desired `.browserslistrc`
   - :tiger: Embed assets data w/ [postcss-url](https://github.com/postcss/postcss-url#inline)


## Advanced Use Cases

#### Examples and Tutorials

Nikolas LeBlanc's story on medium.com: [Building an Angular 4 Component Library with the Angular CLI and ng-packagr](https://medium.com/@ngl817/building-an-angular-4-component-library-with-the-angular-cli-and-ng-packagr-53b2ade0701e)

Here is a [demo repository showing ng-packagr and Angular CLI](https://github.com/dherges/ng-packaged) in action.

What about [ng-packagr alongside Nx Workspace](https://github.com/dherges/nx-packaged)? Well, they work well together!


#### Configuration Locations

Configuration is picked up from the project file given by the `-p` CLI option.
The `-p `option may refer to a `package.json` (with custom `ngPackage` property), an `ng-package.json`, or an `ng-package.js` file.
When the `-p` option refers to a directory, the configuration is picked up from the first matching source;
locations are tried in the above-mentioned order.

To configure with a `package.json`, put the configuration in the `ngPackage` custom property:

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

To configure with a `ng-package.json` or `ng-package.js`, keep the library's `package.json` in the same folder next to `ng-package.json` or `ng-package.js`.

Example of `ng-package.json`:

```json
{
  "$schema": "./node_modules/ng-packagr/ng-package.schema.json",
  "lib": {
    "entryFile": "public_api.ts"
  }
}
```

Example of `ng-package.js`:

```js
module.exports = {
  lib: {
    entryFile: 'public_api.ts'
  }
};
```

Note: referencing the `$schema` enables JSON editing support (auto-completion for configuration) in IDEs like [VSCode](https://github.com/Microsoft/vscode).

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
└── testing
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

#### How to embed assets in CSS?

You can embed assets such as font and images inside the outputted css. More information [in the CSS tricks website](https://css-tricks.com/data-uris)

Valid values: `none` or `inline`.

```json
{
  "ngPackage": {
    "lib": {
      "cssUrl": "inline"
    }
  }
}
```

#### React loves Angular, Angular loves React

What if I want to use React Components in Angular?

If you have React Components that you're using in your library, and want to use proper JSX/TSX syntax in order to
construct them, you can set the `jsx` flag for your library through `ng-package.json` like so:

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

The `jsx` flag will accept what the corresponding `tsconfig` accepts, more information [in the TypeScript Handbook chaper on JSX](https://www.typescriptlang.org/docs/handbook/jsx.html).

Note: Don't forget to include `react` and `react-dom` in your `externals` so that you're not bundling those dependencies!


## Further documentation

We keep track of user questions in GitHub's issue tracker and try to build a documentation from it.
[Explore issues w/ label documentation](https://github.com/dherges/ng-packagr/issues?q=label%3Adocumentation%20).



## Knowledge

[Angular Package Format v5.0](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview), design document at Google Docs


Packaging Angular - Jason Aden at ng-conf 2017 ([28min talk](https://youtu.be/unICbsPGFIA))

[![Packaging Angular - Jason Aden](https://img.youtube.com/vi/unICbsPGFIA/0.jpg)](https://youtu.be/unICbsPGFIA)

