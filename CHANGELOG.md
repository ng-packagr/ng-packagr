# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="2.4.5"></a>
## [2.4.5](https://github.com/dherges/ng-packagr/compare/v2.4.4...v2.4.5) (2018-05-17)


### Bug Fixes

* create an array large enough to hold all buckets ([#877](https://github.com/dherges/ng-packagr/issues/877)) ([f4f616d](https://github.com/dherges/ng-packagr/commit/f4f616d))



<a name="2.4.4"></a>
## [2.4.4](https://github.com/dherges/ng-packagr/compare/v2.4.3...v2.4.4) (2018-05-08)


### Bug Fixes

* create tarball archive for the npm package ([f083602](https://github.com/dherges/ng-packagr/commit/f083602))



<a name="2.4.3"></a>
## [2.4.3](https://github.com/dherges/ng-packagr/compare/v2.4.2...v2.4.3) (2018-05-08)


### Bug Fixes

* generate tarball only for primary entry point (one per npm package) ([#848](https://github.com/dherges/ng-packagr/issues/848)) ([e4b31c7](https://github.com/dherges/ng-packagr/commit/e4b31c7))



<a name="2.4.2"></a>
## [2.4.2](https://github.com/dherges/ng-packagr/compare/v2.4.1...v2.4.2) (2018-04-08)


### Bug Fixes

* update uglify-js version ([#754](https://github.com/dherges/ng-packagr/issues/754)) ([ff176b7](https://github.com/dherges/ng-packagr/commit/ff176b7)), closes [#752](https://github.com/dherges/ng-packagr/issues/752)



<a name="2.4.1"></a>
## [2.4.1](https://github.com/dherges/ng-packagr/compare/v2.4.0...v2.4.1) (2018-03-25)


### Bug Fixes

* don't verify devDependencies in dist-ready package.json ([#721](https://github.com/dherges/ng-packagr/issues/721)) ([3535e86](https://github.com/dherges/ng-packagr/commit/3535e86))



<a name="2.4.0"></a>
# [2.4.0](https://github.com/dherges/ng-packagr/compare/v2.3.0...v2.4.0) (2018-03-25)


### Features

* create a tarball (dist.tgz) for the npm package ([#715](https://github.com/dherges/ng-packagr/issues/715)) ([94bc915](https://github.com/dherges/ng-packagr/commit/94bc915))


### Performance Improvements

* read content and map `async` in `minifyJsFile` ([#717](https://github.com/dherges/ng-packagr/issues/717)) ([4da0052](https://github.com/dherges/ng-packagr/commit/4da0052))



<a name="2.3.0"></a>
# [2.3.0](https://github.com/dherges/ng-packagr/compare/v2.2.0...v2.3.0) (2018-03-25)


### Bug Fixes

* cannot read property 'text' of undefined ([#669](https://github.com/dherges/ng-packagr/issues/669)) ([b91eb66](https://github.com/dherges/ng-packagr/commit/b91eb66)), closes [#668](https://github.com/dherges/ng-packagr/issues/668)
* move `keepLifecycleScripts` to ngPackage conf ([#688](https://github.com/dherges/ng-packagr/issues/688)) ([8eb6667](https://github.com/dherges/ng-packagr/commit/8eb6667))
* validate non-peerDependencies at build time ([#687](https://github.com/dherges/ng-packagr/issues/687)) ([ec9779c](https://github.com/dherges/ng-packagr/commit/ec9779c))


### Features

* add support for AMD module id in umd bundles ([#675](https://github.com/dherges/ng-packagr/issues/675)) ([59713b8](https://github.com/dherges/ng-packagr/commit/59713b8))
* allow Angular 6 as a peer dependency ([#714](https://github.com/dherges/ng-packagr/issues/714)) ([530d54e](https://github.com/dherges/ng-packagr/commit/530d54e))
* allow to override umd module identifier ([#683](https://github.com/dherges/ng-packagr/issues/683)) ([b6e099f](https://github.com/dherges/ng-packagr/commit/b6e099f))
* remove scripts section in dist-ready package.json ([#686](https://github.com/dherges/ng-packagr/issues/686)) ([810e58a](https://github.com/dherges/ng-packagr/commit/810e58a))
* support intra-package dependencies (re. entry points, experimental) ([#685](https://github.com/dherges/ng-packagr/issues/685)) ([988968e](https://github.com/dherges/ng-packagr/commit/988968e))



<a name="2.2.0"></a>
# [2.2.0](https://github.com/dherges/ng-packagr/compare/v2.1.0...v2.2.0) (2018-03-06)


### Bug Fixes

* add `chalk` to dependencies ([#647](https://github.com/dherges/ng-packagr/issues/647)) ([e8aa93f](https://github.com/dherges/ng-packagr/commit/e8aa93f))
* lock rollup-plugin-commonjs dependency at 8.3.0 ([#658](https://github.com/dherges/ng-packagr/issues/658)) ([59d0c3b](https://github.com/dherges/ng-packagr/commit/59d0c3b)), closes [#657](https://github.com/dherges/ng-packagr/issues/657)
* update rollup-plugin-license to version ^0.6.0 ([#664](https://github.com/dherges/ng-packagr/issues/664)) ([2a21d7e](https://github.com/dherges/ng-packagr/commit/2a21d7e))


### Features

* add `deleteDestPath` option ([#655](https://github.com/dherges/ng-packagr/issues/655)) ([61922c1](https://github.com/dherges/ng-packagr/commit/61922c1)), closes [#632](https://github.com/dherges/ng-packagr/issues/632)
* add Graph and Node API for angular transforms ([#644](https://github.com/dherges/ng-packagr/issues/644)) ([92e6082](https://github.com/dherges/ng-packagr/commit/92e6082))
* add update notifier to cli ([#649](https://github.com/dherges/ng-packagr/issues/649)) ([f5c4afc](https://github.com/dherges/ng-packagr/commit/f5c4afc))
* analyse typescript dependencies of an entry point ([#648](https://github.com/dherges/ng-packagr/issues/648)) ([749d48b](https://github.com/dherges/ng-packagr/commit/749d48b))
* reduce library bundle size by clean-css ([#563](https://github.com/dherges/ng-packagr/issues/563)) ([65386c2](https://github.com/dherges/ng-packagr/commit/65386c2)), closes [#614](https://github.com/dherges/ng-packagr/issues/614)


### Performance Improvements

* re-use postcss processor instance per entry point ([#645](https://github.com/dherges/ng-packagr/issues/645)) ([f70985b](https://github.com/dherges/ng-packagr/commit/f70985b))



<a name="2.1.0"></a>

# [2.1.0](https://github.com/dherges/ng-packagr/compare/v2.0.0-rc.13...v2.1.0) (2018-02-21)

### Bug Fixes

* pass 'setParentNodes' when calling 'createCompilerHost' ([#625](https://github.com/dherges/ng-packagr/issues/625)) ([9baa0bc](https://github.com/dherges/ng-packagr/commit/9baa0bc))
* prune multiple import statements for `tslib` ([#588](https://github.com/dherges/ng-packagr/issues/588)) ([2b6dac4](https://github.com/dherges/ng-packagr/commit/2b6dac4)), closes [#587](https://github.com/dherges/ng-packagr/issues/587)
* recognize aliased and namespace decorator imports ([#585](https://github.com/dherges/ng-packagr/issues/585)) ([8f88c5a](https://github.com/dherges/ng-packagr/commit/8f88c5a))
* return redirect target of typescript source file ([#637](https://github.com/dherges/ng-packagr/issues/637)) ([c1fced0](https://github.com/dherges/ng-packagr/commit/c1fced0)), closes [#473](https://github.com/dherges/ng-packagr/issues/473)

### Features

* `styleIncludePaths` for feature parity with Angular CLI ([#603](https://github.com/dherges/ng-packagr/issues/603)) ([ab973f4](https://github.com/dherges/ng-packagr/commit/ab973f4)), closes [#282](https://github.com/dherges/ng-packagr/issues/282)
* comments cleanup and license header file ([#574](https://github.com/dherges/ng-packagr/issues/574)) ([0237f24](https://github.com/dherges/ng-packagr/commit/0237f24)), closes [#362](https://github.com/dherges/ng-packagr/issues/362)
* export and test public api surface ([#584](https://github.com/dherges/ng-packagr/issues/584)) ([6858e2e](https://github.com/dherges/ng-packagr/commit/6858e2e))

<a name="2.0.0"></a>

# [2.0.0](https://github.com/dherges/ng-packagr/compare/v2.0.0-rc.13...v2.0.0) (2018-02-05)

Version 2 of ng-packagr is targeting Angular 5 (and beyond).
Update your projects by:

```bash
$ yarn add --dev ng-packagr@^2.0.0 @angular/compiler@^5.0.0 @angular/compiler-cli@^5.0.0 tsickle
```

### Migrating from v1 (Breaking changes from v1.6.0 to v2.0.0)

* Users now need to install `@angular/compiler`, `@angular/compiler-cli`, `typescript`, and `tsickle` to the `devDependency` section of their project (if not already installed). ng-packagr uses both the TypeScript and the Angular compiler version provided by the user workspace.
* The setting for external dependencies (`lib.externals`) has been removed in favour of `lib.umdModuleIds` which is now just used to provide the UMD module identifiers of external dependencies.
  By default, all dependencies are now treated as externals and thus are not embedded in the final bundle.
  If a dependency should be embedded in the distributables, it needs to be explicity added to `lib.embedded`.
  Please consult the updated README on migrating your package confguration from `lib.externals` to `lib.umdModuleIds` and `lib.embedded`.
* Discovery of primary and secondary entry points is changed to read from the following file sources. File locations are tried in this order:
  * `package.json` with `ngPackage` property
  * `ng-package.json` (requires a `package.json` as sibling)
  * `ng-package.js` (with a default export, requires a `package.json` as sibling)
* Setting `ngPackage.src` has no effect any more. The source directory (base path) is equivalent to the location of the (primary) `ng-package.json`, `package.json`, or `ng-package.js`.
* UMD Module IDs of packages have been changed: when you published a scoped npm package, e.g. `@sample/core`, the UMD module ID used to be `core` including only the second part of the npm package name. With this change, the UMD module ID is now `sample.core`. For secondary entrypoints, e.g. `@sample/core/testing`, the UMD module ID now also includes every part of the npm package name, e.g. `sample.core.testing`. Publishing your npm packages built with this version of ng-packagr causes a new UMD module ID to be generated. Users of your library need to update their configuration, e.g. when using SystemJS!

An excerpt of each bug fix and feature is listed below for the respective release candidate version!

### Bug Fixes

* recognize aliased and namespace decorator imports ([#585](https://github.com/dherges/ng-packagr/issues/585)) ([8f88c5a](https://github.com/dherges/ng-packagr/commit/8f88c5a))

### Features

* comments cleanup and license header file ([#574](https://github.com/dherges/ng-packagr/issues/574)) ([0237f24](https://github.com/dherges/ng-packagr/commit/0237f24)), closes [#362](https://github.com/dherges/ng-packagr/issues/362)
* export and test public api surface ([#584](https://github.com/dherges/ng-packagr/issues/584)) ([6858e2e](https://github.com/dherges/ng-packagr/commit/6858e2e))

<a name="2.0.0-rc.13"></a>

# [2.0.0-rc.13](https://github.com/dherges/ng-packagr/compare/v2.0.0-rc.12...v2.0.0-rc.13) (2018-02-03)

### Bug Fixes

* add `postcss-discard-comments` as a dependency ([#544](https://github.com/dherges/ng-packagr/issues/544)) ([bce5705](https://github.com/dherges/ng-packagr/commit/bce5705)), closes [#543](https://github.com/dherges/ng-packagr/issues/543)
* css comments should be discarded irrespective of `cssUrl` ([#562](https://github.com/dherges/ng-packagr/issues/562)) ([d6eb971](https://github.com/dherges/ng-packagr/commit/d6eb971))
* embed `tslib` helpers in UMD bundles only ([#573](https://github.com/dherges/ng-packagr/issues/573)) ([7a996ef](https://github.com/dherges/ng-packagr/commit/7a996ef)), closes [#371](https://github.com/dherges/ng-packagr/issues/371)
* map `rxjs/util/*` to its UMD module ID by default ([#580](https://github.com/dherges/ng-packagr/issues/580)) ([7c452fb](https://github.com/dherges/ng-packagr/commit/7c452fb)), closes [#579](https://github.com/dherges/ng-packagr/issues/579)
* pin rollup dependency to 0.53.0 ([13a79d4](https://github.com/dherges/ng-packagr/commit/13a79d4))
* report build errors ([d136422](https://github.com/dherges/ng-packagr/commit/d136422))
* strip bom from templates and stylesheet files ([#571](https://github.com/dherges/ng-packagr/issues/571)) ([5830e6a](https://github.com/dherges/ng-packagr/commit/5830e6a)), closes [#487](https://github.com/dherges/ng-packagr/issues/487)
* update rollup to version `^0.55.0` ([#534](https://github.com/dherges/ng-packagr/issues/534)) ([0cb0cce](https://github.com/dherges/ng-packagr/commit/0cb0cce)), closes [#488](https://github.com/dherges/ng-packagr/issues/488) [#523](https://github.com/dherges/ng-packagr/issues/523)
* write type definition files (via triple-slash reference) to npm package ([#443](https://github.com/dherges/ng-packagr/issues/443)) ([9dad573](https://github.com/dherges/ng-packagr/commit/9dad573))

### Features

* expand api to `.withTsConfig(string|TsConfig)`, `.forProject()` ([#561](https://github.com/dherges/ng-packagr/issues/561)) ([48f3569](https://github.com/dherges/ng-packagr/commit/48f3569)), closes [#557](https://github.com/dherges/ng-packagr/issues/557)
* le jardin, a broccoli-inspired rewrite ([#572](https://github.com/dherges/ng-packagr/issues/572)) ([6efc2d2](https://github.com/dherges/ng-packagr/commit/6efc2d2))

### Performance Improvements

* don't await and return ([#577](https://github.com/dherges/ng-packagr/issues/577)) ([f479e81](https://github.com/dherges/ng-packagr/commit/f479e81))

<a name="2.0.0-rc.12"></a>

# [2.0.0-rc.12](https://github.com/dherges/ng-packagr/compare/v2.0.0-rc.11...v2.0.0-rc.12) (2018-01-25)

### Bug Fixes

* dispose the previous TransformationResult after inlining ([#533](https://github.com/dherges/ng-packagr/issues/533)) ([b4c7e89](https://github.com/dherges/ng-packagr/commit/b4c7e89))
* strip comments from processed styles ([#512](https://github.com/dherges/ng-packagr/issues/512)) ([542aed2](https://github.com/dherges/ng-packagr/commit/542aed2)), closes [#503](https://github.com/dherges/ng-packagr/issues/503)

### Features

* enable tsconfig customization thru the programmatic API ([#517](https://github.com/dherges/ng-packagr/issues/517)) ([8b04d44](https://github.com/dherges/ng-packagr/commit/8b04d44)), closes [#256](https://github.com/dherges/ng-packagr/issues/256)

<a name="2.0.0-rc.11"></a>

# [2.0.0-rc.11](https://github.com/dherges/ng-packagr/compare/v2.0.0-rc.10...v2.0.0-rc.11) (2018-01-17)

### Bug Fixes

* escape unicode characters in css with a double blackslash ([#453](https://github.com/dherges/ng-packagr/issues/453)) ([9891128](https://github.com/dherges/ng-packagr/commit/9891128)), closes [#425](https://github.com/dherges/ng-packagr/issues/425)

### Features

* add language level support for library authors ([#486](https://github.com/dherges/ng-packagr/issues/486)) ([b33e0bc](https://github.com/dherges/ng-packagr/commit/b33e0bc))
* enable custom `sassIncludePaths` for resolving scss imports ([#494](https://github.com/dherges/ng-packagr/issues/494)) ([f8e8dc5](https://github.com/dherges/ng-packagr/commit/f8e8dc5))

<a name="2.0.0-rc.10"></a>

# [2.0.0-rc.10](https://github.com/dherges/ng-packagr/compare/v2.0.0-rc.9...v2.0.0-rc.10) (2018-01-10)

### Bug Fixes

* exclude ng-package.json from entry point discovery ([#471](https://github.com/dherges/ng-packagr/issues/471)) ([38103ac](https://github.com/dherges/ng-packagr/commit/38103ac)), closes [#463](https://github.com/dherges/ng-packagr/issues/463)
* relax version constraints, enable TypeScript 2.6 (w/ tsickle ^0.26.0) ([3c3c6a7](https://github.com/dherges/ng-packagr/commit/3c3c6a7))
* update dependendy tsickle to >=0.25.5 <0.26.0 ([#456](https://github.com/dherges/ng-packagr/issues/456)) ([136867a](https://github.com/dherges/ng-packagr/commit/136867a)), closes [#452](https://github.com/dherges/ng-packagr/issues/452)

### Features

* stabilize command API, move towards customizing through DI ([#470](https://github.com/dherges/ng-packagr/issues/470)) ([f992283](https://github.com/dherges/ng-packagr/commit/f992283))
* turn on `downlevelIteration` flag for ES5 bundles ([#475](https://github.com/dherges/ng-packagr/issues/475)) ([616888a](https://github.com/dherges/ng-packagr/commit/616888a)), closes [#418](https://github.com/dherges/ng-packagr/issues/418)

<a name="2.0.0-rc.9"></a>

# [2.0.0-rc.9](https://github.com/dherges/ng-packagr/compare/v2.0.0-rc.8...v2.0.0-rc.9) (2017-12-30)

### Bug Fixes

* supports extracting styles from multiple styleUrls ([#455](https://github.com/dherges/ng-packagr/issues/455)) ([4cfd98d](https://github.com/dherges/ng-packagr/commit/4cfd98d))

<a name="2.0.0-rc.8"></a>

# [2.0.0-rc.8](https://github.com/dherges/ng-packagr/compare/v2.0.0-rc.7...v2.0.0-rc.8) (2017-12-26)

### Bug Fixes

* remove `umdModuleIds` for esm2015 flattening (rollup `es` format) ([#429](https://github.com/dherges/ng-packagr/issues/429)) ([b103b74](https://github.com/dherges/ng-packagr/commit/b103b74))
* remove moduleId from rollup bundle options ([#444](https://github.com/dherges/ng-packagr/issues/444)) ([da332d2](https://github.com/dherges/ng-packagr/commit/da332d2))
* update rollup to version ^0.53.0 ([#438](https://github.com/dherges/ng-packagr/issues/438)) ([8918809](https://github.com/dherges/ng-packagr/commit/8918809))

### Features

* dynamic rollup configuration for esm flattening ([#395](https://github.com/dherges/ng-packagr/issues/395)) ([5712429](https://github.com/dherges/ng-packagr/commit/5712429))
* expose `build` and `version` commands from public API ([#447](https://github.com/dherges/ng-packagr/issues/447)) ([286819c](https://github.com/dherges/ng-packagr/commit/286819c))
* expose a public API surface for programmatic usage ([ec2b29f](https://github.com/dherges/ng-packagr/commit/ec2b29f))
* remove `src` property from package schema ([#431](https://github.com/dherges/ng-packagr/issues/431)) ([960484c](https://github.com/dherges/ng-packagr/commit/960484c))

### BREAKING CHANGES

* Setting `ngPackage.src` has no effect any more. The source directory (base path) is equivalent to the location of the (primary) `ng-package.json`, `package.json`, or `ng-package.js`.
* `lib.externals` has been removed in favour of `lib.umdModuleIds` which is now just used to provide the UMD module identifiers of external dependencies.
  By default, all dependencies are now treated as externals and thus are not embedded in the final bundle.
  If a dependency should be embedded in the distributables, it needs to be explicity added to `lib.embedded`.
  Please consult the updated README on migrating your package confguration from `lib.externals` to `lib.umdModuleIds` and `lib.embedded`.

<a name="2.0.0-rc.7"></a>

# [2.0.0-rc.7](https://github.com/dherges/ng-packagr/compare/v2.0.0-rc.6...v2.0.0-rc.7) (2017-12-15)

### Bug Fixes

* log error message only on build failure ([51643e1](https://github.com/dherges/ng-packagr/commit/51643e1))
* print `@angular/compiler-cli` version ([b0e362e](https://github.com/dherges/ng-packagr/commit/b0e362e))
* print rollup warnings to `log.warn()` ([356a01b](https://github.com/dherges/ng-packagr/commit/356a01b))
* relax on non-call-expression decorators in typescript parsing ([7135c42](https://github.com/dherges/ng-packagr/commit/7135c42))
* set `peerDependencies` to `tsickle: ^0.24.0` and `typescript: >=2.4.2 <2.6` ([#387](https://github.com/dherges/ng-packagr/issues/387)) ([001f63f](https://github.com/dherges/ng-packagr/commit/001f63f))
* set peerDependency `tsickle: >=0.24.0 <0.26` ([d682cd2](https://github.com/dherges/ng-packagr/commit/d682cd2))
* update fs-extra to version ^5.0.0 ([#400](https://github.com/dherges/ng-packagr/issues/400)) ([9e6d081](https://github.com/dherges/ng-packagr/commit/9e6d081))

### Features

* discover entry points from user packages ([#383](https://github.com/dherges/ng-packagr/issues/383)) ([4a7e96e](https://github.com/dherges/ng-packagr/commit/4a7e96e)), closes [#190](https://github.com/dherges/ng-packagr/issues/190)
* do not prune working directory on build failure ([6445316](https://github.com/dherges/ng-packagr/commit/6445316))
* provide version info with `ng-packagr --version` cli option ([#393](https://github.com/dherges/ng-packagr/issues/393)) ([758c403](https://github.com/dherges/ng-packagr/commit/758c403))

### Performance Improvements

* read set of typescript source files only once ([#388](https://github.com/dherges/ng-packagr/issues/388)) ([bbbbd27](https://github.com/dherges/ng-packagr/commit/bbbbd27))

### BREAKING CHANGES

* Discovery of primary and secondary entry points is changed to read from the following file sources. File locations are tried in this order:

- `package.json` with `ngPackage` property
- `ng-package.json` (requires a `package.json` as sibling)
- `ng-package.js` (with a default export, requires a `package.json` as sibling)

<a name="2.0.0-rc.6"></a>

# [2.0.0-rc.6](https://github.com/dherges/ng-packagr/compare/v2.0.0-rc.5...v2.0.0-rc.6) (2017-12-09)

Bug fixes for the previous release candidate.

Contains a fix addressing typescript build errors due to synthesized nodes, see [#369](https://github.com/dherges/ng-packagr/issues/369).

Peer Dependencies on ngc and tsc changed to caret version ranges:

* `"@angular/compiler: "^5.0.0"`
* `"typescript: ">= 2.4.2 < 2.6`

Make sure to use an [appropriate combination of Angular and TypeScript](https://blog.angular.io/angular-5-1-more-now-available-27d372f5eb4e)!

### Bug Fixes

* peer depend on angular >=5.0.0 <6.0.0, typescript >= 2.4.2 < 2.6 ([3674f0e](https://github.com/dherges/ng-packagr/commit/3674f0e))
* register ngc emit callback for `tsickle` processing ([#384](https://github.com/dherges/ng-packagr/issues/384)) ([15bd7c1](https://github.com/dherges/ng-packagr/commit/15bd7c1))
* show proper path of failure on sass inline ([#380](https://github.com/dherges/ng-packagr/issues/380)) ([8c380aa](https://github.com/dherges/ng-packagr/commit/8c380aa))

### Features

* add option `cssUrl`, inline css `url:()` to `data:` URIs ([#345](https://github.com/dherges/ng-packagr/issues/345)) ([1c71f24](https://github.com/dherges/ng-packagr/commit/1c71f24)), closes [#263](https://github.com/dherges/ng-packagr/issues/263)

<a name="2.0.0-rc.5"></a>

# [2.0.0-rc.5](https://github.com/dherges/ng-packagr/compare/v2.0.0-rc.4...v2.0.0-rc.5) (2017-12-06)

### Bug Fixes

* inline empty stylesheets ([aa621b1](https://github.com/dherges/ng-packagr/commit/aa621b1))
* update rollup to version ^0.52.0 ([#318](https://github.com/dherges/ng-packagr/issues/318)) ([317c88b](https://github.com/dherges/ng-packagr/commit/317c88b))

### Features

* consistent `flatModuleFile` naming for bundles ([#361](https://github.com/dherges/ng-packagr/issues/361)) ([17b4e0f](https://github.com/dherges/ng-packagr/commit/17b4e0f))
* enable tslib `importHelpers`, reducing bundle sizes ([#338](https://github.com/dherges/ng-packagr/issues/338)) ([f1e4cf6](https://github.com/dherges/ng-packagr/commit/f1e4cf6))
* expose programmatic API and typings ([#342](https://github.com/dherges/ng-packagr/issues/342)) ([61c7b50](https://github.com/dherges/ng-packagr/commit/61c7b50))
* implement `transformSources()` w/ domain model ([#356](https://github.com/dherges/ng-packagr/issues/356)) ([89ce2ce](https://github.com/dherges/ng-packagr/commit/89ce2ce))
* relocate source map file paths to `ng://<(at)org>/<package>/<sub>` ([#332](https://github.com/dherges/ng-packagr/issues/332)) ([c9b8d73](https://github.com/dherges/ng-packagr/commit/c9b8d73))
* resolve "~" scss import statements to nearest `node_modules` ([#352](https://github.com/dherges/ng-packagr/issues/352)) ([ee9800b](https://github.com/dherges/ng-packagr/commit/ee9800b)), closes [#346](https://github.com/dherges/ng-packagr/issues/346)
* resource inlining w/ TypeScript transformations ([#279](https://github.com/dherges/ng-packagr/issues/279)) ([4753066](https://github.com/dherges/ng-packagr/commit/4753066))

### BREAKING CHANGES

* Introduces a domain model for _Package_ and _Entry Point_ (as defined in Angular Package Format Specification Glossary). Refactors the source code transformation pipeline. Albeit the refactoring was undertaken with care and integration tests were not changed, it may cause undesired behaviour.

<a name="2.0.0-rc.4"></a>

# [2.0.0-rc.4](https://github.com/dherges/ng-packagr/compare/v2.0.0-rc.3...v2.0.0-rc.4) (2017-11-28)

### Bug Fixes

* bump `commander` to `^2.12.0`, optimize typings for `cpx` and `commander` ([#323](https://github.com/dherges/ng-packagr/issues/323)) ([68d0c34](https://github.com/dherges/ng-packagr/commit/68d0c34))

### Features

* align distributed files with `Angular Package Format v5.0` ([#322](https://github.com/dherges/ng-packagr/issues/322)) ([fff712a](https://github.com/dherges/ng-packagr/commit/fff712a)), closes [#257](https://github.com/dherges/ng-packagr/issues/257) [#319](https://github.com/dherges/ng-packagr/issues/319) [#321](https://github.com/dherges/ng-packagr/issues/321)

<a name="2.0.0-rc.3"></a>

# [2.0.0-rc.3](https://github.com/dherges/ng-packagr/compare/v2.0.0-rc.2...v2.0.0-rc.3) (2017-11-24)

### Bug Fixes

* support new cdk modules 'accordion' and 'layout' `@angular/cdk@5.0.0-rc0` ([#297](https://github.com/dherges/ng-packagr/issues/297)) ([3016585](https://github.com/dherges/ng-packagr/commit/3016585))
* support rxjs lettable operators ([#307](https://github.com/dherges/ng-packagr/issues/307)) ([5de8045](https://github.com/dherges/ng-packagr/commit/5de8045)), closes [#247](https://github.com/dherges/ng-packagr/issues/247)

<a name="2.0.0-rc.2"></a>

# [2.0.0-rc.2](https://github.com/dherges/ng-packagr/compare/v2.0.0-rc.1...v2.0.0-rc.2) (2017-11-17)

<a name="2.0.0-rc.1"></a>

# [2.0.0-rc.1](https://github.com/dherges/ng-packagr/compare/v2.0.0-rc.0...v2.0.0-rc.1) (2017-11-17)

### Bug Fixes

* report ngc compiler diagnostics and throw an error ([#292](https://github.com/dherges/ng-packagr/issues/292)) ([815509b](https://github.com/dherges/ng-packagr/commit/815509b))

### Features

* add rxjs mapTo operator to rollup globals ([#293](https://github.com/dherges/ng-packagr/issues/293)) ([1a42ce1](https://github.com/dherges/ng-packagr/commit/1a42ce1))

<a name="2.0.0-rc.0"></a>

# [2.0.0-rc.0](https://github.com/dherges/ng-packagr/compare/v1.6.0...v2.0.0-rc.0) (2017-11-14)

Migrating towards Angular v5, a series of `v2.0.0` release candidates will be published.
These releases will be published using the `next` tag on npm.
Please install the versions with `"ng-packagr: "^2.0.0-rc.0"` or `yarn add --dev ng-packagr@next`.

The `v2.0.0` release candidates collect several breaking changes compared to the last `v1.x`.

### Bug Fixes

* include scope name in module name of Rollup bundle ([#280](https://github.com/dherges/ng-packagr/issues/280)) ([3446453](https://github.com/dherges/ng-packagr/commit/3446453)), closes [#251](https://github.com/dherges/ng-packagr/issues/251)

### Features

* invoke ngc thru `@angular/compiler-cli` version 5.0.x ([c5c32c5](https://github.com/dherges/ng-packagr/commit/c5c32c5)), closes [#219](https://github.com/dherges/ng-packagr/issues/219)
* update typescript to ~2.4.2 for Angular v5 support ([#270](https://github.com/dherges/ng-packagr/issues/270)) ([2c6db4f](https://github.com/dherges/ng-packagr/commit/2c6db4f))

### BREAKING CHANGES

* when you published a scoped npm package, e.g. `@sample/core`, the UMD module ID used to be `core` including only the second part of the npm package name. With this change, the UMD module ID is now `sample.core`. For secondary entrypoints, e.g. `@sample/core/testing`, the UMD module ID now also includes every part of the npm package name, e.g. `sample.core.testing`. Publishing your npm packages built with this version of ng-packagr causes a new UMD module ID to be generated. Users of your library need to update their configuration, e.g. when using SystemJS!
* Users now need to install `@angular/compiler` and `@angular/compiler-cli` to the `devDependency` section of their project (if not already installed). ng-packagr uses both the TypeScript and the Angular compiler version provided by the user workspace.

<a name="1.6.0"></a>

# [1.6.0](https://github.com/dherges/ng-packagr/compare/v1.5.2...v1.6.0) (2017-11-14)

This release rolls back premature Angular v5 support in `v1.6.0-rc.0`.
It is recommended to use this version of ng-packagr for building Angular v4 libraries,
as `typescript` in `2.3.x` and `@angular/tsc-wrapped` in `4.4.x` are used.

Libraries generated with this version of ng-packagr will ship with AoT metadata in version 3,
which is intended for Angular v4.

### Bug Fixes

* update rollup to version ^0.51.0 ([#260](https://github.com/dherges/ng-packagr/issues/260)) ([0fe359e](https://github.com/dherges/ng-packagr/commit/0fe359e))

### Features

* add tsx/jsx support ([#228](https://github.com/dherges/ng-packagr/issues/228)) ([a8eefb9](https://github.com/dherges/ng-packagr/commit/a8eefb9))

<a name="1.5.2"></a>

## [1.5.2](https://github.com/dherges/ng-packagr/compare/v1.5.1...v1.5.2) (2017-11-14)

This release reverts a regression introduced in `v1.5.1`.
See pull request [#268](https://github.com/dherges/ng-packagr/issues/268).

Previously, a user of ng-packagr could install an incompatible typescript version for ng-packagr.
Prevent inadvertent typescript installs by depending on a user's typescript installation (peerDependencies).
This should be (is a) non-breaking change as any Angular project requires typescript as devDependency.

### Bug Fixes

* depend on user's typescript ([8f5bb9c](https://github.com/dherges/ng-packagr/commit/8f5bb9c))

<a name="1.6.0-rc.0"></a>

# [1.6.0-rc.0](https://github.com/dherges/ng-packagr/compare/v1.5.1...v1.6.0-rc.0) (2017-11-10)

### Bug Fixes

* update rollup to version ^0.51.0 ([#260](https://github.com/dherges/ng-packagr/issues/260)) ([c652f4e](https://github.com/dherges/ng-packagr/commit/c652f4e))

### Features

* add tsx/jsx support ([#228](https://github.com/dherges/ng-packagr/issues/228)) ([4068664](https://github.com/dherges/ng-packagr/commit/4068664))
* invoke ngc thru `@angular/compiler-cli` version 5.0.x ([#271](https://github.com/dherges/ng-packagr/issues/271)) ([c5c32c5](https://github.com/dherges/ng-packagr/commit/c5c32c5)), closes [#219](https://github.com/dherges/ng-packagr/issues/219)
* update typescript to ~2.4.2 for Angular v5 support ([#270](https://github.com/dherges/ng-packagr/issues/270)) ([2c6db4f](https://github.com/dherges/ng-packagr/commit/2c6db4f))

<a name="1.5.1"></a>

## [1.5.1](https://github.com/dherges/ng-packagr/compare/v1.5.0...v1.5.1) (2017-11-10)

### Bug Fixes

* depend on user's typescript and tsc-wrapped ([#268](https://github.com/dherges/ng-packagr/issues/268)) ([42b2f08](https://github.com/dherges/ng-packagr/commit/42b2f08))

<a name="1.5.0"></a>

# [1.5.0](https://github.com/dherges/ng-packagr/compare/v1.4.0...v1.5.0) (2017-11-05)

Secondary entrypoints – such as `@angular/core/testing`, `@angular/common/http`, `@angular/cdk/a11y`, et al. – can now be bundled with ng-packagr. Angular's `tsc-wrapped` is now version ^4.4.5 and `typescript` is ^2.3.4 – whether these work well with Angular 5 needs to be verified.

### Bug Fixes

* add description for `ngPackage` property in `package.json` ([3f8e25c](https://github.com/dherges/ng-packagr/commit/3f8e25c))
* copy `README.md` and `LICENSE` just for primary entry ([#215](https://github.com/dherges/ng-packagr/issues/215))([38776d8](https://github.com/dherges/ng-packagr/commit/38776d8))
* validate `ngPackage` property for secondary entry resolution ([#229](https://github.com/dherges/ng-packagr/issues/229)) ([ee5949b](https://github.com/dherges/ng-packagr/commit/ee5949b))
* resolve node_modules folder dynamically from typescript ([#211](https://github.com/dherges/ng-packagr/issues/211)) ([9a7008d](https://github.com/dherges/ng-packagr/commit/9a7008d))
* produce correct secondary package paths ([#197](https://github.com/dherges/ng-packagr/issues/197)) ([4ca213e](https://github.com/dherges/ng-packagr/commit/4ca213e))
* respect secondary entry file customizations ([#198](https://github.com/dherges/ng-packagr/issues/198)) ([9de7524](https://github.com/dherges/ng-packagr/commit/9de7524))
* regression in cli defaults ([18515af](https://github.com/dherges/ng-packagr/commit/18515af))

### Features

* bump [`@angular/tsc-wrapped`](https://github.com/angular/angular) to ^4.4.5 and [`typescript`](https://github.com/Microsoft/TypeScript) to ^2.3.4 ([#200](https://github.com/dherges/ng-packagr/issues/200)) ([b2b369a](https://github.com/dherges/ng-packagr/commit/b2b369a))
* minify UMD bundles ([#205](https://github.com/dherges/ng-packagr/issues/205)) ([c58689b](https://github.com/dherges/ng-packagr/commit/c58689b))
* dynamic secondary entry points ([5922cb1](https://github.com/dherges/ng-packagr/commit/5922cb1))
* allow empty package.json for secondary entries ([c0af605](https://github.com/dherges/ng-packagr/commit/c0af605))
* help command on cli ([c68a190](https://github.com/dherges/ng-packagr/commit/c68a190))
* provide more frequent console feedback ([#212](https://github.com/dherges/ng-packagr/issues/212)) ([2801db9](https://github.com/dherges/ng-packagr/commit/2801db9))

### BREAKING CHANGES

* for auto-discovery of secondary entries, `package.json` files are now validated whether a `ngPackage` property exists; the value can be an empty object. This is a breaking change for a feature introduced in release candidate versions 1.5.0-rc.0/1.5.0-rc.1. **When upgrading from 1.4.x to 1.5.0, it is not-breaking**.

<a name="1.5.0-rc.1"></a>

# [1.5.0-rc.1](https://github.com/dherges/ng-packagr/compare/v1.5.0-rc.0...v1.5.0-rc.1) (2017-10-23)

### Bug Fixes

* produce correct secondary package paths ([#197](https://github.com/dherges/ng-packagr/issues/197)) ([4ca213e](https://github.com/dherges/ng-packagr/commit/4ca213e))
* respect secondary entry file customizations ([#198](https://github.com/dherges/ng-packagr/issues/198)) ([9de7524](https://github.com/dherges/ng-packagr/commit/9de7524))

### Features

* bump angular/[@tsc-wrapped](https://github.com/tsc-wrapped) to ^4.4.5 and [@typescript](https://github.com/typescript) to ^2.3.4 ([#200](https://github.com/dherges/ng-packagr/issues/200)) ([b2b369a](https://github.com/dherges/ng-packagr/commit/b2b369a))
* minify UMD bundles ([#205](https://github.com/dherges/ng-packagr/issues/205)) ([c58689b](https://github.com/dherges/ng-packagr/commit/c58689b))

<a name="1.5.0-rc.0"></a>

# [1.5.0-rc.0](https://github.com/dherges/ng-packagr/compare/v1.4.1...v1.5.0-rc.0) (2017-10-18)

### Bug Fixes

* regression in cli defaults ([18515af](https://github.com/dherges/ng-packagr/commit/18515af))

### Features

* allow empty package.json for 2ndary entries ([c0af605](https://github.com/dherges/ng-packagr/commit/c0af605))
* dynamic secondary entry points ([5922cb1](https://github.com/dherges/ng-packagr/commit/5922cb1))
* help command on cli ([c68a190](https://github.com/dherges/ng-packagr/commit/c68a190))

<a name="1.4.1"></a>

## [1.4.1](https://github.com/dherges/ng-packagr/compare/v1.4.0...v1.4.1) (2017-10-11)

### Bug Fixes

* include `package.schema.json` in dist artefacts and npm package ([e660545](https://github.com/dherges/ng-packagr/commit/e660545))

<a name="1.4.0"></a>

# [1.4.0](https://github.com/dherges/ng-packagr/compare/v1.3.0...v1.4.0) (2017-10-10)

### Bug Fixes

* pass empty string to `less.render()` ([f5106eb](https://github.com/dherges/ng-packagr/commit/f5106eb)), closes [#165](https://github.com/dherges/ng-packagr/issues/165)

### Features

* add json schema for `package.json` with custom `ngPackage` property ([#173](https://github.com/dherges/ng-packagr/issues/173)) ([dd85fd2](https://github.com/dherges/ng-packagr/commit/dd85fd2))
* resolve ng-package config from multiple sources ([c193b68](https://github.com/dherges/ng-packagr/commit/c193b68))

<a name="1.3.0"></a>

# [1.3.0](https://github.com/dherges/ng-packagr/compare/v1.2.1...v1.3.0) (2017-10-04)

### Features

* external dependencies from `[@angular](https://github.com/angular)/cdk` are supported by default ([4b20e29](https://github.com/dherges/ng-packagr/commit/4b20e29))

<a name="1.2.1"></a>

## [1.2.1](https://github.com/dherges/ng-packagr/compare/v1.2.0...v1.2.1) (2017-09-29)

### Bug Fixes

* properly handle rejected promises in utils ([#130](https://github.com/dherges/ng-packagr/issues/130)) ([#126](https://github.com/dherges/ng-packagr/issues/126)) ([d41c6b2](https://github.com/dherges/ng-packagr/commit/d41c6b2))

<a name="1.2.0"></a>

# [1.2.0](https://github.com/dherges/ng-packagr/compare/v1.1.0...v1.2.0) (2017-09-20)

### Features

* add rollup commonjs plugin to support all library types ([#121](https://github.com/dherges/ng-packagr/issues/121)) ([3f87f5e](https://github.com/dherges/ng-packagr/commit/3f87f5e))
* update rollup to version 0.50.0 ([#124](https://github.com/dherges/ng-packagr/issues/124)) ([fb9f529](https://github.com/dherges/ng-packagr/commit/fb9f529))

<a name="1.1.0"></a>

# [1.1.0](https://github.com/dherges/ng-packagr/compare/v1.0.1...v1.1.0) (2017-09-12)

### Features

* add stylus preprocessor support ([#120](https://github.com/dherges/ng-packagr/issues/120)) ([19933cd](https://github.com/dherges/ng-packagr/commit/19933cd))

<a name="1.0.1"></a>

## [1.0.1](https://github.com/dherges/ng-packagr/compare/v1.0.0...v1.0.1) (2017-08-31)

### Bug Fixes

* make a dummy release for 1.0.1 ([a6d6893](https://github.com/dherges/ng-packagr/commit/a6d6893))

<a name="1.0.0"></a>

# [1.0.0](https://github.com/dherges/ng-packagr/compare/v1.0.0-pre.17...v1.0.0) (2017-08-31)

### Features

* ng-packagr is released 1.0.0 final ([665a249](https://github.com/dherges/ng-packagr/commit/665a249))

<a name="1.0.0-pre.17"></a>

# [1.0.0-pre.17](https://github.com/dherges/ng-packagr/compare/v1.0.0-pre.16...v1.0.0-pre.17) (2017-08-28)

### Bug Fixes

* **package:** update rollup to version 0.49.0 ([b5b920c](https://github.com/dherges/ng-packagr/commit/b5b920c))

### Features

* support external dependency '[@angular](https://github.com/angular)/common/http' by default ([df44752](https://github.com/dherges/ng-packagr/commit/df44752))

<a name="1.0.0-pre.16"></a>

# [1.0.0-pre.16](https://github.com/dherges/ng-packagr/compare/v1.0.0-pre.15...v1.0.0-pre.16) (2017-08-22)

### Features

* update rollup to version ^0.48.0 ([9110899](https://github.com/dherges/ng-packagr/commit/9110899))

<a name="1.0.0-pre.15"></a>

# [1.0.0-pre.15](https://github.com/dherges/ng-packagr/compare/v1.0.0-pre.14...v1.0.0-pre.15) (2017-08-16)

### Bug Fixes

* move ng-package.schema.json to dist root directory ([ad6325b](https://github.com/dherges/ng-packagr/commit/ad6325b))
* read json config values thru `schema.$$get()` ([0c3130c](https://github.com/dherges/ng-packagr/commit/0c3130c))

### Features

* update rollup to version 0.46.0 ([1f25f7a](https://github.com/dherges/ng-packagr/commit/1f25f7a))
* update rollup to version 0.47.0 ([29a8901](https://github.com/dherges/ng-packagr/commit/29a8901))

### BREAKING CHANGES

* the `ng-package.schema.json` was accidentally moved to `lib` folder in a previous release. Restore it in its original location!

<a name="1.0.0-pre.14"></a>

# [1.0.0-pre.14](https://github.com/dherges/ng-packagr/compare/v1.0.0-pre.13...v1.0.0-pre.14) (2017-08-07)

### Bug Fixes

* add 'let' to known rxjs operators ([9927f93](https://github.com/dherges/ng-packagr/commit/9927f93)), closes [#85](https://github.com/dherges/ng-packagr/issues/85)
* move less from devDependencies to dependencies ([09ef8ce](https://github.com/dherges/ng-packagr/commit/09ef8ce)), closes [#88](https://github.com/dherges/ng-packagr/issues/88)
* strip utf-8 bom when reading files ([cb34889](https://github.com/dherges/ng-packagr/commit/cb34889)), closes [#87](https://github.com/dherges/ng-packagr/issues/87)

<a name="1.0.0-pre.13"></a>

# [1.0.0-pre.13](https://github.com/dherges/ng-packagr/compare/v1.0.0-pre.12...v1.0.0-pre.13) (2017-07-28)

### Features

* support rxjs operators with different import syntaxes (#82) ([d64aa40](https://github.com/dherges/ng-packagr/commit/d64aa40))

<a name="1.0.0-pre.12"></a>

# [1.0.0-pre.12](https://github.com/dherges/ng-packagr/compare/v1.0.0-pre.11...v1.0.0-pre.12) (2017-07-27)

### Features

* Added less support ([06d7f84](https://github.com/dherges/ng-packagr/commit/06d7f84))

<a name="1.0.0-pre.11"></a>

# [1.0.0-pre.11](https://github.com/dherges/ng-packagr/compare/v1.0.0-pre.10...v1.0.0-pre.11) (2017-07-22)

### Bug Fixes

* pass file pathes to `postcss.process()` (#77) ([1051831](https://github.com/dherges/ng-packagr/commit/1051831))

<a name="1.0.0-pre.10"></a>

# [1.0.0-pre.10](https://github.com/dherges/ng-packagr/compare/v1.0.0-pre.9...v1.0.0-pre.10) (2017-07-14)

### Bug Fixes

* correct explanation of `lib.flatModuleFile` ([d95afb0](https://github.com/dherges/ng-packagr/commit/d95afb0))

### Features

* remove node 4.x support ([7a857d4](https://github.com/dherges/ng-packagr/commit/7a857d4))

<a name="1.0.0-pre.9"></a>

# [1.0.0-pre.9](https://github.com/dherges/ng-packagr/compare/v1.0.0-pre.8...v1.0.0-pre.9) (2017-07-11)

### Bug Fixes

* use pkg name for es modules folder name when `@<scope>` is undefined (#70) ([cf24b1b](https://github.com/dherges/ng-packagr/commit/cf24b1b))

<a name="1.0.0-pre.8"></a>

# [1.0.0-pre.8](https://github.com/dherges/ng-packagr/compare/v1.0.0-pre.7...v1.0.0-pre.8) (2017-07-11)

### Features

* import scss files with "~" syntax from node_modules (#67) ([205bbc0](https://github.com/dherges/ng-packagr/commit/205bbc0))
* update rollup to version ^0.45.0 (#69) ([d124cb3](https://github.com/dherges/ng-packagr/commit/d124cb3)), closes [#68](https://github.com/dherges/ng-packagr/issues/68)

<a name="1.0.0-pre.7"></a>

# [1.0.0-pre.7](https://github.com/dherges/ng-packagr/compare/v1.0.0-pre.6...v1.0.0-pre.7) (2017-07-04)

### Features

* exclude node_modules from being copied to working dir (#60) ([6bfe713](https://github.com/dherges/ng-packagr/commit/6bfe713)), closes [#51](https://github.com/dherges/ng-packagr/issues/51)
* version bump rollup to ^0.43.0 ([227e3b7](https://github.com/dherges/ng-packagr/commit/227e3b7))

<a name="1.0.0-pre.6"></a>

# [1.0.0-pre.6](https://github.com/dherges/ng-packagr/compare/v1.0.0-pre.5...v1.0.0-pre.6) (2017-06-24)

### Features

* lib.externals support. ([c226972](https://github.com/dherges/ng-packagr/commit/c226972))

<a name="1.0.0-pre.5"></a>

# [1.0.0-pre.5](https://github.com/dherges/ng-packagr/compare/v1.0.0-pre.4...v1.0.0-pre.5) (2017-06-23)

### Features

* autoprefixer / postcss support ([4115ad1](https://github.com/dherges/ng-packagr/commit/4115ad1)), closes [#54](https://github.com/dherges/ng-packagr/issues/54)
* version bump to [@angular](https://github.com/angular)/tsc-wrapped 4.2.0 ([7091f2a](https://github.com/dherges/ng-packagr/commit/7091f2a))

<a name="1.0.0-pre.4"></a>

# [1.0.0-pre.4](https://github.com/dherges/ng-packagr/compare/v1.0.0-pre.3...v1.0.0-pre.4) (2017-06-08)

### Bug Fixes

* correct paths in generated sourcemaps (#50) ([c389160](https://github.com/dherges/ng-packagr/commit/c389160)), closes [#46](https://github.com/dherges/ng-packagr/issues/46)
* temporarily disable es5 source maps ([804dd8c](https://github.com/dherges/ng-packagr/commit/804dd8c))

<a name="1.0.0-pre.3"></a>

# [1.0.0-pre.3](https://github.com/dherges/ng-packagr/compare/v1.0.0-pre.2...v1.0.0-pre.3) (2017-06-06)

<a name="1.0.0-pre.2"></a>

# [1.0.0-pre.2](https://github.com/dherges/ng-packagr/compare/v1.0.0-pre.1...v1.0.0-pre.2) (2017-06-06)

### Bug Fixes

* **package:** update rollup to version 0.42.0 (#37) ([75f1811](https://github.com/dherges/ng-packagr/commit/75f1811))
* add `rxjs/ReplaySubject` to rollup defaults (#44) ([237b24e](https://github.com/dherges/ng-packagr/commit/237b24e))

<a name="1.0.0-pre.1"></a>

# [1.0.0-pre.1](https://github.com/dherges/ng-packagr/compare/v1.0.0-pre.0...v1.0.0-pre.1) (2017-06-02)

### Bug Fixes

* report Errors with stack traces, fail builds on promise rejection (#36) ([6076074](https://github.com/dherges/ng-packagr/commit/6076074))

<a name="1.0.0-pre.0"></a>

# [1.0.0-pre.0](https://github.com/dherges/ng-packagr/compare/v1.0.0-alpha.7...v1.0.0-pre.0) (2017-06-02)

### Features

* use '1.0.0-pre.n' version number for any upcoming prerelease ([a31c824](https://github.com/dherges/ng-packagr/commit/a31c824))

<a name="1.0.0-alpha.7"></a>

# [1.0.0-alpha.7](https://github.com/dherges/ng-packagr/compare/v1.0.0-alpha.3...v1.0.0-alpha.7) (2017-06-02)

### Bug Fixes

* correctly locate `typings` file ([3d5c266](https://github.com/dherges/ng-packagr/commit/3d5c266))
* set flatModuleId to the name from package.json (#24) ([1e2c33f](https://github.com/dherges/ng-packagr/commit/1e2c33f))

### Features

* remove deprecated `ng-package.json properties` ([9b988b0](https://github.com/dherges/ng-packagr/commit/9b988b0))

<a name="1.0.0-alpha.6"></a>

# [1.0.0-alpha.6](https://github.com/dherges/ng-packagr/compare/v1.0.0-alpha.5...v1.0.0-alpha.6) (2017-06-02)

<a name="1.0.0-alpha.5"></a>

# [1.0.0-alpha.5](https://github.com/dherges/ng-packagr/compare/v1.0.0-alpha.3...v1.0.0-alpha.5) (2017-06-02)

### Bug Fixes

* correctly locate `typings` file ([3d5c266](https://github.com/dherges/ng-packagr/commit/3d5c266))
* set flatModuleId to the name from package.json (#24) ([1e2c33f](https://github.com/dherges/ng-packagr/commit/1e2c33f))

<a name="1.0.0-alpha.4"></a>

# [1.0.0-alpha.4](https://github.com/dherges/ng-packagr/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2017-06-02)

### Bug Fixes

* correctly locate `typings` file ([3d5c266](https://github.com/dherges/ng-packagr/commit/3d5c266))
* set flatModuleId to the name from package.json (#24) ([1e2c33f](https://github.com/dherges/ng-packagr/commit/1e2c33f))

<a name="1.0.0-alpha.3"></a>

# [1.0.0-alpha.3](https://github.com/dherges/ng-packagr/compare/v1.0.0-alpha.2...v1.0.0-alpha.3) (2017-05-31)

### Features

* implement build steps with updated `ng-package.json` ([259a9fc](https://github.com/dherges/ng-packagr/commit/259a9fc))
* include `[@angular](https://github.com/angular)/router` in default rollup opts ([3d576ee](https://github.com/dherges/ng-packagr/commit/3d576ee))
* JSON schema for `ng-package.json` ([76dd2ff](https://github.com/dherges/ng-packagr/commit/76dd2ff))

<a name="1.0.0-alpha.2"></a>

# [1.0.0-alpha.2](https://github.com/dherges/ng-packagr/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2017-05-27)

### Features

* default config file `ng-package.json` (#10) ([00fa15c](https://github.com/dherges/ng-packagr/commit/00fa15c))

### BREAKING CHANGES

* the default config file is renamed from `.ng-packagr.json` to `ng-package.json`. Use one `ng-package.json` per each Angular library project.

<a name="1.0.0-alpha.1"></a>

# [1.0.0-alpha.1](https://github.com/dherges/ng-packagr/compare/v1.0.0-alpha.0...v1.0.0-alpha.1) (2017-05-27)

### Bug Fixes

* resolve pathes relative to `ng-package.json` ([852ce43](https://github.com/dherges/ng-packagr/commit/852ce43))

### Features

* [@angular](https://github.com/angular) and rxjs rollup globals ([58702e3](https://github.com/dherges/ng-packagr/commit/58702e3))
* each Angular package is reflected in one `ng-package.json` file (#8) ([b8d0649](https://github.com/dherges/ng-packagr/commit/b8d0649))

<a name="1.0.0-alpha.0"></a>

# 1.0.0-alpha.0 (2017-05-19)

### Features

* cli command `ng-packagr` for npm script users ([6d4a90e](https://github.com/dherges/ng-packagr/commit/6d4a90e))
* configuratin with `.ng-packagr.json` file ([c1762b3](https://github.com/dherges/ng-packagr/commit/c1762b3))
* demo library ([2cb2066](https://github.com/dherges/ng-packagr/commit/2cb2066))
* implement `ng-packagr` ([8474e36](https://github.com/dherges/ng-packagr/commit/8474e36))
* Initial proof-of-concept compilation ([91880b9](https://github.com/dherges/ng-packagr/commit/91880b9))
* produce source maps in Angular Package ([bc84b54](https://github.com/dherges/ng-packagr/commit/bc84b54))
