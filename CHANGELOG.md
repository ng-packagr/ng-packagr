# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
