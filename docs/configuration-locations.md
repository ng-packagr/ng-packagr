# Configuration Locations

Configuration is picked up from the project file given by the `-p` CLI option.
The `-p`option may refer to a `package.json` (with custom `ngPackage` property), an `ng-package.json`, or an `ng-package.js` file.
When the `-p` option refers to a directory, the configuration is picked up from the first matching source;
locations are tried in the above-mentioned order.

To configure with a `package.json`, put the configuration in the `ngPackage` custom property:

```json
{
  "$schema": "./node_modules/ng-packagr/package.schema.json",
  "ngPackage": {
    "lib": {
      "entryFile": "src/public_api.ts"
    }
  }
}
```

To configure with a `ng-package.json` or `ng-package.js`, keep the library's `package.json` in the same folder next to `ng-package.json` or `ng-package.js`.

Example of `ng-package.json`:

```json
{
  "$schema": "./node_modules/ng-packagr/ng-package.schema.json",
  "lib": {
    "entryFile": "src/public_api.ts"
  }
}
```

Example of `ng-package.js`:

```js
module.exports = {
  lib: {
    entryFile: 'src/public_api.ts'
  }
};
```
