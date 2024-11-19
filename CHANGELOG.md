# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 19.0.0 (2024-11-19)


### ⚠ BREAKING CHANGES

* Node.js support for versions <18.19.1 and <20.11.1 has been removed.
* TypeScript versions before 5.2 are no longer supported.
* Several changes to the Angular Package Format (APF)
- Removal of FESM2015
- Replacing ES2020 with ES2022
- Replacing FESM2020 with FESM2022
* * TypeScript 4.8 is no longer supported.
* Node.js v14 support has been removed

Node.js v14 is planned to be End-of-Life on 2023-04-30. Angular will stop supporting Node.js v14 in Angular v16. Angular v16 will continue to officially support Node.js versions v16 and v18.
* NGCC integration has been removed and as a result Angular View Engine libraries will no longer work.
* ng-packagr no longer supports Node.js versions `14.[15-19].x` and `16.[10-12].x`. Current supported versions of Node.js are `14.20.x`, `16.13.x` and `18.10.x`.
* TypeScript versions older than 4.8.2 are no longer supported.
* Deprecated support for Stylus has been removed. The Stylus package has never reached a stable version and it's usage in the ng-packagr is minimal. It's recommended to migrate to another CSS preprocessor that the ng-packagr supports.
* `package.json` is not longer a valid method to configure ng-packagr. Use `ng-package.json` instead.
* `entryFile` can no longer be named `index.ts` as it will conflict with the generated `index.d.ts`. Please rename
* Support for TypeScript 4.4 and 4.5 has been removed. Please update to TypeScript 4.6.
* Support for Node.js v12 has been removed as it will become EOL on 2022-04-30. Please use Node.js v14.15 or later.
* Support for `node-sass`  has been removed. sass will be used by default to compile SASS and SCSS files.
* TypeScript versions prior to 4.4 are no longer supported.
* Compilation of libraries using VIew Engine is no longer supported.
* We no longer generate UMD bundles. The below options which were used for UMD bundle generation has also been removed;

- `umdModuleIds`
- `amdId`
- `umdId`
* Bundling of dependencies has been removed without replacement. In many cases this was used incorrectly which drastically increase in size. This was also mainly used for UMD bundles which will be removed in future.
* Minified UMD bundles are no longer generated.
* During `watch` mode we no longer generate UMD bundles.
* Node.js version 10 will become EOL on 2021-04-30.
Angular CLI 12 will require Node.js 12.13+ or 14.15+. Node.js 12.13 and 14.15 are the first LTS releases for their respective majors.
* TypeScript 3.9 is no longer supported, please upgrade to TypeScript 4.0.
* `cssUrl` option default value has been changed to `inline`
More info about this option can be found: https://github.com/ng-packagr/ng-packagr/blob/master/docs/embed-assets-css.md
* TypeScript 3.8 is no longer supported, please update to TypeScript 3.9
* Deprecated `jsx` and `languageLevel` has been removed, Set these options in your `tsconfig.json` instead.
* Remove usage of deprecated `less-plugin-npm-import`. In less v3 is supports node_modules resolutions by default.

Before
```css
@import '~module/less/linenumbers';
```

After
```css
@import 'module/less/linenumbers';
```
* TypeScript versions prior to 3.6.4 are no longer supported.no longer supported.
* `tslib` will be longer be added as a `dependencies`, but rather it will be added as a `peerDependencies`.

This is to be inline with the Angular framework as per
* Users outside of Google don't usually need closure annotations hence `annotateForClosureCompiler` is turned off by default. In case users want to emit closure compatable code. they need to install `tsickle` and enable opt it this feature.
* The following `peerDependencies` are now required
- `tslib: ^1.9.0`
- `typescript: ^2.7.0`

The default for `lib.languageLevel`  is now `es2018`. In case this needs to be changed. This can to be done by overriding the tsconfig. More on how to override the tsconfig can be found here: https://github.com/dherges/ng-packagr/blob/master/docs/override-tsconfig.md
* - ng-packagr now requires a `peerDependency` of `@angular/compiler: ^6.0.0` and `@angular/compiler-cli: ^6.0.0`. Removes support for building packages with Angular compiler v5.
- Consumers using a constum tsconfig via the programmatic API need to add `enableResourceInlining` under `angularCompilerOptions`
* UMD module ids for rxjs v5 are now longer provided out-ot-the-box. Users whishing to a build library for rxjs@5 (potentially relying on rxjs-compat), must provide the UMD module IDs in the ngPackage.lib.umdModuleIds section. Please take a look at the changeset of PR #840 to see what the UMD module IDs used to be for v5.
* `baseUrl` in `tsconfig` is not overridden anymore, thus non-relative module paths will be resolved relative to the `baseUrl` in `tsconfig.json`
* Removes several deprecated code items.

- option `sassIncludePaths` is removed, please use `styleIncludePaths` instead
- option `workingDirectory` is removed, removed corresponding getter from `NgPackage` class
- method `createNgPackage` removed from programmatic API
- removed `NgArtefacts` class from API
- removed `BuildStep` interface from API
* There were some important changes, mainly related to `rollup`, most of the options and functionality provided by `rollup` plugins (comments & license) have been removed, due to the fact this is not inline with APF V6 as one will end up with different outputs in different modules.

- **`comments` option has been removed** 
- **`licensePath` option has been removed** 

In APF V6, it is recommanded to not embed dependencies due to the fact that it will end up having multiple copies of the same library in a single application.

- **`embedded` option has been removed and the original functionality was dropped** as it increased the chance of having 2 copies of the same library. The recommended migration is to switch to `bundledDependencies`

More info in the APF v6 spec: https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview

Documentation on npm bundled dependencies: http://npm.github.io/using-pkgs-docs/package-json/types/bundleddependencies.html 
* `lib.externals` has been removed in favour of `lib.umdModuleIds` which is now just used to provide the UMD module identifiers of external dependencies.
By default, all dependencies are now treated as externals and thus are not embedded in the final bundle.
If a dependency should be embedded in the distributables, it needs to be explicity added to `lib.embedded`.
Please consult the updated README on migrating your package confguration from `lib.externals` to `lib.umdModuleIds` and `lib.embedded`.
* the default config file is renamed from `.ng-packagr.json` to `ng-package.json`. Use one `ng-package.json` per each Angular library project.

### Features

