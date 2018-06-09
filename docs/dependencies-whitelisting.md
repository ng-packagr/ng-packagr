# Dependencies Whitelisting

Publishing an npm packages with `dependencies` easily leads to installing multiple versions of a dependency to an application's `node_modules` folder. While this is a desirable solution on server-side or standalone programs, it's a source for bugs on front-end build stacks and UI technologies – you don't want to install two different versions of Angular or RxJS.

A motivation why `peerDependencies` are the preferred solution for libraries can be found on the [Hidden Variables blog](https://blog.domenic.me/peer-dependencies).

ng-packagr verifies `dependencies` and `devDependencies` at build time and fail the build, if a dependency is not whitelisted explicitly.

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
