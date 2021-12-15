# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [13.1.2](https://github.com/ng-packagr/ng-packagr/compare/v13.1.1...v13.1.2) (2021-12-15)


### Bug Fixes

* close rollup bundle after write ([cf5de76](https://github.com/ng-packagr/ng-packagr/commit/cf5de7642832cc73aeaca70f3a7ea442df0856c9))

### [13.1.1](https://github.com/ng-packagr/ng-packagr/compare/v13.1.0...v13.1.1) (2021-12-08)

## [13.1.0](https://github.com/ng-packagr/ng-packagr/compare/v13.0.8...v13.1.0) (2021-12-08)


### Features

* add support for TypeScript 4.5 ([b4d3f5c](https://github.com/ng-packagr/ng-packagr/commit/b4d3f5c68dbee60806f1e75e2afa85fdcdb487ad))

### [13.0.8](https://github.com/ng-packagr/ng-packagr/compare/v13.0.7...v13.0.8) (2021-11-24)


### Bug Fixes

* correctly append `sourceMappingUrl` when saving FESMs into cache ([657eacd](https://github.com/ng-packagr/ng-packagr/commit/657eacd863aa989f11b8cbb2da2e485a7e42ca11)), closes [#2172](https://github.com/ng-packagr/ng-packagr/issues/2172)

### [13.0.7](https://github.com/ng-packagr/ng-packagr/compare/v13.0.6...v13.0.7) (2021-11-23)


### Bug Fixes

* package exports merging during watch mode ([af36c3a](https://github.com/ng-packagr/ng-packagr/commit/af36c3ac3c7b952923424b798518d27ccac6c132)), closes [#2168](https://github.com/ng-packagr/ng-packagr/issues/2168)

### [13.0.6](https://github.com/ng-packagr/ng-packagr/compare/v13.0.5...v13.0.6) (2021-11-18)
### Bug Fixes
*  Revert "build: update dependency postcss-preset-env to v7", due to licensing issues of `postcss-values-parser`. https://github.com/shellscape/postcss-values-parser/issues/115

### [13.0.5](https://github.com/ng-packagr/ng-packagr/compare/v13.0.4...v13.0.5) (2021-11-17)
### Bug Fixes

* ~~remove `files` property from default tsconfig ([c4cd3a7](https://github.com/ng-packagr/ng-packagr/commit/c4cd3a7bf482e1732d25afeaa76cc9d9c41a6efc)), closes [#2156](https://github.com/ng-packagr/ng-packagr/issues/2156)~~

### [13.0.4](https://github.com/ng-packagr/ng-packagr/compare/v13.0.3...v13.0.4) (2021-11-17)


### Bug Fixes

* `--version` doesn't work ([ba835bb](https://github.com/ng-packagr/ng-packagr/commit/ba835bbfe39725085fdaec4fae7e93d355d68f59)), closes [#2157](https://github.com/ng-packagr/ng-packagr/issues/2157)
* remove `files` property from default tsconfig ([c4cd3a7](https://github.com/ng-packagr/ng-packagr/commit/c4cd3a7bf482e1732d25afeaa76cc9d9c41a6efc)), closes [#2156](https://github.com/ng-packagr/ng-packagr/issues/2156)
* show warning when configuring ng-packagr in `package.json` ([037ccf5](https://github.com/ng-packagr/ng-packagr/commit/037ccf5cf30c1680251199b6affb7ecb0c89ee01))

### [13.0.3](https://github.com/ng-packagr/ng-packagr/compare/v13.0.2...v13.0.3) (2021-11-05)


### Bug Fixes

* handle multiple node_modules when resolving Sass ([c7c51a3](https://github.com/ng-packagr/ng-packagr/commit/c7c51a34b016cbff07441c59e5a18a211ec1d729))

### [13.0.2](https://github.com/ng-packagr/ng-packagr/compare/v13.0.1...v13.0.2) (2021-11-04)


### Bug Fixes

* handle imports of node packages without tilda ([a60ff99](https://github.com/ng-packagr/ng-packagr/commit/a60ff999aeb44449ee7f1fe3b469888a2397469f)), closes [#2142](https://github.com/ng-packagr/ng-packagr/issues/2142)

### [13.0.1](https://github.com/ng-packagr/ng-packagr/compare/v13.0.0...v13.0.1) (2021-11-04)


### Bug Fixes

* unable to add additional conditions to entry-point subpaths controlled by ng-packagr ([a63ebb7](https://github.com/ng-packagr/ng-packagr/commit/a63ebb7b37a9ab0b266056acf40cf4a21dfbc2a0))

## [13.0.0](https://github.com/ng-packagr/ng-packagr/compare/v13.0.0-rc.3...v13.0.0) (2021-11-03)

### ⚠ BREAKING CHANGES

* TypeScript versions prior to 4.4 are no longer supported.
* Compilation of libraries using VIew Engine is no longer supported.
* We no longer generate UMD bundles. The below options which were used for UMD bundle generation has also been removed;
  - `umdModuleIds`
  - `amdId`
  - `umdId`
* Support for `node-sass`  has been removed. sass will be used by default to compile SASS and SCSS files.

### Features

* add package exports for node and es2015 ([bd986f6](https://github.com/ng-packagr/ng-packagr/commit/bd986f6e737239a82b934f4f88b9d648fb496d29))
* add support for package.json exports ([047e3ca](https://github.com/ng-packagr/ng-packagr/commit/047e3cac2beb15d5b62e016e3c0b64f26bba43aa))
* drop support for node-sass ([34d805d](https://github.com/ng-packagr/ng-packagr/commit/34d805d9e96bd05888043010eb874986d7820feb))
* emit Javascript files with `.mjs` extension ([95166f3](https://github.com/ng-packagr/ng-packagr/commit/95166f3917e9674b5fd17d4868df71e497646c7f))
* support TypeScript to 4.4 ([40f7316](https://github.com/ng-packagr/ng-packagr/commit/40f73161a3b5fdefcd672a9b5ce325fcb208c0c4))
* update `tslib`peerDependencies to `^2.3.0` ([12dc21e](https://github.com/ng-packagr/ng-packagr/commit/12dc21e747382aff183e5c678c3aa580fd67608e))
* add package exports for node and es2015 ([bd986f6](https://github.com/ng-packagr/ng-packagr/commit/bd986f6e737239a82b934f4f88b9d648fb496d29))
* add support for package.json exports ([047e3ca](https://github.com/ng-packagr/ng-packagr/commit/047e3cac2beb15d5b62e016e3c0b64f26bba43aa))
* drop support for node-sass ([34d805d](https://github.com/ng-packagr/ng-packagr/commit/34d805d9e96bd05888043010eb874986d7820feb))
* emit Javascript files with `.mjs` extension ([95166f3](https://github.com/ng-packagr/ng-packagr/commit/95166f3917e9674b5fd17d4868df71e497646c7f))
* support Node.js version 16 ([5c8ce22](https://github.com/ng-packagr/ng-packagr/commit/5c8ce225c3a7c4243e3fc0522509a683f5a7535e))
* add esm2020 conditions in APF package exports ([ed79b27](https://github.com/ng-packagr/ng-packagr/commit/ed79b27ff69378fa2796d81626969292c27d1da9))
* add es2020 conditional export ([e5d4296](https://github.com/ng-packagr/ng-packagr/commit/e5d4296f7b755f6805270eb3b6100dcf66003333))
* do not generate UMDs ([cc59146](https://github.com/ng-packagr/ng-packagr/commit/cc5914659973a3c9e6dc04e2c038457923afae82)), closes [#2023](https://github.com/ng-packagr/ng-packagr/issues/2023) [#2000](https://github.com/ng-packagr/ng-packagr/issues/2000) [#1757](https://github.com/ng-packagr/ng-packagr/issues/1757) [#1674](https://github.com/ng-packagr/ng-packagr/issues/1674)
* downlevel es2020 bundle to generate FESM2015 ([6cf2514](https://github.com/ng-packagr/ng-packagr/commit/6cf251460e58dc430416922429d2f2dcb6a48a9c))
* enable Ivy partial compilations by default ([46133d9](https://github.com/ng-packagr/ng-packagr/commit/46133d98630e137764e0daf8a4eddaf98ac159e1)), closes [#1087](https://github.com/ng-packagr/ng-packagr/issues/1087) [#382](https://github.com/ng-packagr/ng-packagr/issues/382) [#285](https://github.com/ng-packagr/ng-packagr/issues/285) [#317](https://github.com/ng-packagr/ng-packagr/issues/317) [#355](https://github.com/ng-packagr/ng-packagr/issues/355) [#656](https://github.com/ng-packagr/ng-packagr/issues/656) [#917](https://github.com/ng-packagr/ng-packagr/issues/917)
* replace es2015 with es2020 ([9e37a56](https://github.com/ng-packagr/ng-packagr/commit/9e37a56a43d1bcd34e9f6264b3cc6f5590c2d1d1))
* support specifying stylesheet language for inline component styles ([61cd015](https://github.com/ng-packagr/ng-packagr/commit/61cd015e174a3e1db0507e63005704a7f49b9952))
* enable providing cache directory and disabling caching via options ([7d6ee38](https://github.com/ng-packagr/ng-packagr/commit/7d6ee382daa5963a1e2e9f14670a657a53e363a5))

### Bug Fixes

* error when a finding a conflicting package export ([bf3a0b9](https://github.com/ng-packagr/ng-packagr/commit/bf3a0b9c729668174e1df1e5de88393f8294a796))
* merge instead of overriding package exports ([f238118](https://github.com/ng-packagr/ng-packagr/commit/f2381189b53bb7b067b95279d76a767908d4be1f))
* improve Safari browserslist to esbuild target conversion ([23b4776](https://github.com/ng-packagr/ng-packagr/commit/23b47761dd60ac83af2a053d866c6ece9ab38330))
* incorrect cache path ([2c0121a](https://github.com/ng-packagr/ng-packagr/commit/2c0121aced903de87c4303735b2654472e12bea4))
* make cache paths safe for windows ([5b58731](https://github.com/ng-packagr/ng-packagr/commit/5b5873188d09af862aa756741b2d0857e1308c7b))
* provide supported browsers to esbuild ([4ed2e08](https://github.com/ng-packagr/ng-packagr/commit/4ed2e089d17ac19b0608012c8e509d643fc6e8ca))
* set browserslist defaults ([8223a47](https://github.com/ng-packagr/ng-packagr/commit/8223a476e816e9548ec945e22e04902712fcab4b)), closes [/github.com/browserslist/browserslist/blob/83764ea81ffaa39111c204b02c371afa44a4ff07/index.js#L516-L522](https://github.com/ng-packagr//github.com/browserslist/browserslist/blob/83764ea81ffaa39111c204b02c371afa44a4ff07/index.js/issues/L516-L522)
* error when a finding a conflicting package export ([bf3a0b9](https://github.com/ng-packagr/ng-packagr/commit/bf3a0b9c729668174e1df1e5de88393f8294a796))
* merge instead of overriding package exports ([f238118](https://github.com/ng-packagr/ng-packagr/commit/f2381189b53bb7b067b95279d76a767908d4be1f))
* report typescript configuration errors ([31b508d](https://github.com/ng-packagr/ng-packagr/commit/31b508d4d8373ec460e0395cb255c7dac2d086bc))
* don't process tslib with ngcc ([925b427](https://github.com/ng-packagr/ng-packagr/commit/925b427fe0a8b39b5fb87d7dfd259455cb5f3248))
* replace `node-sass-tilde-importer` with custom sass importer ([5cf363b](https://github.com/ng-packagr/ng-packagr/commit/5cf363b35fa33a7bf1aa979463b3ea6cb9814ab5)), closes [#2125](https://github.com/ng-packagr/ng-packagr/issues/2125)
* display package versions correctly when using the version command ([141fd65](https://github.com/ng-packagr/ng-packagr/commit/141fd655d7b080a9211596ed2a8110fdc06ba7d5))
* force less version 3.5 math behaviour ([a491faf](https://github.com/ng-packagr/ng-packagr/commit/a491faf0a37ea884f0714396b6e38a950d6a4563)), closes [#2113](https://github.com/ng-packagr/ng-packagr/issues/2113)
* only watch dependent files ([5bf477d](https://github.com/ng-packagr/ng-packagr/commit/5bf477dc1df72b053830aed659c94108027ce25a)), closes [#1829](https://github.com/ng-packagr/ng-packagr/issues/1829) [#2042](https://github.com/ng-packagr/ng-packagr/issues/2042) [#1723](https://github.com/ng-packagr/ng-packagr/issues/1723)
* remove `@rollup/plugin-commonjs` ([0d306a3](https://github.com/ng-packagr/ng-packagr/commit/0d306a309e8d1ce3574f1bc2185b442c60149d4f))
* include `esbuild-check` in the dist package ([eda7f04](https://github.com/ng-packagr/ng-packagr/commit/eda7f04e36cd6ca7451e71806b6a408127ba3ddb))
* support WASM-based esbuild optimizer fallback ([68b5f0b](https://github.com/ng-packagr/ng-packagr/commit/68b5f0b7c1798a7f79a4c3acf1415842b9973bce))
* don't exit with non zero error code on non error compiler diagnostics ([0daa33e](https://github.com/ng-packagr/ng-packagr/commit/0daa33e826795d5b1ecd91f3c67a42996de2b20f))
* normalize NGCC tsconfig path ([3846b40](https://github.com/ng-packagr/ng-packagr/commit/3846b40102b3cd8b48188fa08203961552700523))

### Performance

* only re-generate FESMs when ESM has changed ([2a02a89](https://github.com/ng-packagr/ng-packagr/commit/2a02a896c7a100e1538892fd6ab66974a52af3fe))
* read esm files from memory ([51ba534](https://github.com/ng-packagr/ng-packagr/commit/51ba5346818294e831e70393f41aed09bc8ba18c))
* store fesm generation state on disk ([4565a8b](https://github.com/ng-packagr/ng-packagr/commit/4565a8bd95d61c30e835f97a408f62da28e523ba))

## [13.0.0-rc.3](https://github.com/ng-packagr/ng-packagr/compare/v13.0.0-rc.2...v13.0.0-rc.3) (2021-10-26)


### Bug Fixes

* report typescript configuration errors ([31b508d](https://github.com/ng-packagr/ng-packagr/commit/31b508d4d8373ec460e0395cb255c7dac2d086bc))

## [13.0.0-rc.2](https://github.com/ng-packagr/ng-packagr/compare/v13.0.0-rc.1...v13.0.0-rc.2) (2021-10-21)


### Bug Fixes

* don't process tslib with ngcc ([925b427](https://github.com/ng-packagr/ng-packagr/commit/925b427fe0a8b39b5fb87d7dfd259455cb5f3248))
* replace `node-sass-tilde-importer` with custom sass importer ([5cf363b](https://github.com/ng-packagr/ng-packagr/commit/5cf363b35fa33a7bf1aa979463b3ea6cb9814ab5)), closes [#2125](https://github.com/ng-packagr/ng-packagr/issues/2125)

## [13.0.0-rc.1](https://github.com/ng-packagr/ng-packagr/compare/v13.0.0-rc.0...v13.0.0-rc.1) (2021-10-20)


### Bug Fixes

* display package versions correctly when using the version command ([141fd65](https://github.com/ng-packagr/ng-packagr/commit/141fd655d7b080a9211596ed2a8110fdc06ba7d5))
* force less version 3.5 math behaviour ([a491faf](https://github.com/ng-packagr/ng-packagr/commit/a491faf0a37ea884f0714396b6e38a950d6a4563)), closes [#2113](https://github.com/ng-packagr/ng-packagr/issues/2113)
* only watch dependent files ([5bf477d](https://github.com/ng-packagr/ng-packagr/commit/5bf477dc1df72b053830aed659c94108027ce25a)), closes [#1829](https://github.com/ng-packagr/ng-packagr/issues/1829) [#2042](https://github.com/ng-packagr/ng-packagr/issues/2042) [#1723](https://github.com/ng-packagr/ng-packagr/issues/1723)
* remove `@rollup/plugin-commonjs` ([0d306a3](https://github.com/ng-packagr/ng-packagr/commit/0d306a309e8d1ce3574f1bc2185b442c60149d4f))


### Performance

* only re-generate FESMs when ESM has changed ([2a02a89](https://github.com/ng-packagr/ng-packagr/commit/2a02a896c7a100e1538892fd6ab66974a52af3fe))
* read esm files from memory ([51ba534](https://github.com/ng-packagr/ng-packagr/commit/51ba5346818294e831e70393f41aed09bc8ba18c))
* store fesm generation state on disk ([4565a8b](https://github.com/ng-packagr/ng-packagr/commit/4565a8bd95d61c30e835f97a408f62da28e523ba))

## [13.0.0-rc.0](https://github.com/ng-packagr/ng-packagr/compare/v13.0.0-next.8...v13.0.0-rc.0) (2021-10-14)


### Features

* support Node.js version 16 ([5c8ce22](https://github.com/ng-packagr/ng-packagr/commit/5c8ce225c3a7c4243e3fc0522509a683f5a7535e))

## [13.0.0-next.8](https://github.com/ng-packagr/ng-packagr/compare/v13.0.0-next.7...v13.0.0-next.8) (2021-10-08)


### Features

* add esm2020 conditions in APF package exports ([ed79b27](https://github.com/ng-packagr/ng-packagr/commit/ed79b27ff69378fa2796d81626969292c27d1da9))


### Bug Fixes

* include `esbuild-check` in the dist package ([eda7f04](https://github.com/ng-packagr/ng-packagr/commit/eda7f04e36cd6ca7451e71806b6a408127ba3ddb))

## [13.0.0-next.7](https://github.com/ng-packagr/ng-packagr/compare/v13.0.0-next.6...v13.0.0-next.7) (2021-10-06)


### Features

* add es2020 conditional export ([e5d4296](https://github.com/ng-packagr/ng-packagr/commit/e5d4296f7b755f6805270eb3b6100dcf66003333))


### Bug Fixes

* error when a finding a conflicting package export ([bf3a0b9](https://github.com/ng-packagr/ng-packagr/commit/bf3a0b9c729668174e1df1e5de88393f8294a796))
* merge instead of overriding package exports ([f238118](https://github.com/ng-packagr/ng-packagr/commit/f2381189b53bb7b067b95279d76a767908d4be1f))

## [13.0.0-next.6](https://github.com/ng-packagr/ng-packagr/compare/v13.0.0-next.5...v13.0.0-next.6) (2021-10-04)


### ⚠ BREAKING CHANGES

* Support for `node-sass`  has been removed. sass will be used by default to compile SASS and SCSS files.

### Features

* add package exports for node and es2015 ([bd986f6](https://github.com/ng-packagr/ng-packagr/commit/bd986f6e737239a82b934f4f88b9d648fb496d29))
* add support for package.json exports ([047e3ca](https://github.com/ng-packagr/ng-packagr/commit/047e3cac2beb15d5b62e016e3c0b64f26bba43aa))
* drop support for node-sass ([34d805d](https://github.com/ng-packagr/ng-packagr/commit/34d805d9e96bd05888043010eb874986d7820feb))
* emit Javascript files with `.mjs` extension ([95166f3](https://github.com/ng-packagr/ng-packagr/commit/95166f3917e9674b5fd17d4868df71e497646c7f))

## [13.0.0-next.5](https://github.com/ng-packagr/ng-packagr/compare/v13.0.0-next.4...v13.0.0-next.5) (2021-09-28)


### ⚠ BREAKING CHANGES

* TypeScript versions prior to 4.4 are no longer supported.

### Features

* support TypeScript to 4.4 ([40f7316](https://github.com/ng-packagr/ng-packagr/commit/40f73161a3b5fdefcd672a9b5ce325fcb208c0c4))
* update `tslib`peerDependencies to `^2.3.0` ([12dc21e](https://github.com/ng-packagr/ng-packagr/commit/12dc21e747382aff183e5c678c3aa580fd67608e))


### Bug Fixes

* don't exit with non zero error code on non error compiler diagnostics ([0daa33e](https://github.com/ng-packagr/ng-packagr/commit/0daa33e826795d5b1ecd91f3c67a42996de2b20f))
* normalize NGCC tsconfig path ([3846b40](https://github.com/ng-packagr/ng-packagr/commit/3846b40102b3cd8b48188fa08203961552700523))

## [13.0.0-next.4](https://github.com/ng-packagr/ng-packagr/compare/v13.0.0-next.3...v13.0.0-next.4) (2021-09-27)


### Features

* enable providing cache directory and disabling caching via options ([7d6ee38](https://github.com/ng-packagr/ng-packagr/commit/7d6ee382daa5963a1e2e9f14670a657a53e363a5))

## [13.0.0-next.3](https://github.com/ng-packagr/ng-packagr/compare/v13.0.0-next.2...v13.0.0-next.3) (2021-09-22)


### Bug Fixes

* support WASM-based esbuild optimizer fallback ([68b5f0b](https://github.com/ng-packagr/ng-packagr/commit/68b5f0b7c1798a7f79a4c3acf1415842b9973bce))

## [13.0.0-next.2](https://github.com/ng-packagr/ng-packagr/compare/v13.0.0-next.0...v13.0.0-next.2) (2021-09-08)


### Bug Fixes

* improve Safari browserslist to esbuild target conversion ([23b4776](https://github.com/ng-packagr/ng-packagr/commit/23b47761dd60ac83af2a053d866c6ece9ab38330))

## [13.0.0-next.1](https://github.com/ng-packagr/ng-packagr/compare/v13.0.0-next.0...v13.0.0-next.1) (2021-09-02)


### Bug Fixes

* incorrect cache path ([2c0121a](https://github.com/ng-packagr/ng-packagr/commit/2c0121aced903de87c4303735b2654472e12bea4))

## [13.0.0-next.0](https://github.com/ng-packagr/ng-packagr/compare/v12.2.0...v13.0.0-next.0) (2021-09-02)


### ⚠ BREAKING CHANGES

* Compilation of libraries using VIew Engine is no longer supported.
* We no longer generate UMD bundles. The below options which were used for UMD bundle generation has also been removed;

- `umdModuleIds`
- `amdId`
- `umdId`

### Features

* do not generate UMDs ([cc59146](https://github.com/ng-packagr/ng-packagr/commit/cc5914659973a3c9e6dc04e2c038457923afae82)), closes [#2023](https://github.com/ng-packagr/ng-packagr/issues/2023) [#2000](https://github.com/ng-packagr/ng-packagr/issues/2000) [#1757](https://github.com/ng-packagr/ng-packagr/issues/1757) [#1674](https://github.com/ng-packagr/ng-packagr/issues/1674)
* downlevel es2020 bundle to generate FESM2015 ([6cf2514](https://github.com/ng-packagr/ng-packagr/commit/6cf251460e58dc430416922429d2f2dcb6a48a9c))
* enable Ivy partial compilations by default ([46133d9](https://github.com/ng-packagr/ng-packagr/commit/46133d98630e137764e0daf8a4eddaf98ac159e1)), closes [#1087](https://github.com/ng-packagr/ng-packagr/issues/1087) [#382](https://github.com/ng-packagr/ng-packagr/issues/382) [#285](https://github.com/ng-packagr/ng-packagr/issues/285) [#317](https://github.com/ng-packagr/ng-packagr/issues/317) [#355](https://github.com/ng-packagr/ng-packagr/issues/355) [#656](https://github.com/ng-packagr/ng-packagr/issues/656) [#917](https://github.com/ng-packagr/ng-packagr/issues/917)
* replace es2015 with es2020 ([9e37a56](https://github.com/ng-packagr/ng-packagr/commit/9e37a56a43d1bcd34e9f6264b3cc6f5590c2d1d1))
* support specifying stylesheet language for inline component styles ([61cd015](https://github.com/ng-packagr/ng-packagr/commit/61cd015e174a3e1db0507e63005704a7f49b9952))


### Bug Fixes

* make cache paths safe for windows ([5b58731](https://github.com/ng-packagr/ng-packagr/commit/5b5873188d09af862aa756741b2d0857e1308c7b))
* provide supported browsers to esbuild ([4ed2e08](https://github.com/ng-packagr/ng-packagr/commit/4ed2e089d17ac19b0608012c8e509d643fc6e8ca))
* set browserslist defaults ([8223a47](https://github.com/ng-packagr/ng-packagr/commit/8223a476e816e9548ec945e22e04902712fcab4b)), closes [/github.com/browserslist/browserslist/blob/83764ea81ffaa39111c204b02c371afa44a4ff07/index.js#L516-L522](https://github.com/ng-packagr//github.com/browserslist/browserslist/blob/83764ea81ffaa39111c204b02c371afa44a4ff07/index.js/issues/L516-L522)

## [12.2.0](https://github.com/ng-packagr/ng-packagr/compare/v12.2.0-next.0...v12.2.0) (2021-08-04)

### Performance

* use esbuild as a CSS optimizer for component styles ([ceb81f9](https://github.com/ng-packagr/ng-packagr/commit/ceb81f9a2533369320a1b9890fa02440a73380a9))



## [12.2.0-next.0](https://github.com/ng-packagr/ng-packagr/compare/v12.1.2...v12.2.0-next.0) (2021-07-23)


### Performance

* use esbuild as a CSS optimizer for component styles ([ceb81f9](https://github.com/ng-packagr/ng-packagr/commit/ceb81f9a2533369320a1b9890fa02440a73380a9))

### [12.1.2](https://github.com/ng-packagr/ng-packagr/compare/v12.1.1...v12.1.2) (2021-07-13)


### Bug Fixes

* parse styles cache as JSON ([f778b92](https://github.com/ng-packagr/ng-packagr/commit/f778b92f9562d248a337b5177cdeaa22a8f7ab74))

### [12.1.1](https://github.com/ng-packagr/ng-packagr/compare/v12.1.0...v12.1.1) (2021-07-09)

### Bug Fixes

* avoid non-actionable template type-checker syntax diagnostics ([63598d0](https://github.com/ng-packagr/ng-packagr/commit/63598d0))

## [12.1.0](https://github.com/ng-packagr/ng-packagr/compare/v12.1.0-next.0...v12.1.0) (2021-06-25)


### Features

* add compilation mode in build logs ([4959f8b](https://github.com/ng-packagr/ng-packagr/commit/4959f8b6b9856d5a3939cddb49523a1d74a6d1ff)), closes [#1991](https://github.com/ng-packagr/ng-packagr/issues/1991)
* add support for TypeScript 4.3 ([d6cabcf](https://github.com/ng-packagr/ng-packagr/commit/d6cabcf4f9ca2a320ee7998d2116be68d00b9c49))
* update Ivy compilation pipeline to use faster NGTSC program ([9f17304](https://github.com/ng-packagr/ng-packagr/commit/9f1730467bc6c599306e16c1583b26c305b33e53))

## [12.1.0-next.0](https://github.com/ng-packagr/ng-packagr/compare/v12.0.6...v12.1.0-next.0) (2021-06-22)


### Features

* add support for TypeScript 4.3 ([d6cabcf](https://github.com/ng-packagr/ng-packagr/commit/d6cabcf4f9ca2a320ee7998d2116be68d00b9c49))
* update Ivy compilation pipeline to use faster NGTSC program ([9f17304](https://github.com/ng-packagr/ng-packagr/commit/9f1730467bc6c599306e16c1583b26c305b33e53))


### Bug Fixes

* error shown multiple times in terminal ([22322e8](https://github.com/ng-packagr/ng-packagr/commit/22322e8b3233597831cea8e02ad06a621d5a0b64))

### [12.0.6](https://github.com/ng-packagr/ng-packagr/compare/v12.0.5...v12.0.6) (2021-06-18)


### Bug Fixes

* add version stamping during watch builds ([4e13041](https://github.com/ng-packagr/ng-packagr/commit/4e13041a7cc47918dcecd4dd94f2f57edc0e747c))

### [12.0.5](https://github.com/ng-packagr/ng-packagr/compare/v12.0.4...v12.0.5) (2021-06-09)


### Bug Fixes

* Debug Failure. False expression when using triple slash reference directive ([043c53b](https://github.com/ng-packagr/ng-packagr/commit/043c53b9f811fc4e604b51d5660c061271c2ad03))

### [12.0.4](https://github.com/ng-packagr/ng-packagr/compare/v12.0.3...v12.0.4) (2021-06-09)


### Bug Fixes

* show error message on nested circular dependency ([06e6700](https://github.com/ng-packagr/ng-packagr/commit/06e67004dc9310c67c7f9d36d16165be32779145)), closes [#2001](https://github.com/ng-packagr/ng-packagr/issues/2001)

### [12.0.3](https://github.com/ng-packagr/ng-packagr/compare/v12.0.2...v12.0.3) (2021-06-03)


### Bug Fixes

* update supported range of node versions ([#1996](https://github.com/ng-packagr/ng-packagr/issues/1996)) ([1064bea](https://github.com/ng-packagr/ng-packagr/commit/1064bea620c4650b5c4ad7f87a53f6c4ef7b0259))

### [12.0.2](https://github.com/ng-packagr/ng-packagr/compare/v12.0.1...v12.0.2) (2021-05-25)


### Bug Fixes

* display file stylesheet file path when there is an error ([698de4e](https://github.com/ng-packagr/ng-packagr/commit/698de4e0dc9f917ee147ec115cb36b0c1b7c59bf))

### [12.0.1](https://github.com/ng-packagr/ng-packagr/compare/v12.0.0...v12.0.1) (2021-05-25)


### Bug Fixes

* ignore type definitions when building entry-point dependency graph ([9a7dccb](https://github.com/ng-packagr/ng-packagr/commit/9a7dccb6e9068775a26c79d1ab1e2aee5571012a)), closes [#1982](https://github.com/ng-packagr/ng-packagr/issues/1982)
* log error from stylesheet pre-processor ([077fc65](https://github.com/ng-packagr/ng-packagr/commit/077fc65f20364636db8dca1fb3e9106a887cb7ec)), closes [#1983](https://github.com/ng-packagr/ng-packagr/issues/1983)

## [12.0.0](https://github.com/ng-packagr/ng-packagr/compare/v12.0.0-rc.3...v12.0.0) (2021-05-12)

## [12.0.0](https://github.com/ng-packagr/ng-packagr/compare/v12.0.0-rc.3...v12.0.0) (2021-05-12)

## [12.0.0-rc.3](https://github.com/ng-packagr/ng-packagr/compare/v12.0.0-rc.2...v12.0.0-rc.3) (2021-05-10)


### Bug Fixes

* improve stylesheet caching mechanism ([b4b44c8](https://github.com/ng-packagr/ng-packagr/commit/b4b44c8879e69eba06bd41da180cd6c2414acc0d))

## [12.0.0-rc.2](https://github.com/ng-packagr/ng-packagr/compare/v12.0.0-rc.1...v12.0.0-rc.2) (2021-05-06)


### Bug Fixes

* add `built at` and `time` to console output ([50639dc](https://github.com/ng-packagr/ng-packagr/commit/50639dcbb97add89fcda2570aa5a55892a9b0d2c))
* initialize worker options post browserlist setup ([ff90621](https://github.com/ng-packagr/ng-packagr/commit/ff906218cb198b0e4653528fac7df184294b70f4))


### Performance

* cache processed stylesheets ([b791429](https://github.com/ng-packagr/ng-packagr/commit/b7914293dd424b4bc30d4123f3ef6642eabdb1dc))

## [12.0.0-rc.1](https://github.com/ng-packagr/ng-packagr/compare/v12.0.0-rc.0...v12.0.0-rc.1) (2021-05-05)


### Bug Fixes

* disable CSS declaration sorting optimizations ([4f06939](https://github.com/ng-packagr/ng-packagr/commit/4f06939bab2d15e84d2737fe91d37605edfc8d6c))


### Performance

* remove double iteration over source files ([5e6afb1](https://github.com/ng-packagr/ng-packagr/commit/5e6afb1011870d8e3c8a15e2e37f82f9e5f4ee31))

## [12.0.0-next.0](https://github.com/ng-packagr/ng-packagr/compare/v12.0.0-rc.0...v12.0.0-next.0) (2021-05-05)


### Bug Fixes

* disable CSS declaration sorting optimizations ([4f06939](https://github.com/ng-packagr/ng-packagr/commit/4f06939bab2d15e84d2737fe91d37605edfc8d6c))


### Performance

* remove double iteration over source files ([5e6afb1](https://github.com/ng-packagr/ng-packagr/commit/5e6afb1011870d8e3c8a15e2e37f82f9e5f4ee31))

## [12.0.0-rc.0](https://github.com/ng-packagr/ng-packagr/compare/v12.0.0-next.9...v12.0.0-rc.0) (2021-04-22)


### ⚠ BREAKING CHANGES

* Bundling of dependencies has been removed without replacement. In many cases this was used incorrectly which drastically increase in size. This was also mainly used for UMD bundles which will be removed in future.

### Features

* remove bundled dependencies ([6576b9a](https://github.com/ng-packagr/ng-packagr/commit/6576b9a3db69c158409550c1abbf03b484070a08)), closes [#1432](https://github.com/ng-packagr/ng-packagr/issues/1432)


### Bug Fixes

* update rollup to version 2.45.2 ([fcf62fa](https://github.com/ng-packagr/ng-packagr/commit/fcf62faaf0f2f9fc40a93cf15742ece1f7bb6625))
* update sass to version 1.32.10 ([7dec58c](https://github.com/ng-packagr/ng-packagr/commit/7dec58c4cafef1068a9060731e3e060fde878cb8))

## [12.0.0-next.9](https://github.com/ng-packagr/ng-packagr/compare/v12.0.0-next.8...v12.0.0-next.9) (2021-04-15)


### ⚠ BREAKING CHANGES

* Minified UMD bundles are no longer generated.

### Bug Fixes

* don't generate minified UMD bundles. ([cf56f3b](https://github.com/ng-packagr/ng-packagr/commit/cf56f3bd3449affb63761530f6b1670a096e5538))
* update cssnano to version 5.0.0 ([1ad8fe6](https://github.com/ng-packagr/ng-packagr/commit/1ad8fe67fca8d7e0bf9211e1383de1f2ae311de1))
* update supported range of node versions ([3800679](https://github.com/ng-packagr/ng-packagr/commit/3800679130d4d860d0b00f35bb1a7337c93c9b4d))

## [12.0.0-next.8](https://github.com/ng-packagr/ng-packagr/compare/v12.0.0-next.7...v12.0.0-next.8) (2021-04-06)


### Features

* allow publishing of Ivy library in partial mode. ([c7040e8](https://github.com/ng-packagr/ng-packagr/commit/c7040e88939b8d316dcc55c3ce654abab7cd49cf)), closes [#1901](https://github.com/ng-packagr/ng-packagr/issues/1901)

## [12.0.0-next.7](https://github.com/ng-packagr/ng-packagr/compare/v12.0.0-next.6...v12.0.0-next.7) (2021-03-31)


### ⚠ BREAKING CHANGES

* During `watch` mode we no longer generate UMD bundles.

### Features

* speed up incremental mode by not generating UMD ([0af0ce0](https://github.com/ng-packagr/ng-packagr/commit/0af0ce05cf98791f6d0a90e56552cdcd56746238))


### Bug Fixes

* update @rollup/plugin-commonjs to version 18.0.0 ([76f6f43](https://github.com/ng-packagr/ng-packagr/commit/76f6f43d468d0cae576c533e5e9be3a04aa32aa9))
* update ajv to version 8.0.0 ([8d24c20](https://github.com/ng-packagr/ng-packagr/commit/8d24c207bd2485a2196d20ecb22ebd6bb84d78e6))

## [12.0.0-next.6](https://github.com/ng-packagr/ng-packagr/compare/v12.0.0-next.5...v12.0.0-next.6) (2021-03-22)


### Bug Fixes

* release main thread on worker error ([eb3138a](https://github.com/ng-packagr/ng-packagr/commit/eb3138a85fd7e6400f1ee9bccc4138b5cdeab0d6))

## [12.0.0-next.5](https://github.com/ng-packagr/ng-packagr/compare/v12.0.0-next.4...v12.0.0-next.5) (2021-03-17)


### Features

* support TypeScript 4.2 ([82c173c](https://github.com/ng-packagr/ng-packagr/commit/82c173cd2e0a2f315ee1b7d4b4037e866f1ff768))


### Bug Fixes

* process only the typings files of packages with NGCC ([9122e7f](https://github.com/ng-packagr/ng-packagr/commit/9122e7ffdfec64e7418791f88fbb42a318f8aa4e))

## [12.0.0-next.4](https://github.com/ng-packagr/ng-packagr/compare/v12.0.0-next.3...v12.0.0-next.4) (2021-03-04)


### Features

* add support for comments in JSON configuration file ([eb909bc](https://github.com/ng-packagr/ng-packagr/commit/eb909bc57c1b7c7e38726edc0849c1cf612a2ab0)), closes [#1896](https://github.com/ng-packagr/ng-packagr/issues/1896)

## [12.0.0-next.3](https://github.com/ng-packagr/ng-packagr/compare/v12.0.0-next.2...v12.0.0-next.3) (2021-02-23)


### Bug Fixes

* deprecate whitelistedNonPeerDependencies in favor of allowedNonPeerDependencies ([e7fc214](https://github.com/ng-packagr/ng-packagr/commit/e7fc2149f190fb131f3d21625c6c9eb253ede84a)), closes [#1884](https://github.com/ng-packagr/ng-packagr/issues/1884)
* removed default value from whitelistedNonPeerDependencies in json schema ([f0d38fc](https://github.com/ng-packagr/ng-packagr/commit/f0d38fc2185d0e9f4120565988b0dd70cda1de5b)), closes [#1892](https://github.com/ng-packagr/ng-packagr/issues/1892)
* replace `i` with checkmark when displaying a built entrypoint ([54b8968](https://github.com/ng-packagr/ng-packagr/commit/54b89684e751ba7b01d6ef4df2d2d4a203076a93)), closes [#1883](https://github.com/ng-packagr/ng-packagr/issues/1883)


### Performance

* reuse stylesheet processor ([2c6bb7d](https://github.com/ng-packagr/ng-packagr/commit/2c6bb7de7920b9f8597a6c4aff22958f796d87e5))

## [12.0.0-next.2](https://github.com/ng-packagr/ng-packagr/compare/v12.0.0-next.1...v12.0.0-next.2) (2021-02-18)


### Features

* add `postcss-preset-env` with stage 3 features ([0caf3db](https://github.com/ng-packagr/ng-packagr/commit/0caf3dbc2f88b759ecbca0fd3dbf06184e05388d)), closes [/preset-env.cssdb.org/features#stage-3](https://github.com/ng-packagr//preset-env.cssdb.org/features/issues/stage-3)


### Bug Fixes

* show error when template file is unreadable ([c0ba153](https://github.com/ng-packagr/ng-packagr/commit/c0ba1538f1665b8c5f8285795bf7df18f896f537))

## [12.0.0-next.1](https://github.com/ng-packagr/ng-packagr/compare/v12.0.0-next.0...v12.0.0-next.1) (2021-02-12)


### Features

* add support for Angular version 12 ([5fc70d0](https://github.com/ng-packagr/ng-packagr/commit/5fc70d0e8c7924a1e6687589a2c854b190165a09))


### Bug Fixes

* update @angular/cdk to version ~11.2.0 ([d96dbab](https://github.com/ng-packagr/ng-packagr/commit/d96dbab73594e107ca3ecb9c13c99a82158f4e5e))
* use `path.join` instead of `require.resolve` to resolve worker ([6a9a23d](https://github.com/ng-packagr/ng-packagr/commit/6a9a23d9c4ce7f43656c00a5746b088150b7003f)), closes [#1867](https://github.com/ng-packagr/ng-packagr/issues/1867)


### Performance

* use sync-rcp instead of execFileSync to transform async function to sync functions [#1872](https://github.com/ng-packagr/ng-packagr/issues/1872) ([9ccafb0](https://github.com/ng-packagr/ng-packagr/commit/9ccafb0156e9e9ff4ea1b3b4038f0bbb012eba54))

## [12.0.0-next.0](https://github.com/ng-packagr/ng-packagr/compare/v11.2.0...v12.0.0-next.0) (2021-02-11)


### ⚠ BREAKING CHANGES

* Node.js version 10 will become EOL on 2021-04-30.
Angular CLI 12 will require Node.js 12.13+ or 14.15+. Node.js 12.13 and 14.15 are the first LTS releases for their respective majors.

* update to use Node 12 APIs ([69ec8e2](https://github.com/ng-packagr/ng-packagr/commit/69ec8e2e4ff7466a91ef3ff64c14c2809f8ebb46))

## [11.2.0](https://github.com/ng-packagr/ng-packagr/compare/v11.1.4...v11.2.0) (2021-02-10)

### [11.1.4](https://github.com/ng-packagr/ng-packagr/compare/v11.1.3...v11.1.4) (2021-02-05)


### Bug Fixes

* remove optional dependency on tsickle ([d3e46ce](https://github.com/ng-packagr/ng-packagr/commit/d3e46ce87d599fe5d2bb3ff57a3c3802277c3f35))

### [11.1.3](https://github.com/ng-packagr/ng-packagr/compare/v11.1.2...v11.1.3) (2021-02-02)


### Bug Fixes

* ensure license entry point is properly built ([#1849](https://github.com/ng-packagr/ng-packagr/issues/1849)) ([ed6b15a](https://github.com/ng-packagr/ng-packagr/commit/ed6b15a1d009d5a9597a186417ece37018176c59))

### [11.1.2](https://github.com/ng-packagr/ng-packagr/compare/v11.1.1...v11.1.2) (2021-01-20)

### [11.1.1](https://github.com/ng-packagr/ng-packagr/compare/v11.1.0...v11.1.1) (2021-01-20)


### Bug Fixes

* await async process method ([361e43b](https://github.com/ng-packagr/ng-packagr/commit/361e43ba773021ef1b63525a67011c4e514a8ea8))

## [11.1.0](https://github.com/ng-packagr/ng-packagr/compare/v11.0.3...v11.1.0) (2021-01-20)


### Features

* add NGCC async integration ([232fb21](https://github.com/ng-packagr/ng-packagr/commit/232fb213d572294c5ea94280bd43e432e6d0995c))
* add stylesheet processor DI ([dedb3b3](https://github.com/ng-packagr/ng-packagr/commit/dedb3b3de41c16e85fde6e39626a858bb6d473c1))
* add support for using TypeScript 4.1 ([ffe3ab9](https://github.com/ng-packagr/ng-packagr/commit/ffe3ab935f83155cb7f5d0822902573ce96cdbe5))

### Bug Fixes

* add tsickle as optional peer dependency ([52f3988](https://github.com/ng-packagr/ng-packagr/commit/52f398887abb91db3901088a9f76e3911e88e5c6)), closes [#1801](https://github.com/ng-packagr/ng-packagr/issues/1801)
* changed assets not being copied during watch mode ([8d6664e](https://github.com/ng-packagr/ng-packagr/commit/8d6664e782bab40bfadd555dcdd9ef011b0104d6)), closes [#1826](https://github.com/ng-packagr/ng-packagr/issues/1826)
* set sourceRoot to empty string to correctly resolve dts sources ([94dd2d8](https://github.com/ng-packagr/ng-packagr/commit/94dd2d8881bc06696fbe8e6b67f9f8a8e761fa96))
* termination of process when using CTRL+C ([8f6c46e](https://github.com/ng-packagr/ng-packagr/commit/8f6c46ef4a8d418c37778b687f8f6bbb2d73f876))

### Performance

* only use ensureUnixPath when OS is Windows ([d4ed2b4](https://github.com/ng-packagr/ng-packagr/commit/d4ed2b44d3a7e3264e50c9e6786bb6b0c8197b39))

### [11.0.3](https://github.com/ng-packagr/ng-packagr/compare/v11.0.2...v11.0.3) (2020-11-21)


### Bug Fixes

* correctly resolve sourceRoot ([6673dbc](https://github.com/ng-packagr/ng-packagr/commit/6673dbcc7903ba766f44c44d6fb39967ef0f002e))

### [11.0.2](https://github.com/ng-packagr/ng-packagr/compare/v11.0.1...v11.0.2) (2020-11-12)


### Bug Fixes

* sourcemap should not differ based on build path ([1504c8e](https://github.com/ng-packagr/ng-packagr/commit/1504c8e06a64aee5b3ecc09327af25de5bd58385))
* Revert "fix: update @rollup/plugin-commonjs to version ^16.0.0"

### [11.0.1](https://github.com/ng-packagr/ng-packagr/compare/v11.0.0...v11.0.1) (2020-11-11)

## [11.0.0](https://github.com/ng-packagr/ng-packagr/compare/v11.0.0-rc.0...v11.0.0) (2020-11-11)


### Bug Fixes

* sourcemap should not differ based on build path ([6f946b7](https://github.com/ng-packagr/ng-packagr/commit/6f946b7c91c88fed1d6aa3fa6e06335d5769e86e))

## [11.0.0-rc.0](https://github.com/ng-packagr/ng-packagr/compare/v11.0.0-next.3...v11.0.0-rc.0) (2020-11-05)

## [11.0.0-next.3](https://github.com/ng-packagr/ng-packagr/compare/v11.0.0-next.2...v11.0.0-next.3) (2020-10-29)


### Features

* improve progress reporting ([3a9827f](https://github.com/ng-packagr/ng-packagr/commit/3a9827f6a8f0398a8c2f8e4ead8a02b9a2a13ffd))


### Bug Fixes

* update @rollup/plugin-commonjs to version ^16.0.0 ([75e5d51](https://github.com/ng-packagr/ng-packagr/commit/75e5d51e4260d2c514cb8492f5d53b925d2cef25))
* update @rollup/plugin-node-resolve to version ^10.0.0 ([e76b97b](https://github.com/ng-packagr/ng-packagr/commit/e76b97b0a736fcfdfc7e8d0abd5c317a352cf856))

## [11.0.0-next.2](https://github.com/ng-packagr/ng-packagr/compare/v11.0.0-next.1...v11.0.0-next.2) (2020-10-22)


### ⚠ BREAKING CHANGES

* TypeScript 3.9 is no longer supported, please upgrade to TypeScript 4.0.


## [11.0.0-next.1](https://github.com/ng-packagr/ng-packagr/compare/v11.0.0-next.0...v11.0.0-next.1) (2020-10-14)


### Bug Fixes

* clear analysis cache to detect invalid imports in watch mode ([d6a3920](https://github.com/ng-packagr/ng-packagr/commit/d6a39203bb0fdbe1b5465355261a0c3b0a2c7501))


### Performance

* initialize ajv validator only once ([24f4b83](https://github.com/ng-packagr/ng-packagr/commit/24f4b8382edd5ee12c7c32a621fc15931dcf22ec))
* short-circuit ngcc processing across entry-points ([599b742](https://github.com/ng-packagr/ng-packagr/commit/599b742b45f902e1402d4e9ac046a4223530be6b))
* use set semantics when computing which entry-points to recompile ([f0f52c7](https://github.com/ng-packagr/ng-packagr/commit/f0f52c744c2b9e9b7977c2f11c28686ccb5a3e85))
* use shared module resolution cache across all entry-points ([954ae79](https://github.com/ng-packagr/ng-packagr/commit/954ae797581e80969456c803f5d7467ad5403239))
