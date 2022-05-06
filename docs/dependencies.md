# Managing Dependencies

## General Recommendation: use `peerDependencies` whenever possible

As a rule of thumb, consider that your library's dependencies are declared as `peerDependencies`.
In most cases, this is the recommended solution for library dependencies.

### Why?

Publishing an npm packages with a `dependencies` section in `package.json` easily leads to installing multiple versions of a dependency to an application's `node_modules` folder.
While this is a desirable solution on server-side or standalone programs, it's a source for bugs on front-end build stacks and UI technologies – you don't want to install two different versions of Angular or RxJS.

A motivation why `peerDependencies` are the preferred solution for libraries can be found on the [Hidden Variables blog](https://blog.domenic.me/peer-dependencies).

## Allowing in the `dependencies` Section

To mitigate the risk of accidentally publishing libraries with `dependencies`, ng-packagr verifies `dependencies` at build time.
It will fail the build, if a dependency is not allowed explicitly.
It is a safety net to keep the ecosystem of Angular libraries healthy.

Allowing can be done using the `allowedNonPeerDependencies` option in the ng-packagr configuration. Each entry will be matched as a RegExp.
a
In `ng-package.json`:

```json
{
  "$schema": "./node_modules/ng-packagr/package.schema.json",
  "allowedNonPeerDependencies": ["moment"]
}
```

If you'd like to turn off this feature completely, you can do so by providing a catch all RegExp as such;

```json
{
  "$schema": "./node_modules/ng-packagr/package.schema.json",
  "allowedNonPeerDependencies": ["."]
}
```
