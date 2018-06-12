# Managing Dependencies

## General Recommendation: use `peerDependencies` whenever possible

TODO: can someone post in a reference to why? who? where?

## Whitelisting the `dependencies` Section

Publishing an npm packages with `dependencies` easily leads to installing multiple versions of a dependency to an application's `node_modules` folder. While this is a desirable solution on server-side or standalone programs, it's a source for bugs on front-end build stacks and UI technologies – you don't want to install two different versions of Angular or RxJS.

A motivation why `peerDependencies` are the preferred solution for libraries can be found on the [Hidden Variables blog](https://blog.domenic.me/peer-dependencies).

ng-packagr verifies `dependencies` at build time and fail the build, if a dependency is not whitelisted explicitly.

Whitelisting can be done using the `whitelistedNonPeerDependencies` option in the ng-packagr configuration. Each entry will be matched as a RegExp.
a
In `ng-package.json`:

```json
{
  "$schema": "./node_modules/ng-packagr/package.schema.json",
  "whitelistedNonPeerDependencies": ["moment"]
}
```

in `package.json`:

```json
{
  "$schema": "./node_modules/ng-packagr/package.schema.json",
  "ngPackage": {
    "whitelistedNonPeerDependencies": ["moment"]
  }
}
```

If you'd like to turn off this feature completly, you can do so by providing a catch all RegExp as such;

```json
{
  "$schema": "./node_modules/ng-packagr/package.schema.json",
  "ngPackage": {
    "whitelistedNonPeerDependencies": ["."]
  }
}
```

## Resolving UMD Module Identifiers

By default, ng-packagr will treat dependencies as external dependencies.
This means that dependencies are not included in the distributable bundles of the library and thus the application build (and the browser at runtime) needs to resolve dependencies.
In UMD, the module identifiers such as `@angular/core` are mapped to a UMD module identifier, e.g. a shared global-scoped variable `window.ng.core` in the browser runtime.

When writing the [UMD bundle](https://github.com/umdjs/umd), ng-packagr does its best to provide common default values for the UMD module identifiers.
Also, `rollup` will do its best to guess the module ID of an external dependency.
Even then, you should make sure that the UMD module identifiers of the external dependencies are correct.
In case ng-packagr doesn't provide a default and rollup is unable to guess the correct identifier, you should explicitly provide the module identifier by using `umdModuleIds` in the library's package file section like so:

```json
{
  "$schema": "../../../src/ng-package.schema.json",
  "lib": {
    "umdModuleIds": {
      "lodash": "_",
      "date-fns": "DateFns"
    }
  }
}
```
