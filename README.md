# ng-packagr

> Compile and package Angular libraries in Angular Package Format (APF)


[![npm](https://img.shields.io/npm/v/ng-packagr.svg?style=flat-square)](https://www.npmjs.com/package/ng-packagr)
[![npm License](https://img.shields.io/npm/l/ng-packagr.svg?style=flat-square)](https://github.com/ng-packagr/ng-packagr/blob/main/LICENSE)
[![CircleCI](https://img.shields.io/circleci/project/github/ng-packagr/ng-packagr/main.svg?label=Circle%20CI&style=flat-square)](https://circleci.com/gh/ng-packagr/ng-packagr)

[![GitHub stars](https://img.shields.io/github/stars/ng-packagr/ng-packagr.svg?label=GitHub%20Stars&style=flat-square)](https://github.com/ng-packagr/ng-packagr)
[![npm Downloads](https://img.shields.io/npm/dw/ng-packagr.svg?style=flat-square)](https://www.npmjs.com/package/ng-packagr)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg?style=flat-square)](https://renovateapp.com/)

## Installation

```bash
npm install -D ng-packagr
```

## Usage Example

Let's walk through a _getting started_ that'll build an Angular library from TypeScript sources and create a distribution-ready npm package:
create a `ng-package.json` file and run `ng-packagr -p ng-package.json`
– Here we go:

```json
{
  "$schema": "./node_modules/ng-packagr/ng-package.schema.json",
   ...
}
```

You can easily run _ng-packagr_ through a npm/yarn script:

```json
{
  "scripts": {
    "build": "ng-packagr -p ng-package.json"
  }
}
```

Now, execute the build with the following command:

```bash
$ yarn build
```

The build output is written to the `dist` folder, containing all those _binaries_ to meet the Angular Package Format specification.
You'll now be able to go ahead and `npm publish dist` your Angular library to the npm registry.

Do you like to publish more libraries?
Is your code living in a monorepo?
Create one `package.json` per npm package, run _ng-packagr_ for each!

## Features

* :gift: Implements [Angular Package Format](https://angular.io/guide/angular-package-format)
  * :checkered_flag: Bundles your library in FESM2022
  * :school_satchel: npm package can be consumed by [Angular CLI](https://github.com/angular/angular-cli), [Webpack](https://github.com/webpack/webpack), or ESM Bundlers
  * :dancer: Creates type definitions (`.d.ts`)
* :mag_right: Creates [scoped and non-scoped packages](https://docs.npmjs.com/misc/scope) for publishing to npm registry
* :surfer: Inlines Templates and Stylesheets
* :sparkles: CSS Features
  * :camel: Runs [SCSS](http://sass-lang.com/guide) preprocessor, supporting custom include paths
  * :monkey: Adds vendor-specific prefixes w/ [autoprefixer](https://github.com/postcss/autoprefixer#autoprefixer-) and [browserslist](https://github.com/ai/browserslist#queries) &mdash; just tell your desired `.browserslistrc`
  * :tiger: Embed assets data w/ [postcss-url](https://github.com/postcss/postcss-url#inline)


## How to…
- [Copy Assets](docs/copy-assets.md)
- [Embed Assets in CSS](docs/embed-assets-css.md)
- [Managing Dependencies](docs/dependencies.md)
- [Change the Entry File of a Library](docs/entry-file.md)
- [Change Configuration Locations](docs/configuration-locations.md)
- [Override tsconfig](docs/override-tsconfig.md)
- [Add Style Include Paths](docs/style-include-paths.md)
- [Package Secondary Entrypoints (sub packages)](docs/secondary-entrypoints.md)

## Knowledge

[Angular Package Format documentation](https://angular.io/guide/angular-package-format)

Packaging Angular Libraries - Jason Aden at Angular Mountain View Meetup ([Jan 2018, 45min talk](https://www.youtube.com/watch?v=QfvwQEJVOig&t=3612s))

Create and publish Angular libs like a Pro - Juri Strumpflohner at NG-BE ([Dec 2017, 30min talk](https://youtu.be/K4YMmwxGKjY))

[![Juri Strumpflohner - Create and publish Angular libs like a Pro](https://img.youtube.com/vi/K4YMmwxGKjY/0.jpg)](https://youtu.be/K4YMmwxGKjY)

Packaging Angular - Jason Aden at ng-conf 2017 ([28min talk](https://youtu.be/unICbsPGFIA))

[![Packaging Angular - Jason Aden](https://img.youtube.com/vi/unICbsPGFIA/0.jpg)](https://youtu.be/unICbsPGFIA)


Create and publish Angular libs like a Pro - Juri Strumpflohner at ngVikings, this time demoing building Angular libraries with ng-packagr, with NX as well as Bazel ([March 2018, 30min talk](https://youtu.be/Tw8TCgeqotg))

[![Juri Strumpflohner - Create & Publish Angular Libs like a PRO at ngVikings](https://img.youtube.com/vi/Tw8TCgeqotg/0.jpg)](https://youtu.be/Tw8TCgeqotg)

## Contributing to ng-packagr

[General contribution guidelines](./CONTRIBUTING.md)

If you like to submit a pull request, you'll find it helpful to take a look at the [initial design document where it all started](./docs/DESIGN.md).

To orchestrate the different tools, ng-packagr features a [custom transformation pipeline](docs/transformation-pipeline.md#a-transformation-pipeline). The transformation pipeline is built on top of RxJS and Angular Dependency Injection concepts.