* (APF) Angular Package Format updates ([4ae531c](https://github.com/ng-packagr/ng-packagr/commit/4ae531c60c122b41c12b5c57d7db0245ce751a96))
* [@angular](https://github.com/angular) and rxjs rollup globals ([58702e3](https://github.com/ng-packagr/ng-packagr/commit/58702e394dc32f6771de9905d3cd5851415e2016))
* `styleIncludePaths` for feature parity with Angular CLI ([#603](https://github.com/ng-packagr/ng-packagr/issues/603)) ([ab973f4](https://github.com/ng-packagr/ng-packagr/commit/ab973f401589111116f3a2c2ca6a780e34b25c3a)), closes [#282](https://github.com/ng-packagr/ng-packagr/issues/282)
* add  and  version  as peerDependencies ([97c5fec](https://github.com/ng-packagr/ng-packagr/commit/97c5fecfcc7d4069e6aa7da3270c16bacba237c3))
* add `"sideEffects": false` flag to dist-ready package.json ([#776](https://github.com/ng-packagr/ng-packagr/issues/776)) ([11535bb](https://github.com/ng-packagr/ng-packagr/commit/11535bbf4484d94050949a7a4a6b90cf2992d262))
* add `deleteDestPath` option ([#655](https://github.com/ng-packagr/ng-packagr/issues/655)) ([61922c1](https://github.com/ng-packagr/ng-packagr/commit/61922c1197a03e671ccbd13e290594196b493a4d)), closes [#632](https://github.com/ng-packagr/ng-packagr/issues/632)
* add `postcss-preset-env` with stage 3 features ([0caf3db](https://github.com/ng-packagr/ng-packagr/commit/0caf3dbc2f88b759ecbca0fd3dbf06184e05388d)), closes [/preset-env.cssdb.org/features#stage-3](https://github.com/ng-packagr//preset-env.cssdb.org/features/issues/stage-3)
* add `sass` option ([c85df4f](https://github.com/ng-packagr/ng-packagr/commit/c85df4ff489258a1723a4b8c4ffd78c9ef63c1d5))
* add `TypeScript` version 3 as a `peerDependency` ([5f0b761](https://github.com/ng-packagr/ng-packagr/commit/5f0b761402578aabeaf521c8b19a36ffec1f8e5f))
* add `watch` and `buildAsObservable` methods ([#982](https://github.com/ng-packagr/ng-packagr/issues/982)) ([6975192](https://github.com/ng-packagr/ng-packagr/commit/697519277bdc669489f446390099a045e6604bc8))
* add a option to pass a custom `tsconfig` in `CLI` ([cb6a980](https://github.com/ng-packagr/ng-packagr/commit/cb6a980bf46825fa6070aae9df9eefa5e8e49701))
* add compilation mode in build logs ([4959f8b](https://github.com/ng-packagr/ng-packagr/commit/4959f8b6b9856d5a3939cddb49523a1d74a6d1ff)), closes [#1991](https://github.com/ng-packagr/ng-packagr/issues/1991)
* add es2020 conditional export ([e5d4296](https://github.com/ng-packagr/ng-packagr/commit/e5d4296f7b755f6805270eb3b6100dcf66003333))
* add esm2020 conditions in APF package exports ([ed79b27](https://github.com/ng-packagr/ng-packagr/commit/ed79b27ff69378fa2796d81626969292c27d1da9))
* add Graph and Node API for angular transforms ([#644](https://github.com/ng-packagr/ng-packagr/issues/644)) ([92e6082](https://github.com/ng-packagr/ng-packagr/commit/92e60820706a58c3b2627b96a25d787c49c02d56))
* add json schema for `package.json` with custom `ngPackage` property ([#173](https://github.com/ng-packagr/ng-packagr/issues/173)) ([dd85fd2](https://github.com/ng-packagr/ng-packagr/commit/dd85fd26f231838c99a1802f6dcf01621b5060fe)), closes [#169](https://github.com/ng-packagr/ng-packagr/issues/169)
* add language level support for library authors ([#486](https://github.com/ng-packagr/ng-packagr/issues/486)) ([b33e0bc](https://github.com/ng-packagr/ng-packagr/commit/b33e0bcc43fc16429af37be32666c9d1ef449e5b))
* add NGCC async integration ([232fb21](https://github.com/ng-packagr/ng-packagr/commit/232fb213d572294c5ea94280bd43e432e6d0995c))
* add node-sass support with sass as default ([43a0be6](https://github.com/ng-packagr/ng-packagr/commit/43a0be6733e80e8417fe6c828b7bf542f88de4a2))
* add option `cssUrl`, inline css `url:()` to `data:` URIs ([#345](https://github.com/ng-packagr/ng-packagr/issues/345)) ([1c71f24](https://github.com/ng-packagr/ng-packagr/commit/1c71f249d59a6e51f2a273114aad4f566bca01f1)), closes [#263](https://github.com/ng-packagr/ng-packagr/issues/263)
* add package exports for node and es2015 ([bd986f6](https://github.com/ng-packagr/ng-packagr/commit/bd986f6e737239a82b934f4f88b9d648fb496d29))
* add rollup commonjs plugin to support all library types ([#121](https://github.com/ng-packagr/ng-packagr/issues/121)) ([3f87f5e](https://github.com/ng-packagr/ng-packagr/commit/3f87f5e9d64a8248fa726801c2843e73079ca004))
* add rxjs mapTo operator to rollup globals ([#293](https://github.com/ng-packagr/ng-packagr/issues/293)) ([1a42ce1](https://github.com/ng-packagr/ng-packagr/commit/1a42ce10dc2bdac02de88a2ea0d5550356e3a57d))
* add stylesheet processor DI ([dedb3b3](https://github.com/ng-packagr/ng-packagr/commit/dedb3b3de41c16e85fde6e39626a858bb6d473c1))
* add stylus preprocessor support ([#120](https://github.com/ng-packagr/ng-packagr/issues/120)) ([19933cd](https://github.com/ng-packagr/ng-packagr/commit/19933cd4feb9e8a4b9cc99f870a71a006883497f))
* add support for `~` import syntax for `less` ([#1036](https://github.com/ng-packagr/ng-packagr/issues/1036)) ([bd7c529](https://github.com/ng-packagr/ng-packagr/commit/bd7c5295fe2ba624783020b8a24adc57907416c8)), closes [#827](https://github.com/ng-packagr/ng-packagr/issues/827) [#227](https://github.com/ng-packagr/ng-packagr/issues/227)
* add support for `resolveJsonModule` ([1bf8eaf](https://github.com/ng-packagr/ng-packagr/commit/1bf8eaf589b41208000c459deb613bdb40e2cb6b)), closes [#1050](https://github.com/ng-packagr/ng-packagr/issues/1050)
* add support for AMD module id in umd bundles ([#675](https://github.com/ng-packagr/ng-packagr/issues/675)) ([59713b8](https://github.com/ng-packagr/ng-packagr/commit/59713b843248976a4164db6a8d56c99c6d560a41))
* add support for Angular 16.2.0 ([3c1072e](https://github.com/ng-packagr/ng-packagr/commit/3c1072e97c163d21e75883a3aa78c922566208ee))
* add support for Angular 17 ([cbb06ee](https://github.com/ng-packagr/ng-packagr/commit/cbb06eeffa1ab36cbf9a22ed55a6ddcdcb57a33a))
* add support for Angular 18 ([9bef232](https://github.com/ng-packagr/ng-packagr/commit/9bef232ff24d0de5a47977b30a3c66af6f8eb6f9))
* add support for Angular 8 and TypeScript 3.3 ([dfe5a27](https://github.com/ng-packagr/ng-packagr/commit/dfe5a27aecd7646d188763c453994a8eaf2a1982))
* add support for Angular version 10 ([cb984cd](https://github.com/ng-packagr/ng-packagr/commit/cb984cd161a3e7991a87dcd1315adfee10ae33ec))
* add support for Angular version 12 ([5fc70d0](https://github.com/ng-packagr/ng-packagr/commit/5fc70d0e8c7924a1e6687589a2c854b190165a09))
* add support for comments in JSON configuration file ([eb909bc](https://github.com/ng-packagr/ng-packagr/commit/eb909bc57c1b7c7e38726edc0849c1cf612a2ab0)), closes [#1896](https://github.com/ng-packagr/ng-packagr/issues/1896)
* add support for dynamic import ([7226bb1](https://github.com/ng-packagr/ng-packagr/commit/7226bb101db0e918571f375cd3b0a9a39182ffdc)), closes [#2508](https://github.com/ng-packagr/ng-packagr/issues/2508)
* add support for incremental builds ([#884](https://github.com/ng-packagr/ng-packagr/issues/884)) ([fbbb434](https://github.com/ng-packagr/ng-packagr/commit/fbbb434f7919432ba6a20571b42d9fd24685451c)), closes [#828](https://github.com/ng-packagr/ng-packagr/issues/828) [#743](https://github.com/ng-packagr/ng-packagr/issues/743) [#635](https://github.com/ng-packagr/ng-packagr/issues/635)
* add support for Ivy libraries ([b6dfcf6](https://github.com/ng-packagr/ng-packagr/commit/b6dfcf616bc5312d98df04d9cb579fda4383da70))
* add support for Node.js version 18 ([e70e3a3](https://github.com/ng-packagr/ng-packagr/commit/e70e3a3547cfdb131608d6a015c528ca64bde629)), closes [angular/angular-cli#24026](https://github.com/angular/angular-cli/issues/24026)
* add support for package.json exports ([047e3ca](https://github.com/ng-packagr/ng-packagr/commit/047e3cac2beb15d5b62e016e3c0b64f26bba43aa))
* add support for polling ([2c7f75b](https://github.com/ng-packagr/ng-packagr/commit/2c7f75bec709c870398d332cf3af9285f079f9d1))
* add support for tailwindcss ([fdc0707](https://github.com/ng-packagr/ng-packagr/commit/fdc07079cb2f2f947a72176011e02c7fa2a3c2fa)), closes [#1943](https://github.com/ng-packagr/ng-packagr/issues/1943)
* add support for tsickle to 0.34.0 ([3b67d90](https://github.com/ng-packagr/ng-packagr/commit/3b67d908d43d65e1e49ae9d1491865301f6c1bf5))
* add support for TypeScript 3.1 ([c354261](https://github.com/ng-packagr/ng-packagr/commit/c35426136b02100149a0919270d6956d77b3631c))
* add support for TypeScript 3.2 ([9e6ee67](https://github.com/ng-packagr/ng-packagr/commit/9e6ee67ff49213b76cc086c3c632c54486f79ca2))
* add support for TypeScript 3.4 ([828065c](https://github.com/ng-packagr/ng-packagr/commit/828065c47bc9ac37339be9804d924f6211b15998))
* add support for typescript 3.5 and Angular 8.X pre-releases ([798de61](https://github.com/ng-packagr/ng-packagr/commit/798de61517c822a067cc98c6d2b897cb6d80c46c))
* add support for typescript 3.7 ([9e05fb3](https://github.com/ng-packagr/ng-packagr/commit/9e05fb3c70c812d1ac9d72c36789bbff1c967a90))
* add support for TypeScript 3.8 ([4a388af](https://github.com/ng-packagr/ng-packagr/commit/4a388afbf6a84767652df3fddcf63f3d7e0515b6))
* add support for TypeScript 4 ([eb8b0c2](https://github.com/ng-packagr/ng-packagr/commit/eb8b0c2553aa1847f4ab42f29a1a25e67f644d29))
* add support for TypeScript 4.3 ([d6cabcf](https://github.com/ng-packagr/ng-packagr/commit/d6cabcf4f9ca2a320ee7998d2116be68d00b9c49))
* add support for TypeScript 4.5 ([b4d3f5c](https://github.com/ng-packagr/ng-packagr/commit/b4d3f5c68dbee60806f1e75e2afa85fdcdb487ad))
* add support for TypeScript 4.8 ([387a4e1](https://github.com/ng-packagr/ng-packagr/commit/387a4e146f7fea2706ca5e9be015dd9fe0ff9817))
* add support for TypeScript 5 ([1d4cc04](https://github.com/ng-packagr/ng-packagr/commit/1d4cc045c643150c03913df6fc7f5df2f7506792))
* add support for TypeScript 5.5 ([ae2a698](https://github.com/ng-packagr/ng-packagr/commit/ae2a698fa51f9c69824ec8a4e125f67bfe358ff0))
* add support for using TypeScript 4.1 ([ffe3ab9](https://github.com/ng-packagr/ng-packagr/commit/ffe3ab935f83155cb7f5d0822902573ce96cdbe5))
* add support to TypeScript 3.6 ([342b799](https://github.com/ng-packagr/ng-packagr/commit/342b799f8e45009b7d0fbce06dd0187e146c58cd))
* add tslib as peerDepedency ([5077f87](https://github.com/ng-packagr/ng-packagr/commit/5077f87701eb8c3ff638d51559445e988db40576))
* add tsx/jsx support ([#228](https://github.com/ng-packagr/ng-packagr/issues/228)) ([4068664](https://github.com/ng-packagr/ng-packagr/commit/406866497acba4eec1dd2890bd99c381cbc6b3f2))
* add update notifier to cli ([#649](https://github.com/ng-packagr/ng-packagr/issues/649)) ([f5c4afc](https://github.com/ng-packagr/ng-packagr/commit/f5c4afcdc7b6090c13559840ae42465920415c2a))
* Added less support ([06d7f84](https://github.com/ng-packagr/ng-packagr/commit/06d7f84ba83b6564350c13c4b175fa90253032f0))
* align distributed files with `Angular Package Format v5.0` ([#322](https://github.com/ng-packagr/ng-packagr/issues/322)) ([fff712a](https://github.com/ng-packagr/ng-packagr/commit/fff712a5db3bc59704b95961b43cffc34a5d9b6d)), closes [#257](https://github.com/ng-packagr/ng-packagr/issues/257) [#319](https://github.com/ng-packagr/ng-packagr/issues/319) [#321](https://github.com/ng-packagr/ng-packagr/issues/321)
* allow Angular 6 as a peer dependency ([#714](https://github.com/ng-packagr/ng-packagr/issues/714)) ([530d54e](https://github.com/ng-packagr/ng-packagr/commit/530d54e1d7389a202a405a55886d5455caaa7b63))
* allow empty package.json for 2ndary entries ([c0af605](https://github.com/ng-packagr/ng-packagr/commit/c0af605d7c68c86c6a1141374086fb558f3749c4))
* allow publishing of Ivy library in partial mode. ([c7040e8](https://github.com/ng-packagr/ng-packagr/commit/c7040e88939b8d316dcc55c3ce654abab7cd49cf)), closes [#1901](https://github.com/ng-packagr/ng-packagr/issues/1901)
* allow to override umd module identifier ([#683](https://github.com/ng-packagr/ng-packagr/issues/683)) ([b6e099f](https://github.com/ng-packagr/ng-packagr/commit/b6e099f7c55f66ff11413224daeeb0b1caba9e01))
* analyse typescript dependencies of an entry point ([#648](https://github.com/ng-packagr/ng-packagr/issues/648)) ([749d48b](https://github.com/ng-packagr/ng-packagr/commit/749d48b8d71233b00245daf628ba0d5e21b4c90e))
* app support for Angular 17.1 ([ce11810](https://github.com/ng-packagr/ng-packagr/commit/ce118106650ada305df86256260d38425ff1381c))
* autoprefixer / postcss support ([4115ad1](https://github.com/ng-packagr/ng-packagr/commit/4115ad1c1256fb846f4b0fe7cf55ce86fd313d7f)), closes [#54](https://github.com/ng-packagr/ng-packagr/issues/54)
* build only entrypoints that are effected by the change ([#991](https://github.com/ng-packagr/ng-packagr/issues/991)) ([1f79aa2](https://github.com/ng-packagr/ng-packagr/commit/1f79aa275596b209141cdf444f03ba8c11037b7b)), closes [#974](https://github.com/ng-packagr/ng-packagr/issues/974)
* bump angular/[@tsc-wrapped](https://github.com/tsc-wrapped) to ^4.4.5 and [@typescript](https://github.com/typescript) to ^2.3.4 ([#200](https://github.com/ng-packagr/ng-packagr/issues/200)) ([b2b369a](https://github.com/ng-packagr/ng-packagr/commit/b2b369a4a296ffdc9bdb3ec12b640ae2b754a323))
* clarify argument type of compileNgcTransformFactory ([643d3d5](https://github.com/ng-packagr/ng-packagr/commit/643d3d51d60e096d67e77a2141269a05df993eef))
* cli command `ng-packagr` for npm script users ([6d4a90e](https://github.com/ng-packagr/ng-packagr/commit/6d4a90efd265cb92bc7b3e691c63fdafffb7b800))
* comments cleanup and license header file ([#574](https://github.com/ng-packagr/ng-packagr/issues/574)) ([0237f24](https://github.com/ng-packagr/ng-packagr/commit/0237f2423457122bf2497740b36529bc855654fe)), closes [#362](https://github.com/ng-packagr/ng-packagr/issues/362)
* configuratin with `.ng-packagr.json` file ([c1762b3](https://github.com/ng-packagr/ng-packagr/commit/c1762b355d82164ca896096ddaa84acbdfa82b86))
* consistent `flatModuleFile` naming for bundles ([#361](https://github.com/ng-packagr/ng-packagr/issues/361)) ([17b4e0f](https://github.com/ng-packagr/ng-packagr/commit/17b4e0f3f72f96262541d76f732f53c4b3b84dab))
* copies `CHANGELOG.md` to package destination ([db5ad68](https://github.com/ng-packagr/ng-packagr/commit/db5ad6851e3200af2dde4af99417443767d285b1))
* create a tarball (dist.tgz) for the npm package ([#715](https://github.com/ng-packagr/ng-packagr/issues/715)) ([94bc915](https://github.com/ng-packagr/ng-packagr/commit/94bc91513767e965778df299862b7d28428a2491))
* default config file `ng-package.json` ([#10](https://github.com/ng-packagr/ng-packagr/issues/10)) ([00fa15c](https://github.com/ng-packagr/ng-packagr/commit/00fa15cd89d37b8406faf4a59ed56eea218de422))
* demo library ([2cb2066](https://github.com/ng-packagr/ng-packagr/commit/2cb20663a170a4e885aa5d7c2bcb232cec69927d))
* deprecate inlining of `bundledDependencies` ([0c52486](https://github.com/ng-packagr/ng-packagr/commit/0c52486ba0f55c797c9905711a586865df7df899))
* disable Ivy in default tsconfig ([f50dd2f](https://github.com/ng-packagr/ng-packagr/commit/f50dd2f132b9512b684b392a084628a1863bd231))
* discover entry points from user packages ([#383](https://github.com/ng-packagr/ng-packagr/issues/383)) ([4a7e96e](https://github.com/ng-packagr/ng-packagr/commit/4a7e96e5cafdb9d03a65cda108165437e96efa9f)), closes [#190](https://github.com/ng-packagr/ng-packagr/issues/190)
* do not generate UMDs ([cc59146](https://github.com/ng-packagr/ng-packagr/commit/cc5914659973a3c9e6dc04e2c038457923afae82)), closes [#2023](https://github.com/ng-packagr/ng-packagr/issues/2023) [#2000](https://github.com/ng-packagr/ng-packagr/issues/2000) [#1757](https://github.com/ng-packagr/ng-packagr/issues/1757) [#1674](https://github.com/ng-packagr/ng-packagr/issues/1674)
* do not prune working directory on build failure ([6445316](https://github.com/ng-packagr/ng-packagr/commit/6445316f87af1aa543cca69412aa53868fab9706))
* downlevel es2020 bundle to generate FESM2015 ([6cf2514](https://github.com/ng-packagr/ng-packagr/commit/6cf251460e58dc430416922429d2f2dcb6a48a9c))
* drop support for node v6 and v7 (no longer supported by devkit) ([ee7e65d](https://github.com/ng-packagr/ng-packagr/commit/ee7e65d8e9f2268cc5563a75e5400dd5a1bf234c))
* drop support for node-sass ([34d805d](https://github.com/ng-packagr/ng-packagr/commit/34d805d9e96bd05888043010eb874986d7820feb))
* drop support for Node.js 12 ([181ac25](https://github.com/ng-packagr/ng-packagr/commit/181ac25f831e5e56c2eda357f72c2a46ab0abff2))
* drop support for TypeScript 4.6 and 4.7 ([56d9a85](https://github.com/ng-packagr/ng-packagr/commit/56d9a8558cbc4efa17e7e7e965dea046de90dba7))
* drop support for TypeScript versions before 5.2 ([72500c3](https://github.com/ng-packagr/ng-packagr/commit/72500c32dbef977d347022fbe6898ec829143bb1))
* dynamic rollup configuration for esm flattening ([#395](https://github.com/ng-packagr/ng-packagr/issues/395)) ([5712429](https://github.com/ng-packagr/ng-packagr/commit/5712429e1185c23f77c70990590fdd21bd7edbae))
* dynamic secondary entry points ([5922cb1](https://github.com/ng-packagr/ng-packagr/commit/5922cb179d611333d6808c19c168ae5894296da2))
* each Angular package is reflected in one `ng-package.json` file ([#8](https://github.com/ng-packagr/ng-packagr/issues/8)) ([b8d0649](https://github.com/ng-packagr/ng-packagr/commit/b8d0649ad22593ebcc29ff9994a8de6816653078))
* embed assets in css file using data uri by default ([d2a5731](https://github.com/ng-packagr/ng-packagr/commit/d2a573184dca47fbb0b0042614444e74e7e304b2))
* embed templates and stylesheets with ngc `enableResourceInlining` ([#872](https://github.com/ng-packagr/ng-packagr/issues/872)) ([2655def](https://github.com/ng-packagr/ng-packagr/commit/2655defd9bce751955acc41212355544195ed452)), closes [#770](https://github.com/ng-packagr/ng-packagr/issues/770)
* emit Javascript files with `.mjs` extension ([95166f3](https://github.com/ng-packagr/ng-packagr/commit/95166f3917e9674b5fd17d4868df71e497646c7f))
* enable `fullTemplateTypeCheck` ([#826](https://github.com/ng-packagr/ng-packagr/issues/826)) ([83f2cb6](https://github.com/ng-packagr/ng-packagr/commit/83f2cb6fab0b1347aacdb326cd4afb92b68e67c2))
* enable custom `sassIncludePaths` for resolving scss imports ([#494](https://github.com/ng-packagr/ng-packagr/issues/494)) ([f8e8dc5](https://github.com/ng-packagr/ng-packagr/commit/f8e8dc571c66b23cbc734ade562823afe2cd5934))
* enable Ivy partial compilations by default ([46133d9](https://github.com/ng-packagr/ng-packagr/commit/46133d98630e137764e0daf8a4eddaf98ac159e1)), closes [#1087](https://github.com/ng-packagr/ng-packagr/issues/1087) [#382](https://github.com/ng-packagr/ng-packagr/issues/382) [#285](https://github.com/ng-packagr/ng-packagr/issues/285) [#317](https://github.com/ng-packagr/ng-packagr/issues/317) [#355](https://github.com/ng-packagr/ng-packagr/issues/355) [#656](https://github.com/ng-packagr/ng-packagr/issues/656) [#917](https://github.com/ng-packagr/ng-packagr/issues/917)
* enable providing cache directory and disabling caching via options ([7d6ee38](https://github.com/ng-packagr/ng-packagr/commit/7d6ee382daa5963a1e2e9f14670a657a53e363a5))
* enable tsconfig customization thru the programmatic API ([#517](https://github.com/ng-packagr/ng-packagr/issues/517)) ([8b04d44](https://github.com/ng-packagr/ng-packagr/commit/8b04d44c37bce19c61dc20794c49afc17d7ef43c)), closes [#256](https://github.com/ng-packagr/ng-packagr/issues/256)
* enable tslib `importHelpers`, reducing bundle sizes ([#338](https://github.com/ng-packagr/ng-packagr/issues/338)) ([f1e4cf6](https://github.com/ng-packagr/ng-packagr/commit/f1e4cf6fb2e8cadde0c784c9a623a7c14bfc0e5b))
* esbuild can't resolve secondary entry point from library ([29f417e](https://github.com/ng-packagr/ng-packagr/commit/29f417eecddfc79d894e362da1524be3be6ee6ce))
* exclude node_modules from being copied to working dir ([#60](https://github.com/ng-packagr/ng-packagr/issues/60)) ([6bfe713](https://github.com/ng-packagr/ng-packagr/commit/6bfe713a9fb35f71f9daba37d91ddc695ac36cab)), closes [#51](https://github.com/ng-packagr/ng-packagr/issues/51) [#51](https://github.com/ng-packagr/ng-packagr/issues/51) [/github.com/dherges/ng-packagr/issues/51#issuecomment-307148324](https://github.com/ng-packagr//github.com/dherges/ng-packagr/issues/51/issues/issuecomment-307148324)
* expand api to `.withTsConfig(string|TsConfig)`, `.forProject()` ([#561](https://github.com/ng-packagr/ng-packagr/issues/561)) ([48f3569](https://github.com/ng-packagr/ng-packagr/commit/48f35692c381ca823163d3451398f93a836de2b9)), closes [#557](https://github.com/ng-packagr/ng-packagr/issues/557)
* export and test public api surface ([#584](https://github.com/ng-packagr/ng-packagr/issues/584)) ([6858e2e](https://github.com/ng-packagr/ng-packagr/commit/6858e2e3711044d25437178e5466991e56fa5424))
* expose `build` and `version` commands from public API ([#447](https://github.com/ng-packagr/ng-packagr/issues/447)) ([286819c](https://github.com/ng-packagr/ng-packagr/commit/286819ce7165cc22d5becdfc2daeee040b90baa4))
* expose a public API surface for programmatic usage ([ec2b29f](https://github.com/ng-packagr/ng-packagr/commit/ec2b29f05ec91a89d4baed589f03562730367a83))
* expose programmatic API and typings ([#342](https://github.com/ng-packagr/ng-packagr/issues/342)) ([61c7b50](https://github.com/ng-packagr/ng-packagr/commit/61c7b50b38c5fd3c3cb13cca69e94fd8f94cfdab)), closes [#341](https://github.com/ng-packagr/ng-packagr/issues/341)
* external dependencies from `@angular/cdk` are supported by default ([4b20e29](https://github.com/ng-packagr/ng-packagr/commit/4b20e29a37aadee4b570ca306ac7330badc8ec2d))
* help command on cli ([c68a190](https://github.com/ng-packagr/ng-packagr/commit/c68a190ad1ef3f77ad913f058647d4b89acae221))
* implement `ng-packagr` ([8474e36](https://github.com/ng-packagr/ng-packagr/commit/8474e36e433ca6db5b248526316108bae23c4dba))
* implement `transformSources()` w/ domain model ([#356](https://github.com/ng-packagr/ng-packagr/issues/356)) ([89ce2ce](https://github.com/ng-packagr/ng-packagr/commit/89ce2ce4d36bc0b6230028915d4e7d23a643af6c))
* implement build steps with updated `ng-package.json` ([259a9fc](https://github.com/ng-packagr/ng-packagr/commit/259a9fc2cf13ae29b9d2d1752300069bce60da37))
* import scss files with "~" syntax from node_modules ([#67](https://github.com/ng-packagr/ng-packagr/issues/67)) ([205bbc0](https://github.com/ng-packagr/ng-packagr/commit/205bbc0765372a8bf861b9b5497aed47efccc984))
* improve progress reporting ([3a9827f](https://github.com/ng-packagr/ng-packagr/commit/3a9827f6a8f0398a8c2f8e4ead8a02b9a2a13ffd))
* include `@angular/router` in default rollup opts ([3d576ee](https://github.com/ng-packagr/ng-packagr/commit/3d576eec4b681cec09f93e0e5a513c6ce4a8b1c3))
* Initial proof-of-concept compilation ([91880b9](https://github.com/ng-packagr/ng-packagr/commit/91880b9f127286a34f40d098dbdbbce18719266a))
* invoke ngc thru `@angular/compiler-cli` version 5.0.x ([c5c32c5](https://github.com/ng-packagr/ng-packagr/commit/c5c32c55fcefddea49a5091fed647d5c0b6136f4)), closes [#219](https://github.com/ng-packagr/ng-packagr/issues/219)
* JSON schema for `ng-package.json` ([76dd2ff](https://github.com/ng-packagr/ng-packagr/commit/76dd2ff13b5e909781edbf3bf9fccbc03ff6b821))
* le jardin, a broccoli-inspired rewrite ([#572](https://github.com/ng-packagr/ng-packagr/issues/572)) ([6efc2d2](https://github.com/ng-packagr/ng-packagr/commit/6efc2d20d801137bf8cfa63bb9e8a928640ff3b0))
* lib.externals support. ([c226972](https://github.com/ng-packagr/ng-packagr/commit/c22697215c4b4a78dded10e286c1a66a7444f0af))
* minify UMD bundles ([#205](https://github.com/ng-packagr/ng-packagr/issues/205)) ([c58689b](https://github.com/ng-packagr/ng-packagr/commit/c58689bb0007eb5f34baaf756c526ee36f54ff72))
* ng-packagr is released 1.0.0 final ([665a249](https://github.com/ng-packagr/ng-packagr/commit/665a24981af6edf308b48dad2814cfdf2cbee831))
* produce source maps in Angular Package ([bc84b54](https://github.com/ng-packagr/ng-packagr/commit/bc84b54d3e63ad2a9b4233221a2b2441d7151322))
* provide more frequent console feedback ([#212](https://github.com/ng-packagr/ng-packagr/issues/212)) ([2801db9](https://github.com/ng-packagr/ng-packagr/commit/2801db95775bf3e68c81c4f5609e621afa8205d8))
* provide UMD module id defaults for rxjs v6 ([#840](https://github.com/ng-packagr/ng-packagr/issues/840)) ([6613dde](https://github.com/ng-packagr/ng-packagr/commit/6613ddef6f7bc17ae071ebef40b8f9efc6d24e53)), closes [#781](https://github.com/ng-packagr/ng-packagr/issues/781) [#838](https://github.com/ng-packagr/ng-packagr/issues/838)
* provide version info with `ng-packagr --version` cli option ([#393](https://github.com/ng-packagr/ng-packagr/issues/393)) ([758c403](https://github.com/ng-packagr/ng-packagr/commit/758c40321e1d94aaa02b88554706080ac46bc65b))
* reduce library bundle size by clean-css ([#563](https://github.com/ng-packagr/ng-packagr/issues/563)) ([65386c2](https://github.com/ng-packagr/ng-packagr/commit/65386c24ec9c51120965ad2d4f5b1838561e66a4)), closes [#614](https://github.com/ng-packagr/ng-packagr/issues/614)
* relocate source map file paths to `ng://<(at)org>/<package>/<sub>` ([#332](https://github.com/ng-packagr/ng-packagr/issues/332)) ([c9b8d73](https://github.com/ng-packagr/ng-packagr/commit/c9b8d7348de0961e2b5dec2e79a8c99b9adb1a2b))
* remove `src` property from package schema ([#431](https://github.com/ng-packagr/ng-packagr/issues/431)) ([960484c](https://github.com/ng-packagr/ng-packagr/commit/960484c0395d0afc18b693f14da7a9a33928684e))
* remove bundled dependencies ([6576b9a](https://github.com/ng-packagr/ng-packagr/commit/6576b9a3db69c158409550c1abbf03b484070a08)), closes [#1432](https://github.com/ng-packagr/ng-packagr/issues/1432)
* remove deprecated `ng-package.json properties` ([9b988b0](https://github.com/ng-packagr/ng-packagr/commit/9b988b0725817aab4bec4b20eff515c765614694)), closes [#4](https://github.com/ng-packagr/ng-packagr/issues/4)
* remove deprecated code ([#773](https://github.com/ng-packagr/ng-packagr/issues/773)) ([866a4b5](https://github.com/ng-packagr/ng-packagr/commit/866a4b50cf053a61a60277f1030612256f58d731))
* remove handling of `package.json` as configuration ([a94bd14](https://github.com/ng-packagr/ng-packagr/commit/a94bd14b90297affadc33548ea6f1289379e5d61)), closes [#2176](https://github.com/ng-packagr/ng-packagr/issues/2176)
* remove NGCC integration ([d9fdc89](https://github.com/ng-packagr/ng-packagr/commit/d9fdc89ab76179cb6734ab32bb784e7e3278e3cf))
* remove node 4.x support ([7a857d4](https://github.com/ng-packagr/ng-packagr/commit/7a857d4f93c6d8865a78edd4ac6e7e6bd83895ab))
* remove scripts section in dist-ready package.json ([#686](https://github.com/ng-packagr/ng-packagr/issues/686)) ([810e58a](https://github.com/ng-packagr/ng-packagr/commit/810e58a398d35e120206762b9785b0b5d7963aaa))
* remove tsickle from direct peerDepedencies ([1555cf6](https://github.com/ng-packagr/ng-packagr/commit/1555cf616a644296ac8563a7a9d611d1fed10e9b)), closes [#1202](https://github.com/ng-packagr/ng-packagr/issues/1202)
* remove unused ESM2022 from APF ([0be95f7](https://github.com/ng-packagr/ng-packagr/commit/0be95f7a3b993ddc5b565a0beedbd7f38b6c37be))
* replace `uglify-js` with `terser` ([a18d7ad](https://github.com/ng-packagr/ng-packagr/commit/a18d7ad2e3ec5d4fdaf10416962416c38fb24ec8))
* replace css optimizer from clean-css with cssnano ([2c6160f](https://github.com/ng-packagr/ng-packagr/commit/2c6160f3d54e112bd8d465015ff24fe4b4db7530)), closes [#1607](https://github.com/ng-packagr/ng-packagr/issues/1607)
* replace es2015 with es2020 ([9e37a56](https://github.com/ng-packagr/ng-packagr/commit/9e37a56a43d1bcd34e9f6264b3cc6f5590c2d1d1))
* resolve "~" scss import statements to nearest `node_modules` ([#352](https://github.com/ng-packagr/ng-packagr/issues/352)) ([ee9800b](https://github.com/ng-packagr/ng-packagr/commit/ee9800b7770b326da1be47b0ef7b8397024e1ff7)), closes [#346](https://github.com/ng-packagr/ng-packagr/issues/346)
* resolve ng-package config from multiple sources ([c193b68](https://github.com/ng-packagr/ng-packagr/commit/c193b6882d2b86e295bbee20036a43350c3724ef))
* resource inlining w/ TypeScript transformations ([#279](https://github.com/ng-packagr/ng-packagr/issues/279)) ([4753066](https://github.com/ng-packagr/ng-packagr/commit/4753066ba7a75e6d570d0ce45052252a56b97214))
* show error when trying to publish ivy packages ([c3122d6](https://github.com/ng-packagr/ng-packagr/commit/c3122d6022af2f42b162316d6076d782b15eb801))
* show warning on deprecated option usage ([551a4d9](https://github.com/ng-packagr/ng-packagr/commit/551a4d9a866a8c337189f807d755856b995ffc9b))
* speed up incremental mode by not generating UMD ([0af0ce0](https://github.com/ng-packagr/ng-packagr/commit/0af0ce05cf98791f6d0a90e56552cdcd56746238))
* stabilize command API, move towards customizing through DI ([#470](https://github.com/ng-packagr/ng-packagr/issues/470)) ([f992283](https://github.com/ng-packagr/ng-packagr/commit/f99228310a1016d08672adfc71ee419cad256a3e))
* support Angular 11 ([66719af](https://github.com/ng-packagr/ng-packagr/commit/66719af0aa3238bdee2d09428979a2c32a24b5f5))
* support Angular 14 ([c153c4d](https://github.com/ng-packagr/ng-packagr/commit/c153c4d822bb4441fb7819a8c1d66548f34dfb35))
* support Angular 15 ([e3eca0a](https://github.com/ng-packagr/ng-packagr/commit/e3eca0ab8b2669eea0cb3fd5c46413ef6a3197d1))
* support external dependency '@angular/common/http' by default ([df44752](https://github.com/ng-packagr/ng-packagr/commit/df44752d5b67ace867937dbeb821c8ba7016fb22))
* support incremental TypeScript semantic diagnostics ([d3b9488](https://github.com/ng-packagr/ng-packagr/commit/d3b9488a4a829efc7f640a3497e16ba94308316c))
* support inline javascript in less ([#1300](https://github.com/ng-packagr/ng-packagr/issues/1300)) ([e0b4136](https://github.com/ng-packagr/ng-packagr/commit/e0b4136cce9b48619061def5b324e18b3b10103c)), closes [#1298](https://github.com/ng-packagr/ng-packagr/issues/1298)
* support intra-package dependencies (re. entry points, experimental) ([#685](https://github.com/ng-packagr/ng-packagr/issues/685)) ([988968e](https://github.com/ng-packagr/ng-packagr/commit/988968e2921e0fd6a1a3c478ef1b0e29ca5eb7e5))
* support more complex `asset` configurations ([6776e17](https://github.com/ng-packagr/ng-packagr/commit/6776e17ac41458f4d196f8ea001ab649e5274952)), closes [#1497](https://github.com/ng-packagr/ng-packagr/issues/1497)
* support Node.js version 16 ([5c8ce22](https://github.com/ng-packagr/ng-packagr/commit/5c8ce225c3a7c4243e3fc0522509a683f5a7535e))
* support rxjs operators with different import syntaxes ([#82](https://github.com/ng-packagr/ng-packagr/issues/82)) ([d64aa40](https://github.com/ng-packagr/ng-packagr/commit/d64aa403bf547989d144c2f5b3c32f0d834e5986))
* support specifying stylesheet language for inline component styles ([61cd015](https://github.com/ng-packagr/ng-packagr/commit/61cd015e174a3e1db0507e63005704a7f49b9952))
* support TypeScript 4.2 ([82c173c](https://github.com/ng-packagr/ng-packagr/commit/82c173cd2e0a2f315ee1b7d4b4037e866f1ff768))
* support TypeScript 4.6.2 ([9faef17](https://github.com/ng-packagr/ng-packagr/commit/9faef173ce4949c6993d32127c97d35fe0ce3bb5))
* support TypeScript 4.7 ([5574598](https://github.com/ng-packagr/ng-packagr/commit/5574598b8ae44adca3c734a6659e14055169264d))
* support TypeScript 5.1 ([fcc0c6a](https://github.com/ng-packagr/ng-packagr/commit/fcc0c6a8ddba163dcf642d1cb1634ca223fa97b2))
* support TypeScript 5.2 ([0acd2c4](https://github.com/ng-packagr/ng-packagr/commit/0acd2c473db9a3b4510e28b2e384a0e0e0bdee4c))
* support TypeScript 5.4 ([07d5cea](https://github.com/ng-packagr/ng-packagr/commit/07d5cea0d79e1e9453c33dadd4b29122f764d949))
* support TypeScript to 4.4 ([40f7316](https://github.com/ng-packagr/ng-packagr/commit/40f73161a3b5fdefcd672a9b5ce325fcb208c0c4))
* support using custom postcss configuration ([bcb80fa](https://github.com/ng-packagr/ng-packagr/commit/bcb80fa0dc14e78697e1c76cd9c336ac3e70c57c)), closes [#2765](https://github.com/ng-packagr/ng-packagr/issues/2765) [#643](https://github.com/ng-packagr/ng-packagr/issues/643)
* switch to sass modern API ([b1ebee3](https://github.com/ng-packagr/ng-packagr/commit/b1ebee34c7c89cb3d91cb49c74b9c013e84da125))
* turn on `downlevelIteration` flag for ES5 bundles ([#475](https://github.com/ng-packagr/ng-packagr/issues/475)) ([616888a](https://github.com/ng-packagr/ng-packagr/commit/616888af1a3578c0586ec316fd0ae4c309af82fd)), closes [#418](https://github.com/ng-packagr/ng-packagr/issues/418)
* update `lib` compiler option to `es2018` ([#956](https://github.com/ng-packagr/ng-packagr/issues/956)) ([6bbedee](https://github.com/ng-packagr/ng-packagr/commit/6bbedee2026dbfeb9b148b846a60da05a3f8dcaf))
* update `tslib`peerDependencies to `^2.3.0` ([12dc21e](https://github.com/ng-packagr/ng-packagr/commit/12dc21e747382aff183e5c678c3aa580fd67608e))
* update generated output to APF 14 ([c6f6e4d](https://github.com/ng-packagr/ng-packagr/commit/c6f6e4d701d31e3d9e8636703ede731c3790778b))
* update Ivy compilation pipeline to use faster NGTSC program ([9f17304](https://github.com/ng-packagr/ng-packagr/commit/9f1730467bc6c599306e16c1583b26c305b33e53))
* update peerDependencies ([7ff60f5](https://github.com/ng-packagr/ng-packagr/commit/7ff60f5d298a22e58f602a4c55279524e0ec166a))
* update rollup to version ^0.45.0 ([#69](https://github.com/ng-packagr/ng-packagr/issues/69)) ([d124cb3](https://github.com/ng-packagr/ng-packagr/commit/d124cb3493ecdfc0c83dddee4827b58cbb3f13d7)), closes [#68](https://github.com/ng-packagr/ng-packagr/issues/68)
* update rollup to version ^0.48.0 ([9110899](https://github.com/ng-packagr/ng-packagr/commit/911089964222451b4bc977e641aec8dc99bbee40))
* update rollup to version 0.46.0 ([1f25f7a](https://github.com/ng-packagr/ng-packagr/commit/1f25f7afdfc2215fcb21962b3bae8ae7448eaabe))
* update rollup to version 0.47.0 ([29a8901](https://github.com/ng-packagr/ng-packagr/commit/29a89011c3bf0f555668eef80834afad60af14f3))
* update rollup to version 0.50.0 ([#124](https://github.com/ng-packagr/ng-packagr/issues/124)) ([fb9f529](https://github.com/ng-packagr/ng-packagr/commit/fb9f5296f4c7a4e7441ba99350d24d664273a037))
* update rollup to version 1.6+ ([82f97e4](https://github.com/ng-packagr/ng-packagr/commit/82f97e43d26b1a2641356ea8c2de5cf47391598d)), closes [#1227](https://github.com/ng-packagr/ng-packagr/issues/1227)
* update several rollup dependencies ([0772371](https://github.com/ng-packagr/ng-packagr/commit/0772371c7744628d6757e9c678cd6624f70a8d66))
* update to APF version 10 ([d47ccd7](https://github.com/ng-packagr/ng-packagr/commit/d47ccd7fb1763af052d068ea84edc79981bd0c94))
* update tsickle to =>0.27.3, rollup to ^0.57.1 ([#769](https://github.com/ng-packagr/ng-packagr/issues/769)) ([3bcf233](https://github.com/ng-packagr/ng-packagr/commit/3bcf233d7bdf98fcbe4fe5372c230abea7b10d3e)), closes [#679](https://github.com/ng-packagr/ng-packagr/issues/679)
* update typescript to ~2.4.2 for Angular v5 support ([#270](https://github.com/ng-packagr/ng-packagr/issues/270)) ([2c6db4f](https://github.com/ng-packagr/ng-packagr/commit/2c6db4f211e8830c773b548426dff7c23dbc1cea))
* use '1.0.0-pre.n' version number for any upcoming prerelease ([a31c824](https://github.com/ng-packagr/ng-packagr/commit/a31c824293542f86222e4b219882e3cbe71cd216))
* use `ajv` to validate schema ([e5e9864](https://github.com/ng-packagr/ng-packagr/commit/e5e98646260854bb3aaaf049ebbb12c0053069dd))
* version bump rollup to ^0.43.0 ([227e3b7](https://github.com/ng-packagr/ng-packagr/commit/227e3b72f56dc49d0b22b0e1db2d3b60d8e083f3))
* version bump to @angular/tsc-wrapped 4.2.0 ([7091f2a](https://github.com/ng-packagr/ng-packagr/commit/7091f2ac3a094045615b7a1b0ddeaad3c4dc093c))


### Bug Fixes

*  downlevel constructor parameters transformer with tsickle ([51d5498](https://github.com/ng-packagr/ng-packagr/commit/51d5498cb3ccc3974d57e12624676a122a04d982)), closes [#1517](https://github.com/ng-packagr/ng-packagr/issues/1517)
*  update rollup to version ^0.51.0 ([#260](https://github.com/ng-packagr/ng-packagr/issues/260)) ([c652f4e](https://github.com/ng-packagr/ng-packagr/commit/c652f4e1b3786c7526b5b4f7ae8ca9d5c1707e9f))
* `--version` doesn't work ([ba835bb](https://github.com/ng-packagr/ng-packagr/commit/ba835bbfe39725085fdaec4fae7e93d355d68f59)), closes [#2157](https://github.com/ng-packagr/ng-packagr/issues/2157)
* `JavaScript heap out of memory` when having a lot of secondary entrypoints ([ca3d1d3](https://github.com/ng-packagr/ng-packagr/commit/ca3d1d30e82527d944150abb55efa215728cfdd7)), closes [#1099](https://github.com/ng-packagr/ng-packagr/issues/1099)
* add 'let' to known rxjs operators ([9927f93](https://github.com/ng-packagr/ng-packagr/commit/9927f930bce80ff2e7e5897c77ec618587657b6b)), closes [#85](https://github.com/ng-packagr/ng-packagr/issues/85)
* add `assets` option to schema ([a5efd1c](https://github.com/ng-packagr/ng-packagr/commit/a5efd1c27d04b2d654959e1fe2062f222cfdf071)), closes [#1092](https://github.com/ng-packagr/ng-packagr/issues/1092)
* add `built at` and `time` to console output ([50639dc](https://github.com/ng-packagr/ng-packagr/commit/50639dcbb97add89fcda2570aa5a55892a9b0d2c))
* add `chalk` to dependencies ([#647](https://github.com/ng-packagr/ng-packagr/issues/647)) ([e8aa93f](https://github.com/ng-packagr/ng-packagr/commit/e8aa93feb71069e2bfce0f4bc4dd6d7e61d548a2))
* add `enableResourceInlining` by default to tsconfig ([#1021](https://github.com/ng-packagr/ng-packagr/issues/1021)) ([d2e9678](https://github.com/ng-packagr/ng-packagr/commit/d2e9678ecfcf77a25f1b71606e6d929add54da48)), closes [#976](https://github.com/ng-packagr/ng-packagr/issues/976)
* add `NgPackagrOptions` to public api ([ffc512e](https://github.com/ng-packagr/ng-packagr/commit/ffc512ee9a2c30e1528189d20b4a18d7e19cf473))
* add `postcss-discard-comments` as a dependency ([#544](https://github.com/ng-packagr/ng-packagr/issues/544)) ([bce5705](https://github.com/ng-packagr/ng-packagr/commit/bce5705fb10b082ee72d499f812c26e891f4e38f)), closes [#543](https://github.com/ng-packagr/ng-packagr/issues/543)
* add `rxjs/ReplaySubject` to rollup defaults ([#44](https://github.com/ng-packagr/ng-packagr/issues/44)) ([237b24e](https://github.com/ng-packagr/ng-packagr/commit/237b24e47b032903dbb70303bbd404d5e8d3e1c0))
* add basePath as sourceRoot ([681fb1c](https://github.com/ng-packagr/ng-packagr/commit/681fb1c36b68efb3078dc3d846776e9e749ebf44))
* add description for `ngPackage` property in `package.json` ([3f8e25c](https://github.com/ng-packagr/ng-packagr/commit/3f8e25c4ac05de3a4c2055b1d501a81737258ee7))
* add downlevelConstructorParameters transformer ([b959010](https://github.com/ng-packagr/ng-packagr/commit/b959010692ae5d605001d93e22f8551fb1fec3d1)), closes [#1400](https://github.com/ng-packagr/ng-packagr/issues/1400)
* add fallback for `sources` when re-wiring sourcemaps ([#1033](https://github.com/ng-packagr/ng-packagr/issues/1033)) ([9521281](https://github.com/ng-packagr/ng-packagr/commit/9521281694a14427faf3e2c241ef2b29c4a98bc4))
* add link to Angular guide when showing ivy publish warning ([6bee029](https://github.com/ng-packagr/ng-packagr/commit/6bee0294083b6522d4fa1c7183d88e376e1ea402)), closes [#1453](https://github.com/ng-packagr/ng-packagr/issues/1453)
* add missing 'declaration' option in tsconfig ([#790](https://github.com/ng-packagr/ng-packagr/issues/790)) ([dbd8ce1](https://github.com/ng-packagr/ng-packagr/commit/dbd8ce19eaf1897b0e71e09bb3ffa1534ef3ad9c))
* add missing tailwind `[@screen](https://github.com/screen)` directive in matcher ([ad1bd50](https://github.com/ng-packagr/ng-packagr/commit/ad1bd50efb9eadccf5f80abbf8c24e03551f2081))
* add moduleResolution to downleveling options ([#787](https://github.com/ng-packagr/ng-packagr/issues/787)) ([d7b4094](https://github.com/ng-packagr/ng-packagr/commit/d7b4094eb7d527c2e97556f6eb0650ca51f2a8e2)), closes [#784](https://github.com/ng-packagr/ng-packagr/issues/784)
* add more package json sections to remove ([57cc4d1](https://github.com/ng-packagr/ng-packagr/commit/57cc4d1caaca52507d19cbed470061cc72aa9ef1))
* add opencollective postinstall hook ([c3dbaeb](https://github.com/ng-packagr/ng-packagr/commit/c3dbaeb6c343f223ff7cad11994717cc60fd073e))
* add quotes to less include-path ([af6816b](https://github.com/ng-packagr/ng-packagr/commit/af6816b5207b265be603f9778183530708d9aeea))
* add support for prerelease version of Angular ([632217e](https://github.com/ng-packagr/ng-packagr/commit/632217e80832f57032fd164f85e9085fdb6c427d))
* add tsickle as optional peer dependency ([52f3988](https://github.com/ng-packagr/ng-packagr/commit/52f398887abb91db3901088a9f76e3911e88e5c6)), closes [#1801](https://github.com/ng-packagr/ng-packagr/issues/1801)
* add version stamping during watch builds ([4e13041](https://github.com/ng-packagr/ng-packagr/commit/4e13041a7cc47918dcecd4dd94f2f57edc0e747c))
* add workaround to terminate workers on destroy ([7252f53](https://github.com/ng-packagr/ng-packagr/commit/7252f53fda8bf87db5554724a0bf501b93ef5cbc)), closes [#2688](https://github.com/ng-packagr/ng-packagr/issues/2688)
* address issue were dts were not emitted fully when using entrypoint name as filename ([713d940](https://github.com/ng-packagr/ng-packagr/commit/713d9408f7b9629863bdbe38a426daa453807a16)), closes [#2369](https://github.com/ng-packagr/ng-packagr/issues/2369) [#2360](https://github.com/ng-packagr/ng-packagr/issues/2360)
* allow sass indexed syntax to be compiled (+ integration tests) ([#1053](https://github.com/ng-packagr/ng-packagr/issues/1053)) ([34a259d](https://github.com/ng-packagr/ng-packagr/commit/34a259d5fb9a4d27557dc298d18b7ebd81baa3b1))
* allow sideEffects to be set as an array ([#866](https://github.com/ng-packagr/ng-packagr/issues/866)) ([04bb2ad](https://github.com/ng-packagr/ng-packagr/commit/04bb2ad4c0f28c18b8c98400bb03fe93a56ab43f))
* allow usages of ECMAScript Decorators ([9abe6a0](https://github.com/ng-packagr/ng-packagr/commit/9abe6a02bf681a67184c923f26330a358f3d48d7)), closes [#2625](https://github.com/ng-packagr/ng-packagr/issues/2625)
* always set destination directory ([4e89bcf](https://github.com/ng-packagr/ng-packagr/commit/4e89bcfe571c382ad0b47ae50d5d6dab5de6bef7))
* analyse exported imports ([#873](https://github.com/ng-packagr/ng-packagr/issues/873)) ([c03d6f8](https://github.com/ng-packagr/ng-packagr/commit/c03d6f88feb5daed6172569e83deb6a7ed4d7c8f))
* analyse only non done entry points ([e8db885](https://github.com/ng-packagr/ng-packagr/commit/e8db885cc5bef832ea182dfa0ba8c4b7cbf85657))
* analyse should cater for module name being the primary entry point ([7b8e491](https://github.com/ng-packagr/ng-packagr/commit/7b8e4919c83d1545a147dce6c1b4d9f2c03c4168))
* analyses of secondary entrypoints doesn't work with deep imports ([3f56df2](https://github.com/ng-packagr/ng-packagr/commit/3f56df2802fb23f8fdb0312ddf6fe33dbf8a83f5)), closes [#1183](https://github.com/ng-packagr/ng-packagr/issues/1183)
* auto add tslib as direct dependency ([4145af5](https://github.com/ng-packagr/ng-packagr/commit/4145af5588d57c6749535c3a3cbc242b296fae0a))
* auto-wire paths for transitive dependencies of entry points ([#875](https://github.com/ng-packagr/ng-packagr/issues/875)) ([e9da0cf](https://github.com/ng-packagr/ng-packagr/commit/e9da0cfa2992bb9d55a6dcbb9c64dfbe318d19a6)), closes [#852](https://github.com/ng-packagr/ng-packagr/issues/852)
* avoid a recursive export when entryfile is named `index.ts` ([4c96acb](https://github.com/ng-packagr/ng-packagr/commit/4c96acbe21bda356c6fa14ad8470bccfb4d42451))
* await async process method ([361e43b](https://github.com/ng-packagr/ng-packagr/commit/361e43ba773021ef1b63525a67011c4e514a8ea8))
* browserlist configuration is not being picked up ([#994](https://github.com/ng-packagr/ng-packagr/issues/994)) ([72b2a00](https://github.com/ng-packagr/ng-packagr/commit/72b2a00da72b1e780d3390e3e1cf9887aa93a61e)), closes [angular/angular-cli#11480](https://github.com/angular/angular-cli/issues/11480)
* bump `commander` to `^2.12.0`, optimize typings for `cpx` and `commander` ([#323](https://github.com/ng-packagr/ng-packagr/issues/323)) ([68d0c34](https://github.com/ng-packagr/ng-packagr/commit/68d0c34710884428075c24570edbc37944c087ac))
* cannot read property 'text' of undefined ([#669](https://github.com/ng-packagr/ng-packagr/issues/669)) ([b91eb66](https://github.com/ng-packagr/ng-packagr/commit/b91eb66cc9b4c74b2271335a2a7c0c73551d0660)), closes [#668](https://github.com/ng-packagr/ng-packagr/issues/668)
* changed assets not being copied during watch mode ([8d6664e](https://github.com/ng-packagr/ng-packagr/commit/8d6664e782bab40bfadd555dcdd9ef011b0104d6)), closes [#1826](https://github.com/ng-packagr/ng-packagr/issues/1826)
* circular dependency on itself error ([702c3f2](https://github.com/ng-packagr/ng-packagr/commit/702c3f261f6ef1ae17ec6e32accd4de6403f54cd)), closes [#1508](https://github.com/ng-packagr/ng-packagr/issues/1508)
* clear analysis cache to detect invalid imports in watch mode ([d6a3920](https://github.com/ng-packagr/ng-packagr/commit/d6a39203bb0fdbe1b5465355261a0c3b0a2c7501))
* close rollup bundle after write ([cf5de76](https://github.com/ng-packagr/ng-packagr/commit/cf5de7642832cc73aeaca70f3a7ea442df0856c9))
* copy `README.md` and `LICENSE` just for primary entry ([#215](https://github.com/ng-packagr/ng-packagr/issues/215)) ([38776d8](https://github.com/ng-packagr/ng-packagr/commit/38776d8db46b03c9138f44fbfa2beefda71927b7))
* copy changed file during watch mode when using advanced asset pattern ([0a11ca9](https://github.com/ng-packagr/ng-packagr/commit/0a11ca960cf8de2398bf5098210dd7677365343c)), closes [#2479](https://github.com/ng-packagr/ng-packagr/issues/2479)
* copy nested triple slash referenced typings to correct path ([#1009](https://github.com/ng-packagr/ng-packagr/issues/1009)) ([9b7b701](https://github.com/ng-packagr/ng-packagr/commit/9b7b701b02293d58684f123e5a25d8f74d5c3732)), closes [#1007](https://github.com/ng-packagr/ng-packagr/issues/1007)
* copy+dereference LICENSE and README.md ([6ace017](https://github.com/ng-packagr/ng-packagr/commit/6ace01763f999239c865dd155b4469405e1546b4))
* correct depth analysis of unordered dependencies for secondaries ([#846](https://github.com/ng-packagr/ng-packagr/issues/846)) ([f4beea9](https://github.com/ng-packagr/ng-packagr/commit/f4beea90797002f0fec0ae2246c7e5ab293eb6b8))
* correct explanation of `lib.flatModuleFile` ([d95afb0](https://github.com/ng-packagr/ng-packagr/commit/d95afb0a85b649298bca87f4c9f63b18fbde0be1))
* correct paths in generated sourcemaps ([#50](https://github.com/ng-packagr/ng-packagr/issues/50)) ([c389160](https://github.com/ng-packagr/ng-packagr/commit/c389160c1e9772ba56bbb811a1d1a573af22d3fc)), closes [#46](https://github.com/ng-packagr/ng-packagr/issues/46)
* correctly append `sourceMappingUrl` when saving FESMs into cache ([657eacd](https://github.com/ng-packagr/ng-packagr/commit/657eacd863aa989f11b8cbb2da2e485a7e42ca11)), closes [#2172](https://github.com/ng-packagr/ng-packagr/issues/2172)
* correctly embed CSS resources ([059ba29](https://github.com/ng-packagr/ng-packagr/commit/059ba298b96ace42fc92ed2d67757848f5a8ea17)), closes [#2768](https://github.com/ng-packagr/ng-packagr/issues/2768)
* correctly locate `typings` file ([3d5c266](https://github.com/ng-packagr/ng-packagr/commit/3d5c2664da45278e2c3c2343b42dfa5114fa58b5))
* correctly resolve sourceRoot ([6673dbc](https://github.com/ng-packagr/ng-packagr/commit/6673dbcc7903ba766f44c44d6fb39967ef0f002e))
* correctly validate secondary entry-points config ([5ff4afd](https://github.com/ng-packagr/ng-packagr/commit/5ff4afde43b4984bf7f64ce991dfe255b1fb9373))
* create an array large enough to hold all buckets ([#845](https://github.com/ng-packagr/ng-packagr/issues/845)) ([353b0fa](https://github.com/ng-packagr/ng-packagr/commit/353b0fa83c46c3639f54c78dd781c8ddfb3a6da1))
* css comments should be discarded irrespective of `cssUrl` ([#562](https://github.com/ng-packagr/ng-packagr/issues/562)) ([d6eb971](https://github.com/ng-packagr/ng-packagr/commit/d6eb971844ad1151a1eafa2a503822c913a6383d))
* debounce when a file changes ([#975](https://github.com/ng-packagr/ng-packagr/issues/975)) ([25e2f42](https://github.com/ng-packagr/ng-packagr/commit/25e2f42399496e80737e334035a712bcb9a6c83f))
* Debug Failure. False expression when using triple slash reference directive ([043c53b](https://github.com/ng-packagr/ng-packagr/commit/043c53b9f811fc4e604b51d5660c061271c2ad03))
* depend on user's typescript and tsc-wrapped ([#268](https://github.com/ng-packagr/ng-packagr/issues/268)) ([42b2f08](https://github.com/ng-packagr/ng-packagr/commit/42b2f08413b8b3b3addab4a09345fa26aa1b1309))
* deprecate whitelistedNonPeerDependencies in favor of allowedNonPeerDependencies ([e7fc214](https://github.com/ng-packagr/ng-packagr/commit/e7fc2149f190fb131f3d21625c6c9eb253ede84a)), closes [#1884](https://github.com/ng-packagr/ng-packagr/issues/1884)
* **deps:** update @angular-devkit/schematics to version ^0.0.37 ([#306](https://github.com/ng-packagr/ng-packagr/issues/306)) ([8cb4d07](https://github.com/ng-packagr/ng-packagr/commit/8cb4d07407bda8203b4dda8afdcc974736ee4682))
* disable CSS `calc` optimizations ([bdcc938](https://github.com/ng-packagr/ng-packagr/commit/bdcc938f765f3d58a79b395dcf7a749efddd3e94))
* disable CSS declaration sorting optimizations ([4f06939](https://github.com/ng-packagr/ng-packagr/commit/4f06939bab2d15e84d2737fe91d37605edfc8d6c))
* disable internal `emitDecoratorMetadata` ([d0bf507](https://github.com/ng-packagr/ng-packagr/commit/d0bf507e796a65306ab0c5b750fa43391b310311))
* disable rollups hoistTransitiveImports ([2b077c8](https://github.com/ng-packagr/ng-packagr/commit/2b077c8872b1e053f11fc035ed346bb5a3b61f01))
* disable treeshaking when generating bundles ([34b26fc](https://github.com/ng-packagr/ng-packagr/commit/34b26fc359af9da97c57f575f5059cd167415c23))
* display file stylesheet file path when there is an error ([698de4e](https://github.com/ng-packagr/ng-packagr/commit/698de4e0dc9f917ee147ec115cb36b0c1b7c59bf))
* display package versions correctly when using the version command ([141fd65](https://github.com/ng-packagr/ng-packagr/commit/141fd655d7b080a9211596ed2a8110fdc06ba7d5))
* display template error when cache is disabled ([0698929](https://github.com/ng-packagr/ng-packagr/commit/0698929aa8583204d4b6a203824c0af27770f0eb)), closes [#2705](https://github.com/ng-packagr/ng-packagr/issues/2705)
* dispose the previous TransformationResult after inlining ([#533](https://github.com/ng-packagr/ng-packagr/issues/533)) ([b4c7e89](https://github.com/ng-packagr/ng-packagr/commit/b4c7e8965ff74549f307397ba76f404ecc55e2ba))
* do not disable fullTemplateTypeCheck when ES5 downleveling ([#860](https://github.com/ng-packagr/ng-packagr/issues/860)) ([dfa83f9](https://github.com/ng-packagr/ng-packagr/commit/dfa83f96bad1405f94bc431028544e1cfc47666c)), closes [#826](https://github.com/ng-packagr/ng-packagr/issues/826) [#812](https://github.com/ng-packagr/ng-packagr/issues/812) [#822](https://github.com/ng-packagr/ng-packagr/issues/822) [#826](https://github.com/ng-packagr/ng-packagr/issues/826)
* do not run ngcc when node_modules does not exist ([97beddc](https://github.com/ng-packagr/ng-packagr/commit/97beddc50000e04faf5a38a7da0fc6e9642fe0c0))
* do not set less math option ([24fa68b](https://github.com/ng-packagr/ng-packagr/commit/24fa68bcf9db6db9a6c0707716c25806418749b3)), closes [#2675](https://github.com/ng-packagr/ng-packagr/issues/2675)
* don't copy assets asynchronously ([374ec29](https://github.com/ng-packagr/ng-packagr/commit/374ec2964e8fbc49408462f4b4a936e4712e91ca))
* don't exclude `node_modules` from watch ([#995](https://github.com/ng-packagr/ng-packagr/issues/995)) ([3863d79](https://github.com/ng-packagr/ng-packagr/commit/3863d797a02cbeb33f21e94586fb991af8bddb4d))
* don't exit with non zero error code on non error compiler diagnostics ([0daa33e](https://github.com/ng-packagr/ng-packagr/commit/0daa33e826795d5b1ecd91f3c67a42996de2b20f))
* don't generate minified UMD bundles. ([cf56f3b](https://github.com/ng-packagr/ng-packagr/commit/cf56f3bd3449affb63761530f6b1670a096e5538))
* don't override `baseUrl` ([#862](https://github.com/ng-packagr/ng-packagr/issues/862)) ([769b091](https://github.com/ng-packagr/ng-packagr/commit/769b09172ad98e83bc1da4eac12c6098257909ea))
* don't process tslib with ngcc ([925b427](https://github.com/ng-packagr/ng-packagr/commit/925b427fe0a8b39b5fb87d7dfd259455cb5f3248))
* don't use classic module resolution during analyse ([f0a1c38](https://github.com/ng-packagr/ng-packagr/commit/f0a1c387727226eca9bd27b25814a5988af59616)), closes [#1210](https://github.com/ng-packagr/ng-packagr/issues/1210)
* don't verify devDependencies in dist-ready package.json ([#721](https://github.com/ng-packagr/ng-packagr/issues/721)) ([3535e86](https://github.com/ng-packagr/ng-packagr/commit/3535e8698262497e8180415aabef25721c5a6be4))
* don't write stacktraces when there are errors ([42692b0](https://github.com/ng-packagr/ng-packagr/commit/42692b0e11fe84d6df3f68405f477f18d43e25cd))
* embed `tslib` helpers in UMD bundles only ([#573](https://github.com/ng-packagr/ng-packagr/issues/573)) ([7a996ef](https://github.com/ng-packagr/ng-packagr/commit/7a996ef763c252d3ea03f416550e6d9e17c9abdc)), closes [#371](https://github.com/ng-packagr/ng-packagr/issues/371)
* embed tslib helpers in umd bundle ([#868](https://github.com/ng-packagr/ng-packagr/issues/868)) ([0fc30e5](https://github.com/ng-packagr/ng-packagr/commit/0fc30e555671dbf4e1edd62ccce436d93ae9848f))
* emit `.tsbuildinfo` when cache mode is enabled ([5f32591](https://github.com/ng-packagr/ng-packagr/commit/5f32591e9613d971d6d7608af3e27c30ee14aa3a)), closes [#2682](https://github.com/ng-packagr/ng-packagr/issues/2682)
* emit complete diagnostics ([82e1fd0](https://github.com/ng-packagr/ng-packagr/commit/82e1fd00dd4a9b7d24e89cd9f43f3b98233d5f9e))
* emit ts option diagnostic ([ed960b6](https://github.com/ng-packagr/ng-packagr/commit/ed960b62beff17ef03e2c8391dbd6e39b515c409))
* emit TypeScript declaration diagnostics ([844ea6c](https://github.com/ng-packagr/ng-packagr/commit/844ea6c6c6b414c192aa0e5fcce7adfbfda0e439)), closes [#2405](https://github.com/ng-packagr/ng-packagr/issues/2405)
* ensure license entry point is properly built ([#1849](https://github.com/ng-packagr/ng-packagr/issues/1849)) ([ed6b15a](https://github.com/ng-packagr/ng-packagr/commit/ed6b15a1d009d5a9597a186417ece37018176c59))
* error out gracefully when `package.json` is not found ([902dea2](https://github.com/ng-packagr/ng-packagr/commit/902dea24444ab63d0e054d128a3dd416a601d22d)), closes [#1255](https://github.com/ng-packagr/ng-packagr/issues/1255)
* error shown multiple times in terminal ([22322e8](https://github.com/ng-packagr/ng-packagr/commit/22322e8b3233597831cea8e02ad06a621d5a0b64))
* error when a finding a conflicting package export ([bf3a0b9](https://github.com/ng-packagr/ng-packagr/commit/bf3a0b9c729668174e1df1e5de88393f8294a796))
* error when index file is parallel to entry-point but is not configured as such ([ecb55b1](https://github.com/ng-packagr/ng-packagr/commit/ecb55b1d7e55a6e86cd1972ea87a88b52660d2d5))
* escape unicode characters in css with a double blackslash ([#453](https://github.com/ng-packagr/ng-packagr/issues/453)) ([9891128](https://github.com/ng-packagr/ng-packagr/commit/98911286f3b4a5c1418ccc6520f98a879c8f94ae)), closes [#425](https://github.com/ng-packagr/ng-packagr/issues/425)
* exclude ng-package.json from entry point discovery ([#471](https://github.com/ng-packagr/ng-packagr/issues/471)) ([38103ac](https://github.com/ng-packagr/ng-packagr/commit/38103acea5ea4245de3c4b25322ed3a4a8999741)), closes [#463](https://github.com/ng-packagr/ng-packagr/issues/463)
* exclude scanning nested node_modules when locating `README.md` ([4e4c00b](https://github.com/ng-packagr/ng-packagr/commit/4e4c00bf67d2dcb932da5404cc36703e49556594)), closes [#2459](https://github.com/ng-packagr/ng-packagr/issues/2459)
* exclude scanning node_modules when trying to locate README.md ([b54159b](https://github.com/ng-packagr/ng-packagr/commit/b54159bf5f9d8fcb57126a37fdfa33443c2f58c2)), closes [#2418](https://github.com/ng-packagr/ng-packagr/issues/2418)
* fix resolution for less binary ([6bc789c](https://github.com/ng-packagr/ng-packagr/commit/6bc789c5b1ca8cbb5db5db38d5955c1258701fb6)), closes [#1276](https://github.com/ng-packagr/ng-packagr/issues/1276)
* fix windows less spawn error ([9174c0b](https://github.com/ng-packagr/ng-packagr/commit/9174c0bca7290a4505f33f7fa13332785ea47459))
* force less version 3.5 math behaviour ([a491faf](https://github.com/ng-packagr/ng-packagr/commit/a491faf0a37ea884f0714396b6e38a950d6a4563)), closes [#2113](https://github.com/ng-packagr/ng-packagr/issues/2113)
* generate correct UMD module id for `@angular/common/http/testing` ([#782](https://github.com/ng-packagr/ng-packagr/issues/782)) ([a0451d8](https://github.com/ng-packagr/ng-packagr/commit/a0451d8a8cc653dda9bd662266e1ce95d691760e))
* grammatical update error message ([6d7d2a9](https://github.com/ng-packagr/ng-packagr/commit/6d7d2a97b2c9586bce51a92d3918051be0441460))
* handle absolute `url` reference in CSS files ([3d96591](https://github.com/ng-packagr/ng-packagr/commit/3d96591c932886cd5f62668909989879f3d63aac))
* handle deep undefined in schema options ([02055d0](https://github.com/ng-packagr/ng-packagr/commit/02055d0f7148e246f56c266010aaad6bd8bc7519)), closes [#1356](https://github.com/ng-packagr/ng-packagr/issues/1356)
* handle imports of node packages without tilda ([a60ff99](https://github.com/ng-packagr/ng-packagr/commit/a60ff999aeb44449ee7f1fe3b469888a2397469f)), closes [#2142](https://github.com/ng-packagr/ng-packagr/issues/2142)
* handle multiple node_modules when resolving Sass ([c7c51a3](https://github.com/ng-packagr/ng-packagr/commit/c7c51a34b016cbff07441c59e5a18a211ec1d729))
* handle nested entry points with same name ([#850](https://github.com/ng-packagr/ng-packagr/issues/850)) ([f911882](https://github.com/ng-packagr/ng-packagr/commit/f9118828198d0c6de3ca5262b914abb10aa92493)), closes [#851](https://github.com/ng-packagr/ng-packagr/issues/851) [#849](https://github.com/ng-packagr/ng-packagr/issues/849)
* handle svg templates same as html files ([2156f5f](https://github.com/ng-packagr/ng-packagr/commit/2156f5f1e7d0ef3c37013421d0e150d4b0430021))
* handle union type with a nullable argument ([c9f697f](https://github.com/ng-packagr/ng-packagr/commit/c9f697f56f4a907d73f930104b864495333ca01d)), closes [/github.com/angular/angular/blob/master/packages/compiler-cli/src/ngtsc/reflection/src/typescript.ts#L65-L66](https://github.com/ng-packagr//github.com/angular/angular/blob/master/packages/compiler-cli/src/ngtsc/reflection/src/typescript.ts/issues/L65-L66)
* ignore `.gitkeep`, `Thumbs.db` and `.DS_Store` when copying files ([a5b10e2](https://github.com/ng-packagr/ng-packagr/commit/a5b10e25baf97a70b8d1b676b87af44a0e029717))
* ignore circular dependency warnings ([9b93a18](https://github.com/ng-packagr/ng-packagr/commit/9b93a18d8673b6b788e35916518f241e981c302b))
* ignore git folder on watch ([c61cbfc](https://github.com/ng-packagr/ng-packagr/commit/c61cbfc5d6433a2cf7e03aa55814cce27a4a292d))
* ignore JSON files in tsickle processing ([#1489](https://github.com/ng-packagr/ng-packagr/issues/1489)) ([ec44059](https://github.com/ng-packagr/ng-packagr/commit/ec440590c96df2f8475c5c62294f23113eac1034)), closes [#325](https://github.com/ng-packagr/ng-packagr/issues/325)
* ignore type definitions when building entry-point dependency graph ([9a7dccb](https://github.com/ng-packagr/ng-packagr/commit/9a7dccb6e9068775a26c79d1ab1e2aee5571012a)), closes [#1982](https://github.com/ng-packagr/ng-packagr/issues/1982)
* improve cache logic to handle BigInt ([72f57b8](https://github.com/ng-packagr/ng-packagr/commit/72f57b8b64cdbdedf4429face0587429459427f8)), closes [#2375](https://github.com/ng-packagr/ng-packagr/issues/2375)
* improve Safari browserslist to esbuild target conversion ([23b4776](https://github.com/ng-packagr/ng-packagr/commit/23b47761dd60ac83af2a053d866c6ece9ab38330))
* improve stylesheet caching mechanism ([b4b44c8](https://github.com/ng-packagr/ng-packagr/commit/b4b44c8879e69eba06bd41da180cd6c2414acc0d))
* include `cssUrl` and `styleIncludePaths` in the CSS cache key ([6bb7a4a](https://github.com/ng-packagr/ng-packagr/commit/6bb7a4a35a9969c9b0619f855ff9c890ed4e2928)), closes [#2523](https://github.com/ng-packagr/ng-packagr/issues/2523)
* include `esbuild-check` in the dist package ([eda7f04](https://github.com/ng-packagr/ng-packagr/commit/eda7f04e36cd6ca7451e71806b6a408127ba3ddb))
* include `package.schema.json` in dist artefacts and npm package ([e660545](https://github.com/ng-packagr/ng-packagr/commit/e66054525de5c8b8beedffda58b0a8d781f35629))
* include scope name in module name of Rollup bundle ([#280](https://github.com/ng-packagr/ng-packagr/issues/280)) ([3446453](https://github.com/ng-packagr/ng-packagr/commit/3446453f1dad8a4a937bca9928913bd2a3dfe7e8)), closes [#251](https://github.com/ng-packagr/ng-packagr/issues/251)
* incorrect cache path ([66a947c](https://github.com/ng-packagr/ng-packagr/commit/66a947cdc367ed0833edef44b4db9fe536b3081b))
* incorrect detection of potential dependent entry-points ([932bf48](https://github.com/ng-packagr/ng-packagr/commit/932bf48fc2e81b3a01f5f3fd8e6316cfbcad8ae3)), closes [#1510](https://github.com/ng-packagr/ng-packagr/issues/1510)
* incorrect path resolution for entry-points when generating FESM ([f2cd914](https://github.com/ng-packagr/ng-packagr/commit/f2cd914dfbb597357c8dce0d1f5f41fd76b210b9)), closes [#2838](https://github.com/ng-packagr/ng-packagr/issues/2838)
* initialize worker options post browserlist setup ([ff90621](https://github.com/ng-packagr/ng-packagr/commit/ff906218cb198b0e4653528fac7df184294b70f4))
* inline empty stylesheets ([aa621b1](https://github.com/ng-packagr/ng-packagr/commit/aa621b14cc762db05323ccab690d6944a33d9c3f))
* inline sourcemaps as base64-encoded data URI in esm5/esm015 ([#812](https://github.com/ng-packagr/ng-packagr/issues/812)) ([095feb1](https://github.com/ng-packagr/ng-packagr/commit/095feb162605d9b5b426c4fe3a3951c927cbc587)), closes [#785](https://github.com/ng-packagr/ng-packagr/issues/785) [#803](https://github.com/ng-packagr/ng-packagr/issues/803)
* internal method `dependsOn` appends instead of replacing ([#867](https://github.com/ng-packagr/ng-packagr/issues/867)) ([207f2ac](https://github.com/ng-packagr/ng-packagr/commit/207f2ac7412c1f3666845122dc8cbcd31fe9ec2f))
* invalid browsers version ranges ([547a11f](https://github.com/ng-packagr/ng-packagr/commit/547a11f166e9b6347fee25ea66e3801ee4e11564))
* issues with emitting declarationMap ([38ad52b](https://github.com/ng-packagr/ng-packagr/commit/38ad52b0980428a300126c4d8b83c5d06d552f29)), closes [#1464](https://github.com/ng-packagr/ng-packagr/issues/1464)
* join paths instead of resolving ([0a54e7d](https://github.com/ng-packagr/ng-packagr/commit/0a54e7d076ce82e1e041df712fbfab569454e026)), closes [#2241](https://github.com/ng-packagr/ng-packagr/issues/2241)
* let `ngc` determine the typescript `emitFlags` ([#813](https://github.com/ng-packagr/ng-packagr/issues/813)) ([9b47d72](https://github.com/ng-packagr/ng-packagr/commit/9b47d72220e5c7b6b7de8b868fb70f6e0b19e6fc))
* link to angular 12 ivy docs ([be4c280](https://github.com/ng-packagr/ng-packagr/commit/be4c280bc1e6da1b8af3631b292444980063de80)), closes [#2228](https://github.com/ng-packagr/ng-packagr/issues/2228)
* lock rollup version ([75ac180](https://github.com/ng-packagr/ng-packagr/commit/75ac180744cf66b61ddb10e9677ac07a22d56a4d)), closes [#1431](https://github.com/ng-packagr/ng-packagr/issues/1431)
* lock rollup-plugin-commonjs dependency at 8.3.0 ([#658](https://github.com/ng-packagr/ng-packagr/issues/658)) ([59d0c3b](https://github.com/ng-packagr/ng-packagr/commit/59d0c3b4ce95f7fc635c8d84c09c6d8f53758748)), closes [#657](https://github.com/ng-packagr/ng-packagr/issues/657)
* log error from stylesheet pre-processor ([077fc65](https://github.com/ng-packagr/ng-packagr/commit/077fc65f20364636db8dca1fb3e9106a887cb7ec)), closes [#1983](https://github.com/ng-packagr/ng-packagr/issues/1983)
* log error message only on build failure ([51643e1](https://github.com/ng-packagr/ng-packagr/commit/51643e1962219fd7fc3f3ca3756b6f69e6583325))
* logger print errors and warnings to stderr ([9534d19](https://github.com/ng-packagr/ng-packagr/commit/9534d1947688f9b81caa08834d27a624b2eb1a5f))
* make a dummy release for 1.0.1 ([a6d6893](https://github.com/ng-packagr/ng-packagr/commit/a6d6893c34f538ae636ad55f80f28d20a65bf583))
* make cache paths safe for windows ([5b58731](https://github.com/ng-packagr/ng-packagr/commit/5b5873188d09af862aa756741b2d0857e1308c7b))
* map `rxjs/util/*` to its UMD module ID by default ([#580](https://github.com/ng-packagr/ng-packagr/issues/580)) ([7c452fb](https://github.com/ng-packagr/ng-packagr/commit/7c452fb07560bcbc3eb1c32c20fe419af8a30c99)), closes [#579](https://github.com/ng-packagr/ng-packagr/issues/579)
* merge instead of overriding package exports ([f238118](https://github.com/ng-packagr/ng-packagr/commit/f2381189b53bb7b067b95279d76a767908d4be1f))
* migrate code base to compiler-cli@6 ([927e581](https://github.com/ng-packagr/ng-packagr/commit/927e5813a75a8cc5ea75856cf0d1c032b7c1c8b3))
* migrate dependencies to angular 6 ([13917eb](https://github.com/ng-packagr/ng-packagr/commit/13917eb086e6ed87a51edb0625c190baef99bbe2))
* missing options when setting custom tsconfig ([#786](https://github.com/ng-packagr/ng-packagr/issues/786)) ([d687853](https://github.com/ng-packagr/ng-packagr/commit/d687853454f727d40c6c4dc1ec635e58292b0a86))
* move `keepLifecycleScripts` to ngPackage conf ([#688](https://github.com/ng-packagr/ng-packagr/issues/688)) ([8eb6667](https://github.com/ng-packagr/ng-packagr/commit/8eb666780a6e7f1c2f3bda38d1bc4b7570128efd))
* move less from devDependencies to dependencies ([09ef8ce](https://github.com/ng-packagr/ng-packagr/commit/09ef8cec68b49fa4800401c21437f8baa714bdc4)), closes [#88](https://github.com/ng-packagr/ng-packagr/issues/88)
* move ng-package.schema.json to dist root directory ([ad6325b](https://github.com/ng-packagr/ng-packagr/commit/ad6325baa00aff76d7bea0726f06cdbaf0740aa7))
* no elements in sequence error ([#1029](https://github.com/ng-packagr/ng-packagr/issues/1029)) ([e80cc22](https://github.com/ng-packagr/ng-packagr/commit/e80cc22f2d4927c1c27a67b117f48f0327be32e5))
* no provider for `InjectionToken ng.v5.defaultTsConfig` ([6652727](https://github.com/ng-packagr/ng-packagr/commit/665272791aa54057d8583993c48a7b59bf119e1c))
* normalize NGCC tsconfig path ([3846b40](https://github.com/ng-packagr/ng-packagr/commit/3846b40102b3cd8b48188fa08203961552700523))
* only copy README.md from entry-points ([23c718d](https://github.com/ng-packagr/ng-packagr/commit/23c718d04eea85e015b4c261310b7bd0c39e5311)), closes [#2564](https://github.com/ng-packagr/ng-packagr/issues/2564)
* only watch dependent files ([5bf477d](https://github.com/ng-packagr/ng-packagr/commit/5bf477dc1df72b053830aed659c94108027ce25a)), closes [#1829](https://github.com/ng-packagr/ng-packagr/issues/1829) [#2042](https://github.com/ng-packagr/ng-packagr/issues/2042) [#1723](https://github.com/ng-packagr/ng-packagr/issues/1723)
* overhaul the stylesheet pipeline ([e2dc6e1](https://github.com/ng-packagr/ng-packagr/commit/e2dc6e14665460c4feb0a7feac1ef2f96f280d48)), closes [#1873](https://github.com/ng-packagr/ng-packagr/issues/1873) [#2918](https://github.com/ng-packagr/ng-packagr/issues/2918) [#2660](https://github.com/ng-packagr/ng-packagr/issues/2660) [#2654](https://github.com/ng-packagr/ng-packagr/issues/2654)
* package exports merging during watch mode ([af36c3a](https://github.com/ng-packagr/ng-packagr/commit/af36c3ac3c7b952923424b798518d27ccac6c132)), closes [#2168](https://github.com/ng-packagr/ng-packagr/issues/2168)
* **package:** update rollup to version 0.42.0 ([#37](https://github.com/ng-packagr/ng-packagr/issues/37)) ([75f1811](https://github.com/ng-packagr/ng-packagr/commit/75f1811f8b24c9d8ff6d1e1bf6884bc3a30cd389))
* **package:** update rollup to version 0.49.0 ([b5b920c](https://github.com/ng-packagr/ng-packagr/commit/b5b920cb5a33d707e64130db05a8bdcca31a114c))
* parse styles cache as JSON ([f778b92](https://github.com/ng-packagr/ng-packagr/commit/f778b92f9562d248a337b5177cdeaa22a8f7ab74))
* pass 'setParentNodes' when calling 'createCompilerHost' ([#625](https://github.com/ng-packagr/ng-packagr/issues/625)) ([9baa0bc](https://github.com/ng-packagr/ng-packagr/commit/9baa0bc8ce95d49fa6cbb2066d254bf1e521976c))
* pass empty string to `less.render()` ([f5106eb](https://github.com/ng-packagr/ng-packagr/commit/f5106eb896be1c52c7eb855c33c69acda918f4e4)), closes [#165](https://github.com/ng-packagr/ng-packagr/issues/165)
* pass file pathes to `postcss.process()` ([#77](https://github.com/ng-packagr/ng-packagr/issues/77)) ([1051831](https://github.com/ng-packagr/ng-packagr/commit/105183112ddaca35b82d2bf78b21dd6b073b51ca))
* pass tsconfig path to ngcc ([fd18984](https://github.com/ng-packagr/ng-packagr/commit/fd18984e9e7e6b04b7fbbcd95c1adce5aff3c940))
* peer depend on angular >=5.0.0 <6.0.0, typescript >= 2.4.2 < 3.0.0 ([3674f0e](https://github.com/ng-packagr/ng-packagr/commit/3674f0e4cd79cd5a033005031c94b4fbb303bc22))
* pin rollup dependency to 0.53.0 ([13a79d4](https://github.com/ng-packagr/ng-packagr/commit/13a79d4e45dbe5ad4d7aef233f8ba9d826667d03))
* prevent accidental secondary entry resolution ([#229](https://github.com/ng-packagr/ng-packagr/issues/229)) ([ee5949b](https://github.com/ng-packagr/ng-packagr/commit/ee5949b89f6431953556b5f08837f487a633fbf8))
* print `@angular/compiler-cli` version ([b0e362e](https://github.com/ng-packagr/ng-packagr/commit/b0e362e61b08b4bfd971648c2cc4e8e74e6daacc))
* print rollup warnings to `log.warn()` ([356a01b](https://github.com/ng-packagr/ng-packagr/commit/356a01b25387f7463197b5486000c1058dd9bb76))
* process only the typings files of packages with NGCC ([9122e7f](https://github.com/ng-packagr/ng-packagr/commit/9122e7ffdfec64e7418791f88fbb42a318f8aa4e))
* produce correct secondary package paths ([#197](https://github.com/ng-packagr/ng-packagr/issues/197)) ([4ca213e](https://github.com/ng-packagr/ng-packagr/commit/4ca213e357f98ed23b195adea3ff4cd8791c431e))
* properly handle rejected promises in utils ([#130](https://github.com/ng-packagr/ng-packagr/issues/130)) ([#126](https://github.com/ng-packagr/ng-packagr/issues/126)) ([d41c6b2](https://github.com/ng-packagr/ng-packagr/commit/d41c6b2a265b94b7dee7e6cc0314225dbfe4ecb9))
* provide supported browsers to esbuild ([4ed2e08](https://github.com/ng-packagr/ng-packagr/commit/4ed2e089d17ac19b0608012c8e509d643fc6e8ca))
* prune multiple import statements for `tslib` ([#588](https://github.com/ng-packagr/ng-packagr/issues/588)) ([2b6dac4](https://github.com/ng-packagr/ng-packagr/commit/2b6dac43c003fed6dbdf530fc1a880b214d82637)), closes [#587](https://github.com/ng-packagr/ng-packagr/issues/587)
* punctuation in changelog ([32ccc0f](https://github.com/ng-packagr/ng-packagr/commit/32ccc0ffd86c672c5ca8229a5c5f6ed8e2f2ab43))
* re prioritize ngcc `propertiesToConsider` properties based ([ea89fb3](https://github.com/ng-packagr/ng-packagr/commit/ea89fb31111e00b47600f2e51427bf9842a4ec76)), closes [/github.com/angular/angular-cli/blob/0d70565f9d80f1d765622eb8c8b2c3c701723599/packages/angular_devkit/build_angular/src/angular-cli-files/models/webpack-configs/browser.ts#L68](https://github.com/ng-packagr//github.com/angular/angular-cli/blob/0d70565f9d80f1d765622eb8c8b2c3c701723599/packages/angular_devkit/build_angular/src/angular-cli-files/models/webpack-configs/browser.ts/issues/L68)
* re-allow `index.ts` as entry-files ([8c5cc4f](https://github.com/ng-packagr/ng-packagr/commit/8c5cc4fff8846bafcd7210c310d9ef0d3f812709))
* read error when having files with spaces in less ([22cfdcc](https://github.com/ng-packagr/ng-packagr/commit/22cfdccdf920b0d8ab7f50419c5772fcbc5bcb57)), closes [#1197](https://github.com/ng-packagr/ng-packagr/issues/1197)
* read json config values thru `schema.$$get()` ([0c3130c](https://github.com/ng-packagr/ng-packagr/commit/0c3130c726dfcebae1abb719b5565fdd4d1dba2a))
* recognize aliased and namespace decorator imports ([#585](https://github.com/ng-packagr/ng-packagr/issues/585)) ([8f88c5a](https://github.com/ng-packagr/ng-packagr/commit/8f88c5af151b7f2e5e65b3e4d1b6b8a289b3991a))
* register ngc emit callback for `tsickle`  processing ([#384](https://github.com/ng-packagr/ng-packagr/issues/384)) ([15bd7c1](https://github.com/ng-packagr/ng-packagr/commit/15bd7c1fd955bfb1448a02cbbd808ac6f7dcc096))
* regression in cli defaults ([18515af](https://github.com/ng-packagr/ng-packagr/commit/18515af5d18513b471f5844622f3934e5dcfda01))
* relax on non-call-expression decorators in typescript parsing ([7135c42](https://github.com/ng-packagr/ng-packagr/commit/7135c42d2a2b710d1de86a96a0ecca2c47376999))
* relax version constraints, enable TypeScript 2.6 (w/ tsickle ^0.26.0) ([3c3c6a7](https://github.com/ng-packagr/ng-packagr/commit/3c3c6a7d0b847a4cffa1192e97db1bd6dc58e981))
* release commit message formatting ([300b4bf](https://github.com/ng-packagr/ng-packagr/commit/300b4bff0534d5fe1591063488b8ade3ef396900))
* release main thread on worker error ([eb3138a](https://github.com/ng-packagr/ng-packagr/commit/eb3138a85fd7e6400f1ee9bccc4138b5cdeab0d6))
* remove `@rollup/plugin-commonjs` ([0d306a3](https://github.com/ng-packagr/ng-packagr/commit/0d306a309e8d1ce3574f1bc2185b442c60149d4f))
* remove `files` property from default tsconfig ([c4cd3a7](https://github.com/ng-packagr/ng-packagr/commit/c4cd3a7bf482e1732d25afeaa76cc9d9c41a6efc)), closes [#2156](https://github.com/ng-packagr/ng-packagr/issues/2156)
* remove `umdModuleIds` for esm2015 flattening (rollup `es` format) ([#429](https://github.com/ng-packagr/ng-packagr/issues/429)) ([b103b74](https://github.com/ng-packagr/ng-packagr/commit/b103b74cd7ccc50f979456167cf095557f1a6751))
* remove custom namespaced sourceRoot in sourcemaps ([481dd8f](https://github.com/ng-packagr/ng-packagr/commit/481dd8f77c927b564e3d3eb8c79e6cecdc580b52)), closes [#1622](https://github.com/ng-packagr/ng-packagr/issues/1622)
* remove defaults from `languageLevel` ([7650c65](https://github.com/ng-packagr/ng-packagr/commit/7650c65e785c9c96ed70e0570694a6ae588ae4ab))
* remove direct imports to `rollup` ([45336ae](https://github.com/ng-packagr/ng-packagr/commit/45336ae69a22c95825e85afccf40ad526275f31b)), closes [#2749](https://github.com/ng-packagr/ng-packagr/issues/2749)
* remove duplicate declarations under `dist` ([#864](https://github.com/ng-packagr/ng-packagr/issues/864)) ([46fd858](https://github.com/ng-packagr/ng-packagr/commit/46fd85802ad14383ed7b0e78d7e4933a5a6663e0))
* remove hardcoded `moduleResolution` ([3f5448d](https://github.com/ng-packagr/ng-packagr/commit/3f5448dfce04e11af66fdaae25effc49f139e6ad))
* remove moduleId from rollup bundle options ([#444](https://github.com/ng-packagr/ng-packagr/issues/444)) ([da332d2](https://github.com/ng-packagr/ng-packagr/commit/da332d21de8990fab6e894880d513267bdc83d8a))
* remove nested `dist` folder ([#829](https://github.com/ng-packagr/ng-packagr/issues/829)) ([f9af7ca](https://github.com/ng-packagr/ng-packagr/commit/f9af7ca4cb89983f19ebcdfc104ee69b1f3a8522))
* remove opencollective postinstall scripts ([123f39a](https://github.com/ng-packagr/ng-packagr/commit/123f39a9b9ec92b9c97785180feaea7c5b6dfe2d))
* remove optional dependency on tsickle ([d3e46ce](https://github.com/ng-packagr/ng-packagr/commit/d3e46ce87d599fe5d2bb3ff57a3c3802277c3f35))
* remove redundant section in package.json ([5efad3a](https://github.com/ng-packagr/ng-packagr/commit/5efad3a25aba92a4d454620904045e2d40c6eeeb))
* remove terser warnings as these as not actionable ([9c80f62](https://github.com/ng-packagr/ng-packagr/commit/9c80f62fcb4b64f16d27de4b3a63dc1fc19ee790)), closes [#1394](https://github.com/ng-packagr/ng-packagr/issues/1394)
* remove trailing slash from dest ([426a081](https://github.com/ng-packagr/ng-packagr/commit/426a081abc8e076afc558586da0cf9cf3f65b78e)), closes [#2558](https://github.com/ng-packagr/ng-packagr/issues/2558)
* remove tslib from peerDependencies when adding it to dependencies ([2981f73](https://github.com/ng-packagr/ng-packagr/commit/2981f73ff264caca66886f4a62027d26e69e410b))
* removed default value from whitelistedNonPeerDependencies in json schema ([f0d38fc](https://github.com/ng-packagr/ng-packagr/commit/f0d38fc2185d0e9f4120565988b0dd70cda1de5b)), closes [#1892](https://github.com/ng-packagr/ng-packagr/issues/1892)
* replace `i` with checkmark when displaying a built entrypoint ([54b8968](https://github.com/ng-packagr/ng-packagr/commit/54b89684e751ba7b01d6ef4df2d2d4a203076a93)), closes [#1883](https://github.com/ng-packagr/ng-packagr/issues/1883)
* replace `node-sass-tilde-importer` with custom sass importer ([5cf363b](https://github.com/ng-packagr/ng-packagr/commit/5cf363b35fa33a7bf1aa979463b3ea6cb9814ab5)), closes [#2125](https://github.com/ng-packagr/ng-packagr/issues/2125)
* replace execFile with execFileSync to fix a potential malicious cmd injection ([bda0fff](https://github.com/ng-packagr/ng-packagr/commit/bda0fff3443301f252930a73fdc8fb9502de596d))
* replace opencollective-cli with opencollective-postinstall ([#1203](https://github.com/ng-packagr/ng-packagr/issues/1203)) ([44776da](https://github.com/ng-packagr/ng-packagr/commit/44776daf85424fd8fe39dae0db8203591aafa15f)), closes [#1178](https://github.com/ng-packagr/ng-packagr/issues/1178)
* report build errors ([d136422](https://github.com/ng-packagr/ng-packagr/commit/d13642212bee52d031bf00da88abef649f7b64fb))
* report Errors with stack traces, fail builds on promise rejection ([#36](https://github.com/ng-packagr/ng-packagr/issues/36)) ([6076074](https://github.com/ng-packagr/ng-packagr/commit/60760749f4d249bb738af9d5ca96bc7c4e447fd9))
* report ngc compiler diagnostics and throw an error ([#292](https://github.com/ng-packagr/ng-packagr/issues/292)) ([815509b](https://github.com/ng-packagr/ng-packagr/commit/815509bebe3b2e3020698ad82305c3481bcbae32))
* report typescript configuration errors ([31b508d](https://github.com/ng-packagr/ng-packagr/commit/31b508d4d8373ec460e0395cb255c7dac2d086bc))
* reset glob cache on file add ([0306d59](https://github.com/ng-packagr/ng-packagr/commit/0306d59586f43909a5d16e42b9e766869148ef66))
* resolve ESM files correctly on windows ([e476c7b](https://github.com/ng-packagr/ng-packagr/commit/e476c7bef530f87010d8da6320b5a507b73be996))
* resolve node_modules folder dynamically from typescript ([#211](https://github.com/ng-packagr/ng-packagr/issues/211)) ([9a7008d](https://github.com/ng-packagr/ng-packagr/commit/9a7008dce49f3abbb7751d9d3175bc9bd1bd45ee))
* resolve pathes relative to `ng-package.json` ([852ce43](https://github.com/ng-packagr/ng-packagr/commit/852ce43ff1f2b481d2308c1c7adfeeb4fc268e3c))
* respect secondary entry file customizations ([#198](https://github.com/ng-packagr/ng-packagr/issues/198)) ([9de7524](https://github.com/ng-packagr/ng-packagr/commit/9de75241aba6bcf511d88a465e8ffbc5bf59b03c))
* return redirect target of typescript source file ([#637](https://github.com/ng-packagr/ng-packagr/issues/637)) ([c1fced0](https://github.com/ng-packagr/ng-packagr/commit/c1fced0873e5007474e4c411a258d9955e996fe0)), closes [#473](https://github.com/ng-packagr/ng-packagr/issues/473)
* set `peerDependencies` to `tsickle: ^0.24.0` and `typescript: >=2.4.2 <2.6` ([#387](https://github.com/ng-packagr/ng-packagr/issues/387)) ([001f63f](https://github.com/ng-packagr/ng-packagr/commit/001f63fb9c8fc68e49ab574954a1e0f14f50f3d8))
* set browserslist defaults ([8223a47](https://github.com/ng-packagr/ng-packagr/commit/8223a476e816e9548ec945e22e04902712fcab4b)), closes [/github.com/browserslist/browserslist/blob/83764ea81ffaa39111c204b02c371afa44a4ff07/index.js#L516-L522](https://github.com/ng-packagr//github.com/browserslist/browserslist/blob/83764ea81ffaa39111c204b02c371afa44a4ff07/index.js/issues/L516-L522)
* set flatModuleId to the name from package.json ([#24](https://github.com/ng-packagr/ng-packagr/issues/24)) ([1e2c33f](https://github.com/ng-packagr/ng-packagr/commit/1e2c33f31d449e6bdb6574e94a6dff2ca73a4eed))
* set peerDependency tsickle to `>=0.24.0 <0.26" ([d682cd2](https://github.com/ng-packagr/ng-packagr/commit/d682cd278ae79da74fc5fd462fc0b110b2dd916a))
* set sourceRoot to empty string to correctly resolve dts sources ([94dd2d8](https://github.com/ng-packagr/ng-packagr/commit/94dd2d8881bc06696fbe8e6b67f9f8a8e761fa96))
* show actionable error when component resource is not found ([5dcba25](https://github.com/ng-packagr/ng-packagr/commit/5dcba25c284b55f407ddd6bdc7db59ce5436bcca))
* show error message on nested circular dependency ([06e6700](https://github.com/ng-packagr/ng-packagr/commit/06e67004dc9310c67c7f9d36d16165be32779145)), closes [#2001](https://github.com/ng-packagr/ng-packagr/issues/2001)
* show error when template file is unreadable ([c0ba153](https://github.com/ng-packagr/ng-packagr/commit/c0ba1538f1665b8c5f8285795bf7df18f896f537))
* show proper path of failure on sass inline ([#380](https://github.com/ng-packagr/ng-packagr/issues/380)) ([8c380aa](https://github.com/ng-packagr/ng-packagr/commit/8c380aa873f2a13246f23a2f86418a4ed7442b2a))
* show schema errors ([cdf0e9c](https://github.com/ng-packagr/ng-packagr/commit/cdf0e9c122f7bea2651d9bad7a7ad79a677875ad))
* show warning when configuring ng-packagr in `package.json` ([037ccf5](https://github.com/ng-packagr/ng-packagr/commit/037ccf5cf30c1680251199b6affb7ecb0c89ee01))
* skip NGCC when file system is read only ([0e44793](https://github.com/ng-packagr/ng-packagr/commit/0e447938bad14bd4cb8b8357764d690ef3b40857))
* sourcemap should not differ based on build path ([1504c8e](https://github.com/ng-packagr/ng-packagr/commit/1504c8e06a64aee5b3ecc09327af25de5bd58385))
* sourcemap should not differ based on build path ([6f946b7](https://github.com/ng-packagr/ng-packagr/commit/6f946b7c91c88fed1d6aa3fa6e06335d5769e86e))
* strip bom from templates and stylesheet files ([#571](https://github.com/ng-packagr/ng-packagr/issues/571)) ([5830e6a](https://github.com/ng-packagr/ng-packagr/commit/5830e6a1135528d2b6d81a61e13e9109df88746a)), closes [#487](https://github.com/ng-packagr/ng-packagr/issues/487)
* strip comments from processed styles ([#512](https://github.com/ng-packagr/ng-packagr/issues/512)) ([542aed2](https://github.com/ng-packagr/ng-packagr/commit/542aed2bcf0221ed1a6b89daf2b5a720b15181e5)), closes [#503](https://github.com/ng-packagr/ng-packagr/issues/503)
* strip utf-8 bom when reading files ([cb34889](https://github.com/ng-packagr/ng-packagr/commit/cb34889e580e5e282b0531e6138a2db87b3c24ac)), closes [#87](https://github.com/ng-packagr/ng-packagr/issues/87)
* support new cdk modules 'accordion' and 'layout' (@angular/cdk@5.0.0-rc0) ([#297](https://github.com/ng-packagr/ng-packagr/issues/297)) ([3016585](https://github.com/ng-packagr/ng-packagr/commit/3016585f776e309694f778e5423150a726266aee))
* support of Safari TP versions ([fa80ee0](https://github.com/ng-packagr/ng-packagr/commit/fa80ee02c6ccc0da7a35da94dc8e91d951ac6bb2))
* support rxjs lettable operators ([#307](https://github.com/ng-packagr/ng-packagr/issues/307)) ([5de8045](https://github.com/ng-packagr/ng-packagr/commit/5de8045a9dfc77e8aabe2e7b8b7b1a76f00e49bd)), closes [#247](https://github.com/ng-packagr/ng-packagr/issues/247)
* support string as plugin option in custom postcss plugin config ([bb67204](https://github.com/ng-packagr/ng-packagr/commit/bb67204aca396a214cf5b7c2a679bc1aefdb7f87))
* support the ng-package.json in secondary entry points ([#1406](https://github.com/ng-packagr/ng-packagr/issues/1406)) ([8b97bfa](https://github.com/ng-packagr/ng-packagr/commit/8b97bfa6861135849408023e88ff549713a5fc0a))
* support WASM-based esbuild optimizer fallback ([68b5f0b](https://github.com/ng-packagr/ng-packagr/commit/68b5f0b7c1798a7f79a4c3acf1415842b9973bce)), closes [angular/angular-cli#21687](https://github.com/angular/angular-cli/issues/21687)
* supports extracting styles from multiple styleUrls ([#455](https://github.com/ng-packagr/ng-packagr/issues/455)) ([4cfd98d](https://github.com/ng-packagr/ng-packagr/commit/4cfd98d6cd9da7e35fcaea8c555abf9d1f0a3c35))
* switch to a more accurate module analyse ([92ca053](https://github.com/ng-packagr/ng-packagr/commit/92ca053f113159dd91db4b520c32cdfad77de15e)), closes [#1523](https://github.com/ng-packagr/ng-packagr/issues/1523)
* temporarily disable es5 source maps ([804dd8c](https://github.com/ng-packagr/ng-packagr/commit/804dd8c1d3394e6221fdea30c1ae0f4aff2753f8))
* termination of process when using CTRL+C ([8f6c46e](https://github.com/ng-packagr/ng-packagr/commit/8f6c46ef4a8d418c37778b687f8f6bbb2d73f876))
* throw an error when a circular dependency is detected ([#888](https://github.com/ng-packagr/ng-packagr/issues/888)) ([ada4081](https://github.com/ng-packagr/ng-packagr/commit/ada408165ed851d2e61263ef09078480ca647d09)), closes [#855](https://github.com/ng-packagr/ng-packagr/issues/855)
* throw error on circular dependencies ([af1d2f3](https://github.com/ng-packagr/ng-packagr/commit/af1d2f3c5ba249c44c8d007136a5764c94dc2cd4)), closes [#1551](https://github.com/ng-packagr/ng-packagr/issues/1551)
* tsconfig path mapping ([4421e6f](https://github.com/ng-packagr/ng-packagr/commit/4421e6fd3b14a6885c831510293b3107d6343846))
* tsickle references to non imported values when using Angular 8 ([de5894b](https://github.com/ng-packagr/ng-packagr/commit/de5894bbc6bd8d51d67ad202168e20819e3d86bb))
* typo in changelog ([24e7dea](https://github.com/ng-packagr/ng-packagr/commit/24e7dea67864dc276f4e158be845f4f78de00ee7))
* UMD sourceMappingURL should point to file ([ab02f0f](https://github.com/ng-packagr/ng-packagr/commit/ab02f0f4c051c76240ab753110e65ea57851dc0b))
* unable to add additional conditions to entry-point subpaths controlled by ng-packagr ([a63ebb7](https://github.com/ng-packagr/ng-packagr/commit/a63ebb7b37a9ab0b266056acf40cf4a21dfbc2a0))
* unable to use an arbitrarily named config file ([#886](https://github.com/ng-packagr/ng-packagr/issues/886)) ([a50bf7d](https://github.com/ng-packagr/ng-packagr/commit/a50bf7dd678434a6c58071e2906fb7f18195876a)), closes [#878](https://github.com/ng-packagr/ng-packagr/issues/878)
* unpin rollup-plugin-commonjs to version ^9.1.3 ([#823](https://github.com/ng-packagr/ng-packagr/issues/823)) ([17f791f](https://github.com/ng-packagr/ng-packagr/commit/17f791fb1234c8b8968d37b60ca25156373039b5))
* update @angular/cdk to version ~11.2.0 ([d96dbab](https://github.com/ng-packagr/ng-packagr/commit/d96dbab73594e107ca3ecb9c13c99a82158f4e5e))
* update @angular/cdk to version ~8.0.0 ([#1301](https://github.com/ng-packagr/ng-packagr/issues/1301)) ([f7a462a](https://github.com/ng-packagr/ng-packagr/commit/f7a462a1756374de629ed167b2890a20fe868a2b))
* update @angular/cdk to version ~8.2.0 ([0007fef](https://github.com/ng-packagr/ng-packagr/commit/0007fefdca1e3ff9fd3ae4bc6578a9c64077a73d))
* update @angular/common to version ~10.2.0 ([7b51ebd](https://github.com/ng-packagr/ng-packagr/commit/7b51ebdea50e841928ccede199d230b3a6753bef))
* update @angular/common to version ~9.1.0 ([fd8c0a9](https://github.com/ng-packagr/ng-packagr/commit/fd8c0a9403d8d69bc899ff640cd565cfdcf3e7fd))
* update @rollup/plugin-commonjs to version ^12.0.0 ([e89c5b1](https://github.com/ng-packagr/ng-packagr/commit/e89c5b1d325a83230428b1d8874d4a46fb6a0514))
* update @rollup/plugin-commonjs to version ^13.0.0 ([9413dbd](https://github.com/ng-packagr/ng-packagr/commit/9413dbd34f8d6a57abbfb9d71a72e97ecac47e1c))
* update @rollup/plugin-commonjs to version ^14.0.0 ([6581390](https://github.com/ng-packagr/ng-packagr/commit/6581390f3f9140e7b4bd80312b1740821443132c))
* update @rollup/plugin-commonjs to version ^15.0.0 ([cc3254a](https://github.com/ng-packagr/ng-packagr/commit/cc3254aa230e1c94991514e780facc2eb19b4546))
* update @rollup/plugin-commonjs to version ^16.0.0 ([75e5d51](https://github.com/ng-packagr/ng-packagr/commit/75e5d51e4260d2c514cb8492f5d53b925d2cef25))
* update @rollup/plugin-commonjs to version ^17.0.0 ([b79622a](https://github.com/ng-packagr/ng-packagr/commit/b79622ab105bbbd41494369fed38159ad4783885))
* update @rollup/plugin-commonjs to version 18.0.0 ([76f6f43](https://github.com/ng-packagr/ng-packagr/commit/76f6f43d468d0cae576c533e5e9be3a04aa32aa9))
* update @rollup/plugin-node-resolve to version ^10.0.0 ([e76b97b](https://github.com/ng-packagr/ng-packagr/commit/e76b97b0a736fcfdfc7e8d0abd5c317a352cf856))
* update @rollup/plugin-node-resolve to version ^11.0.0 ([f45658a](https://github.com/ng-packagr/ng-packagr/commit/f45658a4aeb03316094803b923f6d2cf6965aee7))
* update @rollup/plugin-node-resolve to version ^8.0.0 ([b2ac9a2](https://github.com/ng-packagr/ng-packagr/commit/b2ac9a291a1ce7bcdb33f00b04408ccc6c76e71c))
* update @rollup/plugin-node-resolve to version ^9.0.0 ([47606fd](https://github.com/ng-packagr/ng-packagr/commit/47606fd2ae254e024d9fdcac11489e114ced145a))
* update ajv to version 8.0.0 ([8d24c20](https://github.com/ng-packagr/ng-packagr/commit/8d24c207bd2485a2196d20ecb22ebd6bb84d78e6))
* update autoprefixer to ^9.0.0, browserslist to ^4.0.0 ([#1010](https://github.com/ng-packagr/ng-packagr/issues/1010)) ([2171398](https://github.com/ng-packagr/ng-packagr/commit/21713989aff09f381725dd12b5ee280179baee37))
* update autoprefixer to version ^8.0.0 ([#615](https://github.com/ng-packagr/ng-packagr/issues/615)) ([a60bd88](https://github.com/ng-packagr/ng-packagr/commit/a60bd8810de5a08b17f57cae4096c077312d93c0))
* update browserslist config to include last 2 Chrome versions ([1519c8d](https://github.com/ng-packagr/ng-packagr/commit/1519c8dd9828b192170fd43fa01b42b0c5ad7d4e)), closes [angular/angular#48669](https://github.com/angular/angular/issues/48669)
* update browserslist to version ^3.0.0 ([#610](https://github.com/ng-packagr/ng-packagr/issues/610)) ([2f50354](https://github.com/ng-packagr/ng-packagr/commit/2f50354e75e4601f633eefbcb80b0f525ff067ca))
* update chalk to version ^4.0.0 ([bbad22e](https://github.com/ng-packagr/ng-packagr/commit/bbad22ecbf71018e8612cfd6e2d06d5c125bd44b))
* update chokidar to version ^3.0.0 ([2f0e75f](https://github.com/ng-packagr/ng-packagr/commit/2f0e75f529f1e5b6fcac1f7eafcf4e27d28a850f))
* update commander to version ^3.0.0 ([dcd4853](https://github.com/ng-packagr/ng-packagr/commit/dcd4853d3701bf80a3cc164a753d81d2331a56f6))
* update commander to version ^4.0.0 ([ee41977](https://github.com/ng-packagr/ng-packagr/commit/ee41977371606c4255c2995d2938bc96e9b7e680))
* update commander to version ^5.0.0 ([0ec80b5](https://github.com/ng-packagr/ng-packagr/commit/0ec80b56582112bcc851c35391acba283e2fb6dc))
* update commander to version ^6.0.0 ([ec736e5](https://github.com/ng-packagr/ng-packagr/commit/ec736e5df6978be79dca236683936941f349a8e5))
* update commander to version ^7.0.0 ([289b019](https://github.com/ng-packagr/ng-packagr/commit/289b019992cb9f3fb1c0c70aedd82e3b04e70ea5))
* update core-js to version ^3.0.0 ([b985c49](https://github.com/ng-packagr/ng-packagr/commit/b985c49ba34de4b9da61d86b736273fca5bb6889))
* update cssnano to version 5.0.0 ([1ad8fe6](https://github.com/ng-packagr/ng-packagr/commit/1ad8fe67fca8d7e0bf9211e1383de1f2ae311de1))
* update dependendy tsickle to >=0.25.5 <0.26.0 ([#456](https://github.com/ng-packagr/ng-packagr/issues/456)) ([136867a](https://github.com/ng-packagr/ng-packagr/commit/136867adf4fe2637f56716ce569b5fe25e170474)), closes [#452](https://github.com/ng-packagr/ng-packagr/issues/452)
* update fs-extra to version ^5.0.0 ([#400](https://github.com/ng-packagr/ng-packagr/issues/400)) ([9e6d081](https://github.com/ng-packagr/ng-packagr/commit/9e6d08160b9efa6e83401bac9a9e5d53ac5b5076))
* update fs-extra to version ^6.0.0 ([#825](https://github.com/ng-packagr/ng-packagr/issues/825)) ([2aabd33](https://github.com/ng-packagr/ng-packagr/commit/2aabd33965258443f64bda4fc268bdd599037989))
* update fs-extra to version ^7.0.0 ([#1003](https://github.com/ng-packagr/ng-packagr/issues/1003)) ([0fb2138](https://github.com/ng-packagr/ng-packagr/commit/0fb213894eea942d69bfae8d3ba5b1662fc6586a))
* update fs-extra to version ^8.0.0 ([de09a1a](https://github.com/ng-packagr/ng-packagr/commit/de09a1a47717a7238defcbf1e5fd06a78a871c23))
* update fs-extra to version ^9.0.0 ([eb2cd7f](https://github.com/ng-packagr/ng-packagr/commit/eb2cd7f404eb8ead0a5dc3d3924744f0631c37c2))
* update less to version ^3.0.0 ([#611](https://github.com/ng-packagr/ng-packagr/issues/611)) ([f45d89d](https://github.com/ng-packagr/ng-packagr/commit/f45d89d3e0900a48cda085288d39d12d8ce54f92))
* update less to version ^4.0.0 ([db8a459](https://github.com/ng-packagr/ng-packagr/commit/db8a45956555ff96a0a7fc087b8c806d0a2ab93d))
* update list of known tailwind configuration files ([50a7114](https://github.com/ng-packagr/ng-packagr/commit/50a7114621d71a637d744b62f40725746130b8f4))
* update node-sass to v4.9.3 ([#1046](https://github.com/ng-packagr/ng-packagr/issues/1046)) ([befb3da](https://github.com/ng-packagr/ng-packagr/commit/befb3daae68c2b09c3358b6fb3ffc5485e797814)), closes [#1045](https://github.com/ng-packagr/ng-packagr/issues/1045)
* update postcss to version ^7.0.0 ([#1004](https://github.com/ng-packagr/ng-packagr/issues/1004)) ([e2a3905](https://github.com/ng-packagr/ng-packagr/commit/e2a3905ad7ab2032322fddd2253158dd5c3810e7))
* update postcss-url to version ^8.0.0 ([#1042](https://github.com/ng-packagr/ng-packagr/issues/1042)) ([6b4ba96](https://github.com/ng-packagr/ng-packagr/commit/6b4ba96949f71fb77bb90849a0e7fa1bf4de9192))
* update read-pkg-up to version ^4.0.0 ([#955](https://github.com/ng-packagr/ng-packagr/issues/955)) ([c07e888](https://github.com/ng-packagr/ng-packagr/commit/c07e8889892e62d1b2dbb7c5be983c4aedfa4fbf))
* update read-pkg-up to version ^5.0.0 ([cb172fa](https://github.com/ng-packagr/ng-packagr/commit/cb172fa560a22ce61dd6dd63cac78473bdbc8f64))
* update rimraf to version ^3.0.0 ([9236102](https://github.com/ng-packagr/ng-packagr/commit/9236102dda427479497d759febdb27d192f79c2a))
* update rollup to version `^0.55.0` ([#534](https://github.com/ng-packagr/ng-packagr/issues/534)) ([0cb0cce](https://github.com/ng-packagr/ng-packagr/commit/0cb0cce2c241e38b4228bfeb6c700dd0ec3ebd72)), closes [#488](https://github.com/ng-packagr/ng-packagr/issues/488) [#523](https://github.com/ng-packagr/ng-packagr/issues/523)
* update rollup to version `^0.65.0` ([03db010](https://github.com/ng-packagr/ng-packagr/commit/03db010d1035efb7004421f1a7ee75e82dae29d6))
* update rollup to version ^0.52.0 ([#318](https://github.com/ng-packagr/ng-packagr/issues/318)) ([317c88b](https://github.com/ng-packagr/ng-packagr/commit/317c88b3155f2e28b6c2f895465618915ed625f0))
* update rollup to version ^0.53.0 ([#438](https://github.com/ng-packagr/ng-packagr/issues/438)) ([8918809](https://github.com/ng-packagr/ng-packagr/commit/8918809bc611eb5f5b607aed680a89b779a3d6d7))
* update rollup to version ^0.58.0 ([#772](https://github.com/ng-packagr/ng-packagr/issues/772)) ([cfcf3f9](https://github.com/ng-packagr/ng-packagr/commit/cfcf3f901f9d513dbcb0da987715599c95fb2138))
* update rollup to version ^0.59.0 ([#876](https://github.com/ng-packagr/ng-packagr/issues/876)) ([57f5ed9](https://github.com/ng-packagr/ng-packagr/commit/57f5ed9c2fb8dffa4b7dfc586245b9c0b5480f57))
* update rollup to version ^0.60.0 ([#926](https://github.com/ng-packagr/ng-packagr/issues/926)) ([9de5a1d](https://github.com/ng-packagr/ng-packagr/commit/9de5a1d6a8fbf039efd3c5efba5395525af4b325))
* update rollup to version ^0.62.0 ([#963](https://github.com/ng-packagr/ng-packagr/issues/963)) ([e44ab14](https://github.com/ng-packagr/ng-packagr/commit/e44ab147a185b6b361524d3146bfb9212fddf3b5))
* update rollup to version ^0.63.0 ([#1005](https://github.com/ng-packagr/ng-packagr/issues/1005)) ([5764f38](https://github.com/ng-packagr/ng-packagr/commit/5764f3856c68056832413af2da3228b548b150ad))
* update rollup to version ^0.64.0 ([#1039](https://github.com/ng-packagr/ng-packagr/issues/1039)) ([5d1ab49](https://github.com/ng-packagr/ng-packagr/commit/5d1ab4958771c6dd13835e326037faa1f4039391))
* update rollup to version ^0.64.0 ([#1047](https://github.com/ng-packagr/ng-packagr/issues/1047)) ([8cb4780](https://github.com/ng-packagr/ng-packagr/commit/8cb4780c244ad418192e73c0d9abd1d33770bbbf))
* update rollup to version ^0.66.0 ([3d381b0](https://github.com/ng-packagr/ng-packagr/commit/3d381b00f57c90617233c1e42ec1e8439aee9a33))
* update rollup to version ^0.67.0 ([4422aa1](https://github.com/ng-packagr/ng-packagr/commit/4422aa13090be6734fdec708859be8c5ca0cf28e))
* update rollup to version 1.26.2 ([8e91477](https://github.com/ng-packagr/ng-packagr/commit/8e91477c3256ea396ae4b36699cdb6ac83493d07))
* update rollup to version 1.26.3 ([1a67c7c](https://github.com/ng-packagr/ng-packagr/commit/1a67c7c062889e8ec8a803293a31432b422ef4f0))
* update rollup to version 1.26.4 ([844f7d3](https://github.com/ng-packagr/ng-packagr/commit/844f7d3c963c1fc3dd89be1a2b21fa2d870ebdcc))
* update rollup to version 1.26.5 ([cb5bda7](https://github.com/ng-packagr/ng-packagr/commit/cb5bda7c3fc65c2068bdb2f01f6ccf646b828856))
* update rollup to version 1.27.11 ([8af4d10](https://github.com/ng-packagr/ng-packagr/commit/8af4d103d6f3fad706eb2ab8be9d4781213e06e0))
* update rollup to version 1.27.14 ([d3fadce](https://github.com/ng-packagr/ng-packagr/commit/d3fadcebae3ec1d75c34d7c7ab43174b00c5e874))
* update rollup to version 1.27.2 ([abf0ae4](https://github.com/ng-packagr/ng-packagr/commit/abf0ae4dca7a7033d6920c0b1ea80677b0c4539c))
* update rollup to version 1.27.4 ([4eb6b74](https://github.com/ng-packagr/ng-packagr/commit/4eb6b74f336b7f4a5ef51c59c2948dc3022137e9))
* update rollup to version 1.27.5 ([7877045](https://github.com/ng-packagr/ng-packagr/commit/78770458d15f20c7f736b7f7ca7a987538107e03))
* update rollup to version 1.27.6 ([77fbff4](https://github.com/ng-packagr/ng-packagr/commit/77fbff436185c810de71fe19a9b5ea3d5a0b697c))
* update rollup to version 1.27.7 ([2400425](https://github.com/ng-packagr/ng-packagr/commit/2400425f54fa4fe48c03a086e94f30a093dfb54d))
* update rollup to version 1.27.8 ([7f623d9](https://github.com/ng-packagr/ng-packagr/commit/7f623d9fdc9e9b06f39706524bca4c748b78a55c))
* update rollup to version 1.27.9 ([3505645](https://github.com/ng-packagr/ng-packagr/commit/3505645d96bc25edb621a33196e3d0dfa9159f12))
* update rollup to version 1.28.0 ([624f31f](https://github.com/ng-packagr/ng-packagr/commit/624f31fb2c9bb7a8650a94ddfe6270cdf47bdd59))
* update rollup to version 1.29.0 ([04fa486](https://github.com/ng-packagr/ng-packagr/commit/04fa486d27822a355fbeb9c4f0bfb42fd7d15d92))
* update rollup to version 1.29.1 ([64e380d](https://github.com/ng-packagr/ng-packagr/commit/64e380df8c2aa7bf98918b648e844017a25f753c))
* update rollup to version 1.30.0 ([90eb47d](https://github.com/ng-packagr/ng-packagr/commit/90eb47d3cf4486b3585fcb2f7644f7ba2ee13c09))
* update rollup to version 1.30.1 ([a027395](https://github.com/ng-packagr/ng-packagr/commit/a027395af146d69f6c6a874b4e299f4a6cce625e))
* update rollup to version 1.31.0 ([f8704fd](https://github.com/ng-packagr/ng-packagr/commit/f8704fdc678e014e2d44dfc546664f7473bbf1c9))
* update rollup to version 1.31.1 ([36830f4](https://github.com/ng-packagr/ng-packagr/commit/36830f40a71662667d15a402bac9868092abfed5))
* update rollup to version 1.32.0 ([0e414ce](https://github.com/ng-packagr/ng-packagr/commit/0e414cecd8a386b426a0147d4d0688043e6d6e87))
* update rollup to version 1.32.1 ([9611545](https://github.com/ng-packagr/ng-packagr/commit/9611545160dae264e4988462551762d0c3f667eb))
* update rollup to version 2.0.3 ([f3a34cb](https://github.com/ng-packagr/ng-packagr/commit/f3a34cb3d2dee3ae878e1279bd0194241f434e7e))
* update rollup to version 2.0.4 ([988e1cc](https://github.com/ng-packagr/ng-packagr/commit/988e1cc597f36d3f231e24e2395bf3feeee32a4a))
* update rollup to version 2.0.5 ([cf85152](https://github.com/ng-packagr/ng-packagr/commit/cf85152145489292d3a54b399399066ad1b907a0))
* update rollup to version 2.0.6 ([0d290cb](https://github.com/ng-packagr/ng-packagr/commit/0d290cbab3b4b3e1f5e620db353ddb556f35a3ac))
* update rollup to version 2.1.0 ([2c399a9](https://github.com/ng-packagr/ng-packagr/commit/2c399a9b184d916977f4109aadc821faea7c36c2))
* update rollup to version 2.2.0 ([1de8443](https://github.com/ng-packagr/ng-packagr/commit/1de84435fcb2c3b1fea76a6797db02083ac03b81))
* update rollup to version 2.3.1 ([dffe028](https://github.com/ng-packagr/ng-packagr/commit/dffe0280e951da97177553fd0bbff9ce08803411))
* update rollup to version 2.3.2 ([1ddc07b](https://github.com/ng-packagr/ng-packagr/commit/1ddc07b58bcbe7dbbcf6d34170e5791def5909cb))
* update rollup to version 2.3.4 ([4d056b1](https://github.com/ng-packagr/ng-packagr/commit/4d056b1879da2f39c099b4b55c89870c97d00001))
* update rollup to version 2.3.5 ([0c0672d](https://github.com/ng-packagr/ng-packagr/commit/0c0672d7acd66c3e1506922685a926eb3e9c69f7))
* update rollup to version 2.45.2 ([fcf62fa](https://github.com/ng-packagr/ng-packagr/commit/fcf62faaf0f2f9fc40a93cf15742ece1f7bb6625))
* update rollup to version 2.6.1 ([4a95ddc](https://github.com/ng-packagr/ng-packagr/commit/4a95ddc2c5089e5c88ff542e4a06069ba72d241e))
* update rollup to version 2.7.1 ([ea8ca4a](https://github.com/ng-packagr/ng-packagr/commit/ea8ca4ab0c48a9f74fc33f6f3f38d5d19dce7263))
* update rollup to version 2.7.2 ([eb702ca](https://github.com/ng-packagr/ng-packagr/commit/eb702ca9cd00521d4afc566d6742a6dd9f15c966))
* update rollup to version 2.7.3 ([64e4708](https://github.com/ng-packagr/ng-packagr/commit/64e47080f8cb71d3454bf78a77c0ba70f96e09ee))
* update rollup to version 2.7.5 ([0736ba9](https://github.com/ng-packagr/ng-packagr/commit/0736ba9f6c19ddac125ec01d9e6120ee7740f27a))
* update rollup to version 2.8.0 ([e7aa579](https://github.com/ng-packagr/ng-packagr/commit/e7aa579c94d66c8fa67fd1b40c86053bb3891841))
* update rollup-plugin-commonjs to version ^9.1.2 ([#819](https://github.com/ng-packagr/ng-packagr/issues/819)) ([1731968](https://github.com/ng-packagr/ng-packagr/commit/1731968ad07e17bfc8b4849eb42bd1e7bf97a6da))
* update rollup-plugin-commonjs to version 9.1.0 ([#659](https://github.com/ng-packagr/ng-packagr/issues/659)) ([5204b0c](https://github.com/ng-packagr/ng-packagr/commit/5204b0c8b11a495c63db69273e9cb2d0c4ce1bab))
* update rollup-plugin-json to version ^4.0.0 ([8d4d4a7](https://github.com/ng-packagr/ng-packagr/commit/8d4d4a7812d773909075faa27b6a739eef828c42))
* update rollup-plugin-license to version ^0.6.0 ([#664](https://github.com/ng-packagr/ng-packagr/issues/664)) ([2a21d7e](https://github.com/ng-packagr/ng-packagr/commit/2a21d7e97254c16a2b185d2a75ae5d11b2efb77d))
* update rollup-plugin-node-resolve to version ^4.0.0 ([ab2a55a](https://github.com/ng-packagr/ng-packagr/commit/ab2a55a158546124518eb440d7de1a0030b6d88a))
* update rollup-plugin-sourcemaps to version ^0.6.0 ([f8c3459](https://github.com/ng-packagr/ng-packagr/commit/f8c3459af0a5d2125343ec0e737bcb7cc6b0c460))
* update rxjs to version ~6.0.0 ([b171a28](https://github.com/ng-packagr/ng-packagr/commit/b171a28379000baaa8258efbfe8c768e67010bf6))
* update rxjs to version ~6.1.0 ([#832](https://github.com/ng-packagr/ng-packagr/issues/832)) ([365c759](https://github.com/ng-packagr/ng-packagr/commit/365c75912789764da5ffd0190b412ea2fe1ad692))
* update rxjs to version ~6.2.0 ([#898](https://github.com/ng-packagr/ng-packagr/issues/898)) ([9e3de7c](https://github.com/ng-packagr/ng-packagr/commit/9e3de7cd6ae8a24aa80b0e5920de82aadc3ed7c4))
* update rxjs to version ~6.6.0 ([2ce95ab](https://github.com/ng-packagr/ng-packagr/commit/2ce95ab34f5cc0126a9c287163a3d43d6d3999b5))
* update sass to version 1.32.10 ([7dec58c](https://github.com/ng-packagr/ng-packagr/commit/7dec58c4cafef1068a9060731e3e060fde878cb8))
* update supported range of node versions ([3800679](https://github.com/ng-packagr/ng-packagr/commit/3800679130d4d860d0b00f35bb1a7337c93c9b4d))
* update supported range of node versions ([#1996](https://github.com/ng-packagr/ng-packagr/issues/1996)) ([1064bea](https://github.com/ng-packagr/ng-packagr/commit/1064bea620c4650b5c4ad7f87a53f6c4ef7b0259))
* update templates and styles in watch mode ([bfc019f](https://github.com/ng-packagr/ng-packagr/commit/bfc019faf5e6a910f633cd5eb1bdcf9c3264a623))
* update terser to version ^4.0.0 ([dd28818](https://github.com/ng-packagr/ng-packagr/commit/dd28818ec5ce25ef82655b5429f11ea05b4856c1))
* update uglify-js version ([#754](https://github.com/ng-packagr/ng-packagr/issues/754)) ([ff176b7](https://github.com/ng-packagr/ng-packagr/commit/ff176b74fc2e425a5d8846f89f76dcd797cd9211)), closes [#752](https://github.com/ng-packagr/ng-packagr/issues/752)
* update update-notifier to version ^3.0.0 ([d5b136f](https://github.com/ng-packagr/ng-packagr/commit/d5b136fa7e980245a473bb6fe6310cf97e3d8838))
* update update-notifier to version ^4.0.0 ([f05cbbf](https://github.com/ng-packagr/ng-packagr/commit/f05cbbfdc06a55f89e8a34d98b0fb9c3901bd8d4))
* update watch version on secundary entrypoint changes ([1280320](https://github.com/ng-packagr/ng-packagr/commit/1280320607ca896b3bfec07e8e16e3378303ad0a)), closes [#2069](https://github.com/ng-packagr/ng-packagr/issues/2069)
* use `path.join` instead of `require.resolve` to resolve worker ([6a9a23d](https://github.com/ng-packagr/ng-packagr/commit/6a9a23d9c4ce7f43656c00a5746b088150b7003f)), closes [#1867](https://github.com/ng-packagr/ng-packagr/issues/1867)
* use old TypeScript API to support users which are still on 2.7.x+ ([eec8b84](https://github.com/ng-packagr/ng-packagr/commit/eec8b84954bd17c86fe8329d6d92dbab2b1a8d69)), closes [#1186](https://github.com/ng-packagr/ng-packagr/issues/1186)
* use pkg name for es modules folder name when `@<scope>` is undefined ([#70](https://github.com/ng-packagr/ng-packagr/issues/70)) ([cf24b1b](https://github.com/ng-packagr/ng-packagr/commit/cf24b1bd1decbd332a1b4533f2610631dcf3c4b6))
* use rollup wasm version when rollup fails to load ([1ed0dc9](https://github.com/ng-packagr/ng-packagr/commit/1ed0dc962275ec8f8dfbd4d658024bbafbdb9277)), closes [#2722](https://github.com/ng-packagr/ng-packagr/issues/2722)
* use ts.compilerHost as moduleResolutionHost for tsickle.emitWithTsickle to support tsickle 0.33.1 ([30d3720](https://github.com/ng-packagr/ng-packagr/commit/30d37204bf93775dc4652a0bc31f313450b0c6cb)), closes [#1189](https://github.com/ng-packagr/ng-packagr/issues/1189)
* validate non-peerDependencies at build time ([#687](https://github.com/ng-packagr/ng-packagr/issues/687)) ([ec9779c](https://github.com/ng-packagr/ng-packagr/commit/ec9779c7aaa02e0e4e607916dec21c2166dfce5a))
* version command should not require tsickle ([6ac0dcf](https://github.com/ng-packagr/ng-packagr/commit/6ac0dcf40d2e9ed22c2e5f2b7c007062a3e96f2f))
* warn when finding conflicting package export conditions ([b08b075](https://github.com/ng-packagr/ng-packagr/commit/b08b07598ecd675a01f9fd03e9040eb469d52af1)), closes [#2609](https://github.com/ng-packagr/ng-packagr/issues/2609)
* watch assets files and re-copy on changes ([e7465c3](https://github.com/ng-packagr/ng-packagr/commit/e7465c3cbd5b0094af4739ec9250b34c4f3aad27)), closes [#1545](https://github.com/ng-packagr/ng-packagr/issues/1545)
* watch mode not emitted transformed DTS files ([a799883](https://github.com/ng-packagr/ng-packagr/commit/a79988399c49691227583d18e62f003e01b25848)), closes [#2664](https://github.com/ng-packagr/ng-packagr/issues/2664)
* watch mode when using ng-packagr CLI directly ([0f8f92a](https://github.com/ng-packagr/ng-packagr/commit/0f8f92a181ca04e4bf9f26d3200fece0689945d4))
* write type definition files (via triple-slash reference) to npm package ([#443](https://github.com/ng-packagr/ng-packagr/issues/443)) ([9dad573](https://github.com/ng-packagr/ng-packagr/commit/9dad57364bece10e24858c06997c0889180093c7))
* wrong UMD ID's of Angular packages with a dash in name ([c996a61](https://github.com/ng-packagr/ng-packagr/commit/c996a61e4daa044eed24bedc5ee77a81101917e1))


*  feat: build libaries in Angular Package Format (APF) v6.0 (#738) ([4e6c4f4](https://github.com/ng-packagr/ng-packagr/commit/4e6c4f4bb21869c69f084560af3fa75531e4d07f)), closes [#738](https://github.com/ng-packagr/ng-packagr/issues/738) [#705](https://github.com/ng-packagr/ng-packagr/issues/705)
* remove deprecated jsx and languageLevel options ([7503bd4](https://github.com/ng-packagr/ng-packagr/commit/7503bd4a30f8218896a8ec502f42ac810cc4dd64))
* remove less-plugin-npm-import ([6a5ae37](https://github.com/ng-packagr/ng-packagr/commit/6a5ae379255965e7441f486b083eb9a2de7e2db9))
* remove Node.js v14 support ([a091d82](https://github.com/ng-packagr/ng-packagr/commit/a091d8255053537b49d4f58b084c274579bbc580))
* remove support for Node.js versions <18.19.1 and <20.11.1 ([3af4e3f](https://github.com/ng-packagr/ng-packagr/commit/3af4e3f8d8c869f52a7d3f3e43dc194a9b17f48d))
* remove support for Stylus ([2f92ab8](https://github.com/ng-packagr/ng-packagr/commit/2f92ab8e6dabc75d6e4f5793b7de6115848bdf6c))
* remove TypeScript 3.9 support ([c36ac40](https://github.com/ng-packagr/ng-packagr/commit/c36ac404bc37e5884a3c12d8671fd8e5e3271356))
* update to TypeScript 3.9 ([8524648](https://github.com/ng-packagr/ng-packagr/commit/8524648cad5ab8a24520c472304d533d28207b99))
* update to use Node 12 APIs ([69ec8e2](https://github.com/ng-packagr/ng-packagr/commit/69ec8e2e4ff7466a91ef3ff64c14c2809f8ebb46))


### Performance

* add teardown logic for watch ([#980](https://github.com/ng-packagr/ng-packagr/issues/980)) ([42ffec4](https://github.com/ng-packagr/ng-packagr/commit/42ffec4f636e23650abd63b74dc6474ea11f3130))
* analyse sources only for dirty entrypoints ([#1017](https://github.com/ng-packagr/ng-packagr/issues/1017)) ([191cf00](https://github.com/ng-packagr/ng-packagr/commit/191cf00cb2389082919aa02e21895abe41ae3218))
* cache ng program for faster incremental builds ([4131d4c](https://github.com/ng-packagr/ng-packagr/commit/4131d4c8c799e1c6b5ce439170679446e71ed035))
* cache normalized paths ([92f68e3](https://github.com/ng-packagr/ng-packagr/commit/92f68e3f09f66c990413e09cda5d742ad00c5b7f))
* cache processed stylesheets ([b791429](https://github.com/ng-packagr/ng-packagr/commit/b7914293dd424b4bc30d4123f3ef6642eabdb1dc))
* create a single stylesheet renderer worker instance ([6718f6e](https://github.com/ng-packagr/ng-packagr/commit/6718f6e892e6a4ac7364408efeee2261020033fd)), closes [#2530](https://github.com/ng-packagr/ng-packagr/issues/2530)
* do not update package.json version on watch mode ([1225a24](https://github.com/ng-packagr/ng-packagr/commit/1225a241e765b4e37a55958268725d13da5e8e30))
* don't await and return ([#577](https://github.com/ng-packagr/ng-packagr/issues/577)) ([f479e81](https://github.com/ng-packagr/ng-packagr/commit/f479e81e8e17e05e6af9f464f9977bc648d2fdc9))
* don't scan `node_modules` directory while globbing ([#949](https://github.com/ng-packagr/ng-packagr/issues/949)) ([ee7b892](https://github.com/ng-packagr/ng-packagr/commit/ee7b892944f7a7c4f789266d69a47779632aafc5)), closes [#948](https://github.com/ng-packagr/ng-packagr/issues/948)
* don't set setParentNodes for analyse sourcefiles ([d0ce240](https://github.com/ng-packagr/ng-packagr/commit/d0ce240130548b6633499f0685d6bbbff0cbb186))
* embeed assets in css using esbuild instead of postcss ([fe3e052](https://github.com/ng-packagr/ng-packagr/commit/fe3e0521099c53d769ca690ebcefdf1178b1cf2f))
* generate umd bundle directly from fesm5 instead of esm5 ([b25731b](https://github.com/ng-packagr/ng-packagr/commit/b25731b0bf81dc76a2b16f76f80bd34467458dc3))
* ignore node_modules from file watching ([74696e4](https://github.com/ng-packagr/ng-packagr/commit/74696e477070e47df3f118278f9220e269d885ab)), closes [#1583](https://github.com/ng-packagr/ng-packagr/issues/1583)
* implement rollup caching ([eb13316](https://github.com/ng-packagr/ng-packagr/commit/eb1331641b2828da0d188d5934f68f7307e6817b)), closes [#1580](https://github.com/ng-packagr/ng-packagr/issues/1580)
* improve entry points analyses ([bcc7f05](https://github.com/ng-packagr/ng-packagr/commit/bcc7f059c5b88e938380091d0f471c94e6781c74))
* initialize ajv validator only once ([24f4b83](https://github.com/ng-packagr/ng-packagr/commit/24f4b8382edd5ee12c7c32a621fc15931dcf22ec))
* move stylesheet processing into a worker pool ([9eaa398](https://github.com/ng-packagr/ng-packagr/commit/9eaa398b4489457bada33aa7ba2cbd5280b1fe1f))
* only emit changed DTS and JS from NG compiler ([cd0f508](https://github.com/ng-packagr/ng-packagr/commit/cd0f508a80e94b877acab177b57fd68170f80318))
* only process component styles with postcss when needed ([84cf578](https://github.com/ng-packagr/ng-packagr/commit/84cf578001ef2a8ef2ef15047cb78aea7c098a65))
* only re-generate FESMs when ESM has changed ([2a02a89](https://github.com/ng-packagr/ng-packagr/commit/2a02a896c7a100e1538892fd6ab66974a52af3fe))
* only use ensureUnixPath when OS is Windows ([d4ed2b4](https://github.com/ng-packagr/ng-packagr/commit/d4ed2b44d3a7e3264e50c9e6786bb6b0c8197b39))
* only write FESM files when content changes during watch mode ([fb096a0](https://github.com/ng-packagr/ng-packagr/commit/fb096a065d5cb4a358463ce4640f2da7a04b34c5))
* re-populate glob cache ([3323b2a](https://github.com/ng-packagr/ng-packagr/commit/3323b2a43b338947ccc7769bdf0e63f27f52c2fd))
* re-use postcss processor instance per entry point ([#645](https://github.com/ng-packagr/ng-packagr/issues/645)) ([f70985b](https://github.com/ng-packagr/ng-packagr/commit/f70985b4299193541b9c1750bfba74533b24c789))
* read content and map `async` in `minifyJsFile` ([#717](https://github.com/ng-packagr/ng-packagr/issues/717)) ([4da0052](https://github.com/ng-packagr/ng-packagr/commit/4da00524acfd159d0c1eb725396eab74e123d7f2))
* read esm files from memory ([51ba534](https://github.com/ng-packagr/ng-packagr/commit/51ba5346818294e831e70393f41aed09bc8ba18c))
* read set of typescript source files only once ([#388](https://github.com/ng-packagr/ng-packagr/issues/388)) ([bbbbd27](https://github.com/ng-packagr/ng-packagr/commit/bbbbd27ebecfeb0e0a0ba1daa0ffa263817a46e1))
* reduce memory consumption ([#1022](https://github.com/ng-packagr/ng-packagr/issues/1022)) ([3ba995e](https://github.com/ng-packagr/ng-packagr/commit/3ba995eb1a3ccc0c2a62e409dc6e0cb86cad6b03))
* reduce sourcemap loading and decoding ([3089f51](https://github.com/ng-packagr/ng-packagr/commit/3089f514356b2f9aee2d85f52b2ea97576935048)), closes [#2495](https://github.com/ng-packagr/ng-packagr/issues/2495)
* reduce the amount of dependees that are removed ([408541e](https://github.com/ng-packagr/ng-packagr/commit/408541e66d9061213a88b9c25ea53bb2103e8f1a))
* reduce TypeScript JSDoc parsing ([8228740](https://github.com/ng-packagr/ng-packagr/commit/822874098e6b52bca6165efad635f9ec1d6ee7c3))
* remove double iteration over source files ([5e6afb1](https://github.com/ng-packagr/ng-packagr/commit/5e6afb1011870d8e3c8a15e2e37f82f9e5f4ee31))
* remove extra template type checking for downleveling ([#863](https://github.com/ng-packagr/ng-packagr/issues/863)) ([0e0e46d](https://github.com/ng-packagr/ng-packagr/commit/0e0e46db60b7c8bb874299538a21d9f6e7c30026))
* remove FS async calls during stylesheet worker creation ([3c27869](https://github.com/ng-packagr/ng-packagr/commit/3c27869ea499064b5362e736ff9fed9f2ed84ba9)), closes [#2797](https://github.com/ng-packagr/ng-packagr/issues/2797) [#2796](https://github.com/ng-packagr/ng-packagr/issues/2796)
* reuse stylesheet processor ([2c6bb7d](https://github.com/ng-packagr/ng-packagr/commit/2c6bb7de7920b9f8597a6c4aff22958f796d87e5))
* short-circuit ngcc processing across entry-points ([599b742](https://github.com/ng-packagr/ng-packagr/commit/599b742b45f902e1402d4e9ac046a4223530be6b))
* simplify Node `dependsOn` logic ([4a0585d](https://github.com/ng-packagr/ng-packagr/commit/4a0585d729af68f69f518f4e6feec3dabbe77bbc))
* speed up discovery of secondary entry points ([#930](https://github.com/ng-packagr/ng-packagr/issues/930)) ([d646721](https://github.com/ng-packagr/ng-packagr/commit/d6467210d441abe2839bc02f9058ab02789204ab)), closes [#921](https://github.com/ng-packagr/ng-packagr/issues/921)
* store fesm generation state on disk ([4565a8b](https://github.com/ng-packagr/ng-packagr/commit/4565a8bd95d61c30e835f97a408f62da28e523ba))
* use endsWith instead of complex RegExp during dependency analysis ([4f550be](https://github.com/ng-packagr/ng-packagr/commit/4f550be7376d90d9aef7a5fcdc269ec3a17f42d5))
* use esbuild as a CSS optimizer for component styles ([ceb81f9](https://github.com/ng-packagr/ng-packagr/commit/ceb81f9a2533369320a1b9890fa02440a73380a9))
* use esbuild instead of rollup to generate FESM ([9c23827](https://github.com/ng-packagr/ng-packagr/commit/9c238273c9057108744c9f9ef8c7d9e62225c0f1)), closes [#2759](https://github.com/ng-packagr/ng-packagr/issues/2759)
* use set semantics when computing which entry-points to recompile ([f0f52c7](https://github.com/ng-packagr/ng-packagr/commit/f0f52c744c2b9e9b7977c2f11c28686ccb5a3e85))
* use shared module resolution cache across all entry-points ([954ae79](https://github.com/ng-packagr/ng-packagr/commit/954ae797581e80969456c803f5d7467ad5403239))
* use sync-rcp instead of execFileSync to transform async function to sync functions [#1872](https://github.com/ng-packagr/ng-packagr/issues/1872) ([9ccafb0](https://github.com/ng-packagr/ng-packagr/commit/9ccafb0156e9e9ff4ea1b3b4038f0bbb012eba54))
* use TypeScript scanner to build dependency tree ([1cdc8c8](https://github.com/ng-packagr/ng-packagr/commit/1cdc8c8baef290580e31886c46e70455dcc62ff0))

## [19.0.0-rc.0](https://github.com/ng-packagr/ng-packagr/compare/19.0.0-next.7...19.0.0-rc.0) (2024-10-31)

## [19.0.0-next.7](https://github.com/ng-packagr/ng-packagr/compare/19.0.0-next.5...19.0.0-next.7) (2024-10-24)


### Features

* add `sass` option ([c85df4f](https://github.com/ng-packagr/ng-packagr/commit/c85df4ff489258a1723a4b8c4ffd78c9ef63c1d5))


### Bug Fixes

* overhaul the stylesheet pipeline ([e2dc6e1](https://github.com/ng-packagr/ng-packagr/commit/e2dc6e14665460c4feb0a7feac1ef2f96f280d48)), closes [#1873](https://github.com/ng-packagr/ng-packagr/issues/1873) [#2918](https://github.com/ng-packagr/ng-packagr/issues/2918) [#2660](https://github.com/ng-packagr/ng-packagr/issues/2660) [#2654](https://github.com/ng-packagr/ng-packagr/issues/2654)

## [19.0.0-next.6](https://github.com/ng-packagr/ng-packagr/compare/19.0.0-next.5...19.0.0-next.6) (2024-10-15)
* Internal refactors
## [19.0.0-next.5](https://github.com/ng-packagr/ng-packagr/compare/19.0.0-next.4...19.0.0-next.5) (2024-10-15)

## [19.0.0-next.4](https://github.com/ng-packagr/ng-packagr/compare/19.0.0-next.3...19.0.0-next.4) (2024-10-15)


### Bug Fixes

* improve cache logic to handle BigInt ([72f57b8](https://github.com/ng-packagr/ng-packagr/commit/72f57b8b64cdbdedf4429face0587429459427f8)), closes [#2375](https://github.com/ng-packagr/ng-packagr/issues/2375)

## [19.0.0-next.3](https://github.com/ng-packagr/ng-packagr/compare/19.0.0-next.2...19.0.0-next.3) (2024-08-28)


### Bug Fixes

* resolve ESM files correctly on windows ([e476c7b](https://github.com/ng-packagr/ng-packagr/commit/e476c7bef530f87010d8da6320b5a507b73be996))

## [19.0.0-next.2](https://github.com/ng-packagr/ng-packagr/compare/19.0.0-next.1...19.0.0-next.2) (2024-08-28)


### Features

* remove unused ESM2022 from APF ([0be95f7](https://github.com/ng-packagr/ng-packagr/commit/0be95f7a3b993ddc5b565a0beedbd7f38b6c37be))

## [19.0.0-next.1](https://github.com/ng-packagr/ng-packagr/compare/18.2.0...19.0.0-next.1) (2024-08-21)


### Bug Fixes

* disable rollups hoistTransitiveImports ([2b077c8](https://github.com/ng-packagr/ng-packagr/commit/2b077c8872b1e053f11fc035ed346bb5a3b61f01))

### [18.2.1](https://github.com/ng-packagr/ng-packagr/compare/18.2.0...18.2.1) (2024-08-21)
### Bug Fixes

* disable rollups hoistTransitiveImports ([87fd814](https://github.com/ng-packagr/ng-packagr/commit/87fd814a203cb4e09ebb0a62de37628f37821abf))

## [19.0.0-next.0](https://github.com/ng-packagr/ng-packagr/compare/18.2.0...19.0.0-next.0) (2024-08-14)

## [18.2.0](https://github.com/ng-packagr/ng-packagr/compare/18.2.0-next.0...18.2.0) (2024-08-14)

## [18.2.0-next.0](https://github.com/ng-packagr/ng-packagr/compare/18.1.0...18.2.0-next.0) (2024-07-10)

## [18.1.0](https://github.com/ng-packagr/ng-packagr/compare/18.0.0...18.1.0) (2024-07-10)

### Features

* add support for TypeScript 5.5 ([ae2a698](https://github.com/ng-packagr/ng-packagr/commit/ae2a698fa51f9c69824ec8a4e125f67bfe358ff0))

## [18.0.0](https://github.com/ng-packagr/ng-packagr/compare/18.0.0-rc.0...18.0.0) (2024-05-22)

### ⚠ BREAKING CHANGES

* Node.js support for versions <18.19.1 and <20.11.1 has been removed.

### Bug Fixes

* incorrect path resolution for entry-points when generating FESM ([f2cd914](https://github.com/ng-packagr/ng-packagr/commit/f2cd914dfbb597357c8dce0d1f5f41fd76b210b9)), closes [#2838](https://github.com/ng-packagr/ng-packagr/issues/2838)

### Features

* add support for Angular 18 ([9bef232](https://github.com/ng-packagr/ng-packagr/commit/9bef232ff24d0de5a47977b30a3c66af6f8eb6f9))
* add `NgPackagrOptions` to public api ([ffc512e](https://github.com/ng-packagr/ng-packagr/commit/ffc512ee9a2c30e1528189d20b4a18d7e19cf473))
* add support for polling ([2c7f75b](https://github.com/ng-packagr/ng-packagr/commit/2c7f75bec709c870398d332cf3af9285f079f9d1))
* support TypeScript 5.4 ([07d5cea](https://github.com/ng-packagr/ng-packagr/commit/07d5cea0d79e1e9453c33dadd4b29122f764d949))

## [18.0.0-rc.0](https://github.com/ng-packagr/ng-packagr/compare/18.0.0-next.4...18.0.0-rc.0) (2024-05-02)

## [18.0.0-next.4](https://github.com/ng-packagr/ng-packagr/compare/18.0.0-next.3...18.0.0-next.4) (2024-04-25)


### Bug Fixes

* incorrect path resolution for entry-points when generating FESM ([f2cd914](https://github.com/ng-packagr/ng-packagr/commit/f2cd914dfbb597357c8dce0d1f5f41fd76b210b9)), closes [#2838](https://github.com/ng-packagr/ng-packagr/issues/2838)

## [18.0.0-next.3](https://github.com/ng-packagr/ng-packagr/compare/18.0.0-next.2...18.0.0-next.3) (2024-04-18)


### Bug Fixes

* add `NgPackagrOptions` to public api ([ffc512e](https://github.com/ng-packagr/ng-packagr/commit/ffc512ee9a2c30e1528189d20b4a18d7e19cf473))

## [18.0.0-next.2](https://github.com/ng-packagr/ng-packagr/compare/18.0.0-next.1...18.0.0-next.2) (2024-04-18)


### Features

* add support for polling ([2c7f75b](https://github.com/ng-packagr/ng-packagr/commit/2c7f75bec709c870398d332cf3af9285f079f9d1))

## [18.0.0-next.1](https://github.com/ng-packagr/ng-packagr/compare/18.0.0-next.0...18.0.0-next.1) (2024-03-19)


### ⚠ BREAKING CHANGES

* Node.js support for versions <18.19.1 and <20.11.1 has been removed.

### Performance

* use esbuild instead of rollup to generate FESM ([9c23827](https://github.com/ng-packagr/ng-packagr/commit/9c238273c9057108744c9f9ef8c7d9e62225c0f1)), closes [#2759](https://github.com/ng-packagr/ng-packagr/issues/2759)

## [18.0.0-next.0](https://github.com/ng-packagr/ng-packagr/compare/17.3.0...18.0.0-next.0) (2024-03-15)


### Features

* add support for Angular 18 ([9bef232](https://github.com/ng-packagr/ng-packagr/commit/9bef232ff24d0de5a47977b30a3c66af6f8eb6f9))

## [17.3.0](https://github.com/ng-packagr/ng-packagr/compare/17.3.0-rc.0...17.3.0) (2024-03-13)

## [17.3.0-rc.0](https://github.com/ng-packagr/ng-packagr/compare/17.2.1...17.3.0-rc.0) (2024-03-06)


### Features

* support TypeScript 5.4 ([07d5cea](https://github.com/ng-packagr/ng-packagr/commit/07d5cea0d79e1e9453c33dadd4b29122f764d949))

### [17.2.1](https://github.com/ng-packagr/ng-packagr/compare/17.2.0...17.2.1) (2024-03-04)


### Performance

* remove FS async calls during stylesheet worker creation ([3c27869](https://github.com/ng-packagr/ng-packagr/commit/3c27869ea499064b5362e736ff9fed9f2ed84ba9)), closes [#2797](https://github.com/ng-packagr/ng-packagr/issues/2797) [#2796](https://github.com/ng-packagr/ng-packagr/issues/2796)

## [17.2.0](https://github.com/ng-packagr/ng-packagr/compare/17.2.0-rc.0...17.2.0) (2024-02-14)

### Features

* support using custom postcss configuration ([bcb80fa](https://github.com/ng-packagr/ng-packagr/commit/bcb80fa0dc14e78697e1c76cd9c336ac3e70c57c)), closes [#2765](https://github.com/ng-packagr/ng-packagr/issues/2765) [#643](https://github.com/ng-packagr/ng-packagr/issues/643)

### Bug Fixes

* support string as plugin option in custom postcss plugin config ([bb67204](https://github.com/ng-packagr/ng-packagr/commit/bb67204aca396a214cf5b7c2a679bc1aefdb7f87))
* handle absolute `url` reference in CSS files ([3d96591](https://github.com/ng-packagr/ng-packagr/commit/3d96591c932886cd5f62668909989879f3d63aac))

## [17.2.0-rc.0](https://github.com/ng-packagr/ng-packagr/compare/17.2.0-next.0...17.2.0-rc.0) (2024-02-07)


### Bug Fixes

* handle absolute `url` reference in CSS files ([3d96591](https://github.com/ng-packagr/ng-packagr/commit/3d96591c932886cd5f62668909989879f3d63aac))

## [17.2.0-next.0](https://github.com/ng-packagr/ng-packagr/compare/17.1.2...17.2.0-next.0) (2024-02-01)


### Features

* support using custom postcss configuration ([bcb80fa](https://github.com/ng-packagr/ng-packagr/commit/bcb80fa0dc14e78697e1c76cd9c336ac3e70c57c)), closes [#2765](https://github.com/ng-packagr/ng-packagr/issues/2765) [#643](https://github.com/ng-packagr/ng-packagr/issues/643)

### [17.1.2](https://github.com/ng-packagr/ng-packagr/compare/17.1.1...17.1.2) (2024-01-24)

### [17.1.1](https://github.com/ng-packagr/ng-packagr/compare/17.1.0...17.1.1) (2024-01-22)


### Bug Fixes

* correctly embed CSS resources ([059ba29](https://github.com/ng-packagr/ng-packagr/commit/059ba298b96ace42fc92ed2d67757848f5a8ea17)), closes [#2768](https://github.com/ng-packagr/ng-packagr/issues/2768)

## [17.1.0](https://github.com/ng-packagr/ng-packagr/compare/17.1.0-next.5...17.1.0) (2024-01-17)

### Bug Fixes

* add missing tailwind `@screen` directive in matcher ([ad1bd50](https://github.com/ng-packagr/ng-packagr/commit/ad1bd50efb9eadccf5f80abbf8c24e03551f2081))
* remove direct imports to `rollup` ([45336ae](https://github.com/ng-packagr/ng-packagr/commit/45336ae69a22c95825e85afccf40ad526275f31b)), closes [#2749](https://github.com/ng-packagr/ng-packagr/issues/2749)
* correctly validate secondary entry-points config ([5ff4afd](https://github.com/ng-packagr/ng-packagr/commit/5ff4afde43b4984bf7f64ce991dfe255b1fb9373))
* use rollup wasm version when rollup fails to load ([1ed0dc9](https://github.com/ng-packagr/ng-packagr/commit/1ed0dc962275ec8f8dfbd4d658024bbafbdb9277)), closes [#2722](https://github.com/ng-packagr/ng-packagr/issues/2722)

### Performance

* do not update package.json version on watch mode ([1225a24](https://github.com/ng-packagr/ng-packagr/commit/1225a241e765b4e37a55958268725d13da5e8e30))
* embeed assets in css using esbuild instead of postcss ([fe3e052](https://github.com/ng-packagr/ng-packagr/commit/fe3e0521099c53d769ca690ebcefdf1178b1cf2f))
* only process component styles with postcss when needed ([84cf578](https://github.com/ng-packagr/ng-packagr/commit/84cf578001ef2a8ef2ef15047cb78aea7c098a65))
* only emit changed DTS and JS from NG compiler ([cd0f508](https://github.com/ng-packagr/ng-packagr/commit/cd0f508a80e94b877acab177b57fd68170f80318))
* only write FESM files when content changes during watch mode ([fb096a0](https://github.com/ng-packagr/ng-packagr/commit/fb096a065d5cb4a358463ce4640f2da7a04b34c5))
* reduce TypeScript JSDoc parsing ([8228740](https://github.com/ng-packagr/ng-packagr/commit/822874098e6b52bca6165efad635f9ec1d6ee7c3))

## [17.1.0-next.5](https://github.com/ng-packagr/ng-packagr/compare/17.1.0-next.4...17.1.0-next.5) (2023-12-22)


### Bug Fixes

* correctly validate secondary entry-points config ([5ff4afd](https://github.com/ng-packagr/ng-packagr/commit/5ff4afde43b4984bf7f64ce991dfe255b1fb9373))

## [17.1.0-next.4](https://github.com/ng-packagr/ng-packagr/compare/17.1.0-next.3...17.1.0-next.4) (2023-12-20)


### Bug Fixes

* add missing tailwind `@screen` directive in matcher ([ad1bd50](https://github.com/ng-packagr/ng-packagr/commit/ad1bd50efb9eadccf5f80abbf8c24e03551f2081))
* remove direct imports to `rollup` ([45336ae](https://github.com/ng-packagr/ng-packagr/commit/45336ae69a22c95825e85afccf40ad526275f31b)), closes [#2749](https://github.com/ng-packagr/ng-packagr/issues/2749)

## [17.1.0-next.3](https://github.com/ng-packagr/ng-packagr/compare/17.1.0-next.2...17.1.0-next.3) (2023-12-13)

### Performance

* only emit changed DTS and JS from NG compiler ([cd0f508](https://github.com/ng-packagr/ng-packagr/commit/cd0f508a80e94b877acab177b57fd68170f80318))
* only write FESM files when content changes during watch mode ([fb096a0](https://github.com/ng-packagr/ng-packagr/commit/fb096a065d5cb4a358463ce4640f2da7a04b34c5))
* reduce TypeScript JSDoc parsing ([8228740](https://github.com/ng-packagr/ng-packagr/commit/822874098e6b52bca6165efad635f9ec1d6ee7c3))

## [17.1.0-next.2](https://github.com/ng-packagr/ng-packagr/compare/17.1.0-next.1...17.1.0-next.2) (2023-12-05)


### Performance

* do not update package.json version on watch mode ([1225a24](https://github.com/ng-packagr/ng-packagr/commit/1225a241e765b4e37a55958268725d13da5e8e30))
* embeed assets in css using esbuild instead of postcss ([fe3e052](https://github.com/ng-packagr/ng-packagr/commit/fe3e0521099c53d769ca690ebcefdf1178b1cf2f))
* only process component styles with postcss when needed ([84cf578](https://github.com/ng-packagr/ng-packagr/commit/84cf578001ef2a8ef2ef15047cb78aea7c098a65))

## [17.1.0-next.1](https://github.com/ng-packagr/ng-packagr/compare/17.1.0-next...17.1.0-next.1) (2023-11-23)


### Bug Fixes

* use rollup wasm version when rollup fails to load ([1ed0dc9](https://github.com/ng-packagr/ng-packagr/commit/1ed0dc962275ec8f8dfbd4d658024bbafbdb9277)), closes [#2722](https://github.com/ng-packagr/ng-packagr/issues/2722)

### [17.0.2](https://github.com/ng-packagr/ng-packagr/compare/17.0.1...17.0.2) (2023-11-20)


### Bug Fixes

* use rollup wasm version when rollup fails to load ([65b0b6c](https://github.com/ng-packagr/ng-packagr/commit/65b0b6ce3ac4486ec71a5701707280f93999fcc3)), closes [#2722](https://github.com/ng-packagr/ng-packagr/issues/2722)

## [17.1.0-next.0](https://github.com/ng-packagr/ng-packagr/compare/17.0.1...17.1.0-next.0) (2023-11-17)

### Features

* add support for Angular 17.1 ([ce11810](https://github.com/ng-packagr/ng-packagr/commit/ce118106650ada305df86256260d38425ff1381c))

## [17.0.1](https://github.com/ng-packagr/ng-packagr/compare/17.0.0...17.0.1) (2023-11-16)


### Bug Fixes

* display template error when cache is disabled ([0698929](https://github.com/ng-packagr/ng-packagr/commit/0698929aa8583204d4b6a203824c0af27770f0eb)), closes [#2705](https://github.com/ng-packagr/ng-packagr/issues/2705)

## [17.0.0](https://github.com/ng-packagr/ng-packagr/compare/16.2.2...17.0.0) (2023-11-08)

### ⚠ BREAKING CHANGES

* TypeScript versions before 5.2 are no longer supported.

### Features

* esbuild can't resolve secondary entry point from library ([29f417e](https://github.com/ng-packagr/ng-packagr/commit/29f417eecddfc79d894e362da1524be3be6ee6ce))
* drop support for TypeScript versions before 5.2 ([72500c3](https://github.com/ng-packagr/ng-packagr/commit/72500c32dbef977d347022fbe6898ec829143bb1))
* add support for Angular 17 ([cbb06ee](https://github.com/ng-packagr/ng-packagr/commit/cbb06eeffa1ab36cbf9a22ed55a6ddcdcb57a33a))
* support TypeScript 5.2 ([0acd2c4](https://github.com/ng-packagr/ng-packagr/commit/0acd2c473db9a3b4510e28b2e384a0e0e0bdee4c))

### Bug Fixes

* emit `.tsbuildinfo` when cache mode is enabled ([5f32591](https://github.com/ng-packagr/ng-packagr/commit/5f32591e9613d971d6d7608af3e27c30ee14aa3a)), closes [#2682](https://github.com/ng-packagr/ng-packagr/issues/2682)
* add workaround to terminate workers on destroy ([7252f53](https://github.com/ng-packagr/ng-packagr/commit/7252f53fda8bf87db5554724a0bf501b93ef5cbc)), closes [#2688](https://github.com/ng-packagr/ng-packagr/issues/2688)

## [17.0.0-rc.1](https://github.com/ng-packagr/ng-packagr/compare/17.0.0-rc.0...17.0.0-rc.1) (2023-11-01)

## [17.0.0-rc.0](https://github.com/ng-packagr/ng-packagr/compare/17.0.0-next.2...17.0.0-rc.0) (2023-10-26)


### Features

* esbuild can't resolve secondary entry point from library ([29f417e](https://github.com/ng-packagr/ng-packagr/commit/29f417eecddfc79d894e362da1524be3be6ee6ce))

## [17.0.0-next.2](https://github.com/ng-packagr/ng-packagr/compare/17.0.0-next.0...17.0.0-next.2) (2023-09-27)


### ⚠ BREAKING CHANGES

* TypeScript versions before 5.2 are no longer supported.

### Features

* drop support for TypeScript versions before 5.2 ([72500c3](https://github.com/ng-packagr/ng-packagr/commit/72500c32dbef977d347022fbe6898ec829143bb1))
* support TypeScript 5.2 ([0acd2c4](https://github.com/ng-packagr/ng-packagr/commit/0acd2c473db9a3b4510e28b2e384a0e0e0bdee4c))


### Bug Fixes

* emit `.tsbuildinfo` when cache mode is enabled ([5f32591](https://github.com/ng-packagr/ng-packagr/commit/5f32591e9613d971d6d7608af3e27c30ee14aa3a)), closes [#2682](https://github.com/ng-packagr/ng-packagr/issues/2682)

## [17.0.0-next.1](https://github.com/ng-packagr/ng-packagr/compare/17.0.0-next.0...17.0.0-next.1) (2023-09-07)


### Features

* support TypeScript 5.2 ([0acd2c4](https://github.com/ng-packagr/ng-packagr/commit/0acd2c473db9a3b4510e28b2e384a0e0e0bdee4c))


### Bug Fixes

* emit `.tsbuildinfo` when cache mode is enabled ([5f32591](https://github.com/ng-packagr/ng-packagr/commit/5f32591e9613d971d6d7608af3e27c30ee14aa3a)), closes [#2682](https://github.com/ng-packagr/ng-packagr/issues/2682)

## [17.0.0-next.0](https://github.com/ng-packagr/ng-packagr/compare/16.2.2...17.0.0-next.0) (2023-08-29)


### Features

* add support for Angular 17 ([cbb06ee](https://github.com/ng-packagr/ng-packagr/commit/cbb06eeffa1ab36cbf9a22ed55a6ddcdcb57a33a))

### [16.2.2](https://github.com/ng-packagr/ng-packagr/compare/16.2.1...16.2.2) (2023-08-29)


### Bug Fixes

* watch mode not emitted transformed DTS files ([a799883](https://github.com/ng-packagr/ng-packagr/commit/a79988399c49691227583d18e62f003e01b25848)), closes [#2664](https://github.com/ng-packagr/ng-packagr/issues/2664)

### [16.2.1](https://github.com/ng-packagr/ng-packagr/compare/16.2.0-next.1...16.2.1) (2023-08-23)


### Bug Fixes

* do not set less math option ([24fa68b](https://github.com/ng-packagr/ng-packagr/commit/24fa68bcf9db6db9a6c0707716c25806418749b3)), closes [#2675](https://github.com/ng-packagr/ng-packagr/issues/2675)

## [16.2.0](https://github.com/ng-packagr/ng-packagr/compare/16.2.0-next.1...16.2.0) (2023-08-09)

## [16.2.0-next.1](https://github.com/ng-packagr/ng-packagr/compare/16.2.0-next.0...16.2.0-next.1) (2023-07-11)


### Bug Fixes

* no provider for `InjectionToken ng.v5.defaultTsConfig` ([6652727](https://github.com/ng-packagr/ng-packagr/commit/665272791aa54057d8583993c48a7b59bf119e1c))

## [16.2.0-next.0](https://github.com/ng-packagr/ng-packagr/compare/16.1.0...16.2.0-next.0) (2023-06-28)


### Features

* add support for Angular 16.2.0 ([3c1072e](https://github.com/ng-packagr/ng-packagr/commit/3c1072e97c163d21e75883a3aa78c922566208ee))

## [16.1.0](https://github.com/ng-packagr/ng-packagr/compare/16.1.0-rc.0...16.1.0) (2023-06-13)


### Features
* support TypeScript 5.1 ([fcc0c6a](https://github.com/ng-packagr/ng-packagr/commit/fcc0c6a8ddba163dcf642d1cb1634ca223fa97b2))
* support incremental TypeScript semantic diagnostics ([d3b9488](https://github.com/ng-packagr/ng-packagr/commit/d3b9488a4a829efc7f640a3497e16ba94308316c))


### Bug Fixes

* allow usages of ECMAScript Decorators ([9abe6a0](https://github.com/ng-packagr/ng-packagr/commit/9abe6a02bf681a67184c923f26330a358f3d48d7)), closes [#2625](https://github.com/ng-packagr/ng-packagr/issues/2625)


### [16.0.1](https://github.com/ng-packagr/ng-packagr/compare/16.0.0...16.0.1) (2023-05-10)


### Bug Fixes

* warn when finding conflicting package export conditions ([b08b075](https://github.com/ng-packagr/ng-packagr/commit/b08b07598ecd675a01f9fd03e9040eb469d52af1)), closes [#2609](https://github.com/ng-packagr/ng-packagr/issues/2609)

## [16.0.0](https://github.com/ng-packagr/ng-packagr/compare/16.0.0-rc.1...16.0.0) (2023-05-03)

### ⚠ BREAKING CHANGES

* TypeScript 4.8 is no longer supported.

* Several changes to the Angular Package Format (APF)
  - Removal of FESM2015
   - Replacing ES2020 with ES2022
  - Replacing FESM2020 with FESM2022

* Node.js v14 support has been removed

    Node.js v14 is planned to be End-of-Life on 2023-04-30. Angular will stop supporting Node.js v14 in Angular v16. Angular v16 will continue to officially support Node.js versions v16 and v18.
* NGCC integration has been removed and as a result Angular View Engine libraries will no longer work.


### Features

* (APF) Angular Package Format updates ([4ae531c](https://github.com/ng-packagr/ng-packagr/commit/4ae531c60c122b41c12b5c57d7db0245ce751a96))
* remove NGCC integration ([d9fdc89](https://github.com/ng-packagr/ng-packagr/commit/d9fdc89ab76179cb6734ab32bb784e7e3278e3cf))

### Bug Fixes

* always set destination directory ([4e89bcf](https://github.com/ng-packagr/ng-packagr/commit/4e89bcfe571c382ad0b47ae50d5d6dab5de6bef7))
* remove Node.js v14 support ([a091d82](https://github.com/ng-packagr/ng-packagr/commit/a091d8255053537b49d4f58b084c274579bbc580))


## [16.0.0-rc.1](https://github.com/ng-packagr/ng-packagr/compare/16.0.0-rc.0...16.0.0-rc.1) (2023-04-18)


### Bug Fixes

* update list of known tailwind configuration files ([50a7114](https://github.com/ng-packagr/ng-packagr/commit/50a7114621d71a637d744b62f40725746130b8f4))

## [16.0.0-rc.0](https://github.com/ng-packagr/ng-packagr/compare/16.0.0-next.2...16.0.0-rc.0) (2023-04-12)

## [16.0.0-next.2](https://github.com/ng-packagr/ng-packagr/compare/16.0.0-next.1...16.0.0-next.2) (2023-03-22)


### ⚠ BREAKING CHANGES

* Several changes to the Angular Package Format (APF)
- Removal of FESM2015
- Replacing ES2020 with ES2022
- Replacing FESM2020 with FESM2022

### Features

* (APF) Angular Package Format updates ([4ae531c](https://github.com/ng-packagr/ng-packagr/commit/4ae531c60c122b41c12b5c57d7db0245ce751a96))

## [16.0.0-next.1](https://github.com/ng-packagr/ng-packagr/compare/16.0.0-next.0...16.0.0-next.1) (2023-03-17)


### ⚠ BREAKING CHANGES

* * TypeScript 4.8 is no longer supported.

### Features

* add support for TypeScript 5 ([1d4cc04](https://github.com/ng-packagr/ng-packagr/commit/1d4cc045c643150c03913df6fc7f5df2f7506792))

## [16.0.0-next.0](https://github.com/ng-packagr/ng-packagr/compare/15.2.0...16.0.0-next.0) (2023-02-22)


### ⚠ BREAKING CHANGES

* Node.js v14 support has been removed

Node.js v14 is planned to be End-of-Life on 2023-04-30. Angular will stop supporting Node.js v14 in Angular v16. Angular v16 will continue to officially support Node.js versions v16 and v18.
* NGCC integration has been removed and as a result Angular View Engine libraries will no longer work.

### Features

* remove NGCC integration ([d9fdc89](https://github.com/ng-packagr/ng-packagr/commit/d9fdc89ab76179cb6734ab32bb784e7e3278e3cf))


### Bug Fixes

* always set destination directory ([4e89bcf](https://github.com/ng-packagr/ng-packagr/commit/4e89bcfe571c382ad0b47ae50d5d6dab5de6bef7))


* remove Node.js v14 support ([a091d82](https://github.com/ng-packagr/ng-packagr/commit/a091d8255053537b49d4f58b084c274579bbc580))

### [15.2.1](https://github.com/ng-packagr/ng-packagr/compare/15.2.0...15.2.1) (2023-02-22)

## [15.2.0](https://github.com/ng-packagr/ng-packagr/compare/15.1.2...15.2.0) (2023-02-22)


### Bug Fixes

* only copy README.md from entry-points ([23c718d](https://github.com/ng-packagr/ng-packagr/commit/23c718d04eea85e015b4c261310b7bd0c39e5311)), closes [#2564](https://github.com/ng-packagr/ng-packagr/issues/2564)

### [15.1.2](https://github.com/ng-packagr/ng-packagr/compare/15.1.1...15.1.2) (2023-02-09)


### Bug Fixes

* remove trailing slash from dest ([426a081](https://github.com/ng-packagr/ng-packagr/commit/426a081abc8e076afc558586da0cf9cf3f65b78e)), closes [#2558](https://github.com/ng-packagr/ng-packagr/issues/2558)
* support of Safari TP versions ([fa80ee0](https://github.com/ng-packagr/ng-packagr/commit/fa80ee02c6ccc0da7a35da94dc8e91d951ac6bb2))
* update browserslist config to include last 2 Chrome versions ([1519c8d](https://github.com/ng-packagr/ng-packagr/commit/1519c8dd9828b192170fd43fa01b42b0c5ad7d4e)), closes [angular/angular#48669](https://github.com/angular/angular/issues/48669)

### [15.1.1](https://github.com/ng-packagr/ng-packagr/compare/15.1.0...15.1.1) (2023-01-12)


### Performance

* create a single stylesheet renderer worker instance ([6718f6e](https://github.com/ng-packagr/ng-packagr/commit/6718f6e892e6a4ac7364408efeee2261020033fd)), closes [#2530](https://github.com/ng-packagr/ng-packagr/issues/2530)

## [15.1.0](https://github.com/ng-packagr/ng-packagr/compare/15.1.0-next.0...15.1.0) (2023-01-11)

### Features

* add support for dynamic import ([7226bb1](https://github.com/ng-packagr/ng-packagr/commit/7226bb101db0e918571f375cd3b0a9a39182ffdc)), closes [#2508](https://github.com/ng-packagr/ng-packagr/issues/2508)


### Performance

* move stylesheet processing into a worker pool ([9eaa398](https://github.com/ng-packagr/ng-packagr/commit/9eaa398b4489457bada33aa7ba2cbd5280b1fe1f))

### Bug Fixes

* include `cssUrl` and `styleIncludePaths` in the CSS cache key ([6bb7a4a](https://github.com/ng-packagr/ng-packagr/commit/6bb7a4a35a9969c9b0619f855ff9c890ed4e2928)), closes [#2523](https://github.com/ng-packagr/ng-packagr/issues/2523)

## [15.1.0-next.0](https://github.com/ng-packagr/ng-packagr/compare/15.0.3...15.1.0-next.0) (2022-12-21)


### Features

* add support for dynamic import ([7226bb1](https://github.com/ng-packagr/ng-packagr/commit/7226bb101db0e918571f375cd3b0a9a39182ffdc)), closes [#2508](https://github.com/ng-packagr/ng-packagr/issues/2508)


### Performance

* move stylesheet processing into a worker pool ([9eaa398](https://github.com/ng-packagr/ng-packagr/commit/9eaa398b4489457bada33aa7ba2cbd5280b1fe1f))

### [15.0.3](https://github.com/ng-packagr/ng-packagr/compare/15.0.2...15.0.3) (2022-12-09)


### Bug Fixes

* add support for prerelease version of Angular ([632217e](https://github.com/ng-packagr/ng-packagr/commit/632217e80832f57032fd164f85e9085fdb6c427d))

### [15.0.2](https://github.com/ng-packagr/ng-packagr/compare/15.0.1...15.0.2) (2022-12-08)


### Performance

* reduce sourcemap loading and decoding ([3089f51](https://github.com/ng-packagr/ng-packagr/commit/3089f514356b2f9aee2d85f52b2ea97576935048)), closes [#2495](https://github.com/ng-packagr/ng-packagr/issues/2495)

### [15.0.1](https://github.com/ng-packagr/ng-packagr/compare/15.0.0...15.0.1) (2022-11-23)


### Bug Fixes

* copy changed file during watch mode when using advanced asset pattern ([0a11ca9](https://github.com/ng-packagr/ng-packagr/commit/0a11ca960cf8de2398bf5098210dd7677365343c)), closes [#2479](https://github.com/ng-packagr/ng-packagr/issues/2479)

## [15.0.0](https://github.com/ng-packagr/ng-packagr/compare/15.0.0-rc.0...15.0.0) (2022-11-16)


### ⚠ BREAKING CHANGES

* ng-packagr no longer supports Node.js versions `14.[15-19].x` and `16.[10-12].x`. Current supported versions of Node.js are `14.20.x`, `16.13.x` and `18.10.x`.
* TypeScript versions older than 4.8.2 are no longer supported.
* Deprecated support for Stylus has been removed. The Stylus package has never reached a stable version and it's usage in the ng-packagr is minimal. It's recommended to migrate to another CSS preprocessor that the ng-packagr supports.

### Features

* add support for tailwindcss ([fdc0707](https://github.com/ng-packagr/ng-packagr/commit/fdc07079cb2f2f947a72176011e02c7fa2a3c2fa)), closes [#1943](https://github.com/ng-packagr/ng-packagr/issues/1943)
* add support for Node.js version 18 ([e70e3a3](https://github.com/ng-packagr/ng-packagr/commit/e70e3a3547cfdb131608d6a015c528ca64bde629))
* drop support for TypeScript 4.6 and 4.7 ([56d9a85](https://github.com/ng-packagr/ng-packagr/commit/56d9a8558cbc4efa17e7e7e965dea046de90dba7))
* switch to sass modern API ([b1ebee3](https://github.com/ng-packagr/ng-packagr/commit/b1ebee34c7c89cb3d91cb49c74b9c013e84da125))

### Bug Fixes

* grammatical update error message ([6d7d2a9](https://github.com/ng-packagr/ng-packagr/commit/6d7d2a97b2c9586bce51a92d3918051be0441460))
* remove support for Stylus ([2f92ab8](https://github.com/ng-packagr/ng-packagr/commit/2f92ab8e6dabc75d6e4f5793b7de6115848bdf6c))
* emit TypeScript declaration diagnostics ([844ea6c](https://github.com/ng-packagr/ng-packagr/commit/844ea6c6c6b414c192aa0e5fcce7adfbfda0e439)), closes [#2405](https://github.com/ng-packagr/ng-packagr/issues/2405)
* exclude scanning node_modules when trying to locate README.md ([b54159b](https://github.com/ng-packagr/ng-packagr/commit/b54159bf5f9d8fcb57126a37fdfa33443c2f58c2)), closes [#2418](https://github.com/ng-packagr/ng-packagr/issues/2418)
* exclude scanning nested node_modules when locating `README.md` ([4e4c00b](https://github.com/ng-packagr/ng-packagr/commit/4e4c00bf67d2dcb932da5404cc36703e49556594)), closes [#2459](https://github.com/ng-packagr/ng-packagr/issues/2459)
* show actionable error when component resource is not found ([5dcba25](https://github.com/ng-packagr/ng-packagr/commit/5dcba25c284b55f407ddd6bdc7db59ce5436bcca))

## [15.0.0-rc.0](https://github.com/ng-packagr/ng-packagr/compare/15.0.0-next.4...15.0.0-rc.0) (2022-10-21)


### Features

* add support for tailwindcss ([fdc0707](https://github.com/ng-packagr/ng-packagr/commit/fdc07079cb2f2f947a72176011e02c7fa2a3c2fa)), closes [#1943](https://github.com/ng-packagr/ng-packagr/issues/1943)

## [15.0.0-next.4](https://github.com/ng-packagr/ng-packagr/compare/15.0.0-next.3...15.0.0-next.4) (2022-10-12)


### ⚠ BREAKING CHANGES

* ng-packagr no longer supports Node.js versions `14.[15-19].x` and `16.[10-12].x`. Current supported versions of Node.js are `14.20.x`, `16.13.x` and `18.10.x`.
* TypeScript versions older than 4.8.2 are no longer supported.

### Features

* add support for Node.js version 18 ([e70e3a3](https://github.com/ng-packagr/ng-packagr/commit/e70e3a3547cfdb131608d6a015c528ca64bde629))
* drop support for TypeScript 4.6 and 4.7 ([56d9a85](https://github.com/ng-packagr/ng-packagr/commit/56d9a8558cbc4efa17e7e7e965dea046de90dba7))

## [15.0.0-next.3](https://github.com/ng-packagr/ng-packagr/compare/15.0.0-next.2...15.0.0-next.3) (2022-09-28)


### ⚠ BREAKING CHANGES

* Deprecated support for Stylus has been removed. The Stylus package has never reached a stable version and it's usage in the ng-packagr is minimal. It's recommended to migrate to another CSS preprocessor that the ng-packagr supports.

### Features

* switch to sass modern API ([b1ebee3](https://github.com/ng-packagr/ng-packagr/commit/b1ebee34c7c89cb3d91cb49c74b9c013e84da125))


### Bug Fixes

* grammatical update error message ([6d7d2a9](https://github.com/ng-packagr/ng-packagr/commit/6d7d2a97b2c9586bce51a92d3918051be0441460))


* remove support for Stylus ([2f92ab8](https://github.com/ng-packagr/ng-packagr/commit/2f92ab8e6dabc75d6e4f5793b7de6115848bdf6c))

## [15.0.0-next.2](https://github.com/ng-packagr/ng-packagr/compare/15.0.0-next.1...15.0.0-next.2) (2022-09-08)

## [15.0.0-next.1](https://github.com/ng-packagr/ng-packagr/compare/15.0.0-next.0...15.0.0-next.1) (2022-09-07)


### Bug Fixes

* emit TypeScript declaration diagnostics ([844ea6c](https://github.com/ng-packagr/ng-packagr/commit/844ea6c6c6b414c192aa0e5fcce7adfbfda0e439)), closes [#2405](https://github.com/ng-packagr/ng-packagr/issues/2405)
* exclude scanning node_modules when trying to locate README.md ([b54159b](https://github.com/ng-packagr/ng-packagr/commit/b54159bf5f9d8fcb57126a37fdfa33443c2f58c2)), closes [#2418](https://github.com/ng-packagr/ng-packagr/issues/2418)

### [14.2.1](https://github.com/ng-packagr/ng-packagr/compare/14.2.0...14.2.1) (2022-09-07)


### Bug Fixes

* emit TypeScript declaration diagnostics ([2176bd9](https://github.com/ng-packagr/ng-packagr/commit/2176bd96b58dfcde17748945e6709f3387e34fba)), closes [#2405](https://github.com/ng-packagr/ng-packagr/issues/2405)
* exclude scanning node_modules when trying to locate README.md ([90b0463](https://github.com/ng-packagr/ng-packagr/commit/90b046330592f184b5744dc89a5791ded00cf23c)), closes [#2418](https://github.com/ng-packagr/ng-packagr/issues/2418)


## [15.0.0-next.0](https://github.com/ng-packagr/ng-packagr/compare/14.3.0...15.0.0-next.0) (2022-08-26)

### Features

* support Angular 15 ([e3eca0a](https://github.com/ng-packagr/ng-packagr/commit/e3eca0ab8b2669eea0cb3fd5c46413ef6a3197d1))

## [14.2.0](https://github.com/ng-packagr/ng-packagr/compare/14.1.0...14.2.0) (2022-08-24)


### Features

* add support for TypeScript 4.8 ([387a4e1](https://github.com/ng-packagr/ng-packagr/commit/387a4e146f7fea2706ca5e9be015dd9fe0ff9817))

## [14.1.0](https://github.com/ng-packagr/ng-packagr/compare/14.1.0-next.0...14.1.0) (2022-07-20)

## [14.1.0-next.0](https://github.com/ng-packagr/ng-packagr/compare/v14.0.4...v14.1.0-next.0) (2022-07-20)

### [14.0.4](https://github.com/ng-packagr/ng-packagr/compare/v14.0.3...v14.0.4) (2022-07-20)


### Bug Fixes

* update watch version on secondary entrypoint changes ([1280320](https://github.com/ng-packagr/ng-packagr/commit/1280320607ca896b3bfec07e8e16e3378303ad0a)), closes [#2069](https://github.com/ng-packagr/ng-packagr/issues/2069)

### [14.0.3](https://github.com/ng-packagr/ng-packagr/compare/v14.0.2...v14.0.3) (2022-07-06)


### Bug Fixes

* address issue were dts were not emitted fully when using entrypoint name as filename ([713d940](https://github.com/ng-packagr/ng-packagr/commit/713d9408f7b9629863bdbe38a426daa453807a16)), closes [#2369](https://github.com/ng-packagr/ng-packagr/issues/2369) [#2360](https://github.com/ng-packagr/ng-packagr/issues/2360)
* do not run ngcc when node_modules does not exist ([97beddc](https://github.com/ng-packagr/ng-packagr/commit/97beddc50000e04faf5a38a7da0fc6e9642fe0c0))

### [14.0.2](https://github.com/ng-packagr/ng-packagr/compare/v14.0.1...v14.0.2) (2022-06-10)
### Bug Fixes

* error when index file is parallel to entry-point but is not configured as such ([ecb55b1](https://github.com/ng-packagr/ng-packagr/commit/ecb55b1d7e55a6e86cd1972ea87a88b52660d2d5))


### [14.0.1](https://github.com/ng-packagr/ng-packagr/compare/v14.0.0...v14.0.1) (2022-06-08)

No visible changes

## [14.0.0](https://github.com/ng-packagr/ng-packagr/compare/v14.0.0-rc.0...v14.0.0) (2022-06-02)

### ⚠ BREAKING CHANGES

* Support for TypeScript 4.4 and 4.5 has been removed. Please update to TypeScript 4.6.
* Support for Node.js v12 has been removed as it will become EOL on 2022-04-30. Please use Node.js v14.15 or later.
* `package.json` is not longer a valid method to configure ng-packagr. Use `ng-package.json` instead.

### Features

* support TypeScript 4.7 ([5574598](https://github.com/ng-packagr/ng-packagr/commit/5574598b8ae44adca3c734a6659e14055169264d))
* remove handling of `package.json` as configuration ([a94bd14](https://github.com/ng-packagr/ng-packagr/commit/a94bd14b90297affadc33548ea6f1289379e5d61)), closes [#2176](https://github.com/ng-packagr/ng-packagr/issues/2176)
* update generated output to APF 14 ([c6f6e4d](https://github.com/ng-packagr/ng-packagr/commit/c6f6e4d701d31e3d9e8636703ede731c3790778b))
* support more complex `assets` configurations ([6776e17](https://github.com/ng-packagr/ng-packagr/commit/6776e17ac41458f4d196f8ea001ab649e5274952)), closes [#1497](https://github.com/ng-packagr/ng-packagr/issues/1497)
* drop support for Node.js 12 ([181ac25](https://github.com/ng-packagr/ng-packagr/commit/181ac25f831e5e56c2eda357f72c2a46ab0abff2))
* support TypeScript 4.6.2 ([9faef17](https://github.com/ng-packagr/ng-packagr/commit/9faef173ce4949c6993d32127c97d35fe0ce3bb5))

### Bug Fixes

* watch mode when using ng-packagr CLI directly ([0f8f92a](https://github.com/ng-packagr/ng-packagr/commit/0f8f92a181ca04e4bf9f26d3200fece0689945d4))
* join paths instead of resolving ([0a54e7d](https://github.com/ng-packagr/ng-packagr/commit/0a54e7d076ce82e1e041df712fbfab569454e026)), closes [#2241](https://github.com/ng-packagr/ng-packagr/issues/2241)
* avoid a recursive export when entryfile is named `index.ts` ([4c96acb](https://github.com/ng-packagr/ng-packagr/commit/4c96acbe21bda356c6fa14ad8470bccfb4d42451))
* ignore circular dependency warnings ([9b93a18](https://github.com/ng-packagr/ng-packagr/commit/9b93a18d8673b6b788e35916518f241e981c302b))
* remove hardcoded `moduleResolution` ([3f5448d](https://github.com/ng-packagr/ng-packagr/commit/3f5448dfce04e11af66fdaae25effc49f139e6ad))
* re-allow `index.ts` as entry-files ([8c5cc4f](https://github.com/ng-packagr/ng-packagr/commit/8c5cc4fff8846bafcd7210c310d9ef0d3f812709))
* invalid browsers version ranges ([547a11f](https://github.com/ng-packagr/ng-packagr/commit/547a11f166e9b6347fee25ea66e3801ee4e11564))


## [14.0.0-rc.0](https://github.com/ng-packagr/ng-packagr/compare/v14.0.0-next.10...v14.0.0-rc.0) (2022-05-12)

## [14.0.0-next.10](https://github.com/ng-packagr/ng-packagr/compare/v14.0.0-next.9...v14.0.0-next.10) (2022-05-09)


### Bug Fixes

* avoid a recursive export when entryfile is named `index.ts` ([4c96acb](https://github.com/ng-packagr/ng-packagr/commit/4c96acbe21bda356c6fa14ad8470bccfb4d42451))

## [14.0.0-next.9](https://github.com/ng-packagr/ng-packagr/compare/v14.0.0-next.8...v14.0.0-next.9) (2022-05-06)


### Bug Fixes

* re-allow `index.ts` as entry-files ([8c5cc4f](https://github.com/ng-packagr/ng-packagr/commit/8c5cc4fff8846bafcd7210c310d9ef0d3f812709))

## [14.0.0-next.8](https://github.com/ng-packagr/ng-packagr/compare/v14.0.0-next.7...v14.0.0-next.8) (2022-05-06)


### Features

* support TypeScript 4.7 ([5574598](https://github.com/ng-packagr/ng-packagr/commit/5574598b8ae44adca3c734a6659e14055169264d))

## [14.0.0-next.7](https://github.com/ng-packagr/ng-packagr/compare/v14.0.0-next.6...v14.0.0-next.7) (2022-05-06)


### ⚠ BREAKING CHANGES

* `package.json` is not longer a valid method to configure ng-packagr. Use `ng-package.json` instead.

### Features

* remove handling of `package.json` as configuration ([a94bd14](https://github.com/ng-packagr/ng-packagr/commit/a94bd14b90297affadc33548ea6f1289379e5d61)), closes [#2176](https://github.com/ng-packagr/ng-packagr/issues/2176)

## [14.0.0-next.6](https://github.com/ng-packagr/ng-packagr/compare/v14.0.0-next.5...v14.0.0-next.6) (2022-05-05)


### ⚠ BREAKING CHANGES

* ~~`entryFile` can no longer be named `index.ts` as it will conflict with the generated `index.d.ts`. Please rename~~

### Features

* update generated output to APF 14 ([c6f6e4d](https://github.com/ng-packagr/ng-packagr/commit/c6f6e4d701d31e3d9e8636703ede731c3790778b))

## [14.0.0-next.5](https://github.com/ng-packagr/ng-packagr/compare/v14.0.0-next.4...v14.0.0-next.5) (2022-04-11)


### Bug Fixes

* watch mode when using ng-packagr CLI directly ([0f8f92a](https://github.com/ng-packagr/ng-packagr/commit/0f8f92a181ca04e4bf9f26d3200fece0689945d4))

## [14.0.0-next.4](https://github.com/ng-packagr/ng-packagr/compare/v14.0.0-next.3...v14.0.0-next.4) (2022-03-28)


### Features

* support more complex `assets` configurations ([6776e17](https://github.com/ng-packagr/ng-packagr/commit/6776e17ac41458f4d196f8ea001ab649e5274952)), closes [#1497](https://github.com/ng-packagr/ng-packagr/issues/1497)


### Bug Fixes

* join paths instead of resolving ([0a54e7d](https://github.com/ng-packagr/ng-packagr/commit/0a54e7d076ce82e1e041df712fbfab569454e026)), closes [#2241](https://github.com/ng-packagr/ng-packagr/issues/2241)

## [14.0.0-next.3](https://github.com/ng-packagr/ng-packagr/compare/v14.0.0-next.2...v14.0.0-next.3) (2022-03-17)

## [14.0.0-next.2](https://github.com/ng-packagr/ng-packagr/compare/v14.0.0-next.1...v14.0.0-next.2) (2022-03-10)


### ⚠ BREAKING CHANGES

* Support for TypeScript 4.4 and 4.5 has been removed. Please update to TypeScript 4.6.
* Support for Node.js v12 has been removed as it will become EOL on 2022-04-30. Please use Node.js v14.15 or later.

### Features

* drop support for Node.js 12 ([181ac25](https://github.com/ng-packagr/ng-packagr/commit/181ac25f831e5e56c2eda357f72c2a46ab0abff2))
* support TypeScript 4.6.2 ([9faef17](https://github.com/ng-packagr/ng-packagr/commit/9faef173ce4949c6993d32127c97d35fe0ce3bb5))

## [14.0.0-next.1](https://github.com/ng-packagr/ng-packagr/compare/v14.0.0-next.0...v14.0.0-next.1) (2022-01-31)


### Bug Fixes

* invalid browsers version ranges ([547a11f](https://github.com/ng-packagr/ng-packagr/commit/547a11f166e9b6347fee25ea66e3801ee4e11564))

## [14.0.0-next.0](https://github.com/ng-packagr/ng-packagr/compare/v13.2.0...v14.0.0-next.0) (2022-01-28)


### Features

* support Angular 14 ([c153c4d](https://github.com/ng-packagr/ng-packagr/commit/c153c4d822bb4441fb7819a8c1d66548f34dfb35))

## [13.2.0](https://github.com/ng-packagr/ng-packagr/compare/v13.1.3...v13.2.0) (2022-01-26)


### Bug Fixes

* link to angular 12 ivy docs ([be4c280](https://github.com/ng-packagr/ng-packagr/commit/be4c280bc1e6da1b8af3631b292444980063de80)), closes [#2228](https://github.com/ng-packagr/ng-packagr/issues/2228)

### [13.1.3](https://github.com/ng-packagr/ng-packagr/compare/v13.1.2...v13.1.3) (2022-01-13)

### Bug Fixes
*  update dependency postcss-preset-env to v7

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
