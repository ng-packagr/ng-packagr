# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.6.0"></a>
# [1.6.0](https://github.com/dherges/ng-packagr/compare/v1.5.2...v1.6.0) (2017-11-14)

This release rolls back premature Angular v5 support in `v1.6.0-rc.0`.
It is recommended to use this version of ng-packagr for building Angular v4 libraries,
as `typescript` in `2.3.x` and `@angular/tsc-wrapped` in `4.4.x` are used.

Libraries generated with this version of ng-packagr will ship with AoT metadata in version 3,
which is intended for Angular v4.

### Bug Fixes

*  update rollup to version ^0.51.0 ([#260](https://github.com/dherges/ng-packagr/issues/260)) ([0fe359e](https://github.com/dherges/ng-packagr/commit/0fe359e))


### Features

* add tsx/jsx support ([#228](https://github.com/dherges/ng-packagr/issues/228)) ([a8eefb9](https://github.com/dherges/ng-packagr/commit/a8eefb9))



<a name="1.5.2"></a>
## [1.5.2](https://github.com/dherges/ng-packagr/compare/v1.5.1...v1.5.2) (2017-11-14)

This release reverts a regression introduced in `v1.5.1`.
See pull request [#268](https://github.com/dherges/ng-packagr/issues/268).

Previously, a user of ng-packagr could install an incompatible typescript version for ng-packagr.
Prevent inadvertent typescript installs by depending on a user's typescript isntallation (peerDependencies).
This should be (is a) non-breaking change as any Angular project requires typescript as devDependency.

### Bug Fixes

* depend on user's typescript ([8f5bb9c](https://github.com/dherges/ng-packagr/commit/8f5bb9c))



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
