# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
