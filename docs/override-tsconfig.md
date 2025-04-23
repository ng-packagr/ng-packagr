# Override TsConfig

## Non-Angular CLI Users

To override the tsconfig you need to use the `withTsConfig` method in our API.

`withTsConfig` accepts a path for a tsconfig file or a parsed tsconfig object.

```ts
import * as ngPackage from 'ng-packagr';

ngPackage
  .ngPackagr()
  .forProject('ng-package.js')
  .withTsConfig('tsconfig.lib.json')
  .build()
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
```

or

```ts
import * as ngPackage from 'ng-packagr';

ngPackage
  .ngPackagr()
  .forProject('ng-package.js')
  .withTsConfig({
    project: '',
    options: {
        ...
    }
    ...
  })
  .build()
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
```

Notes:

You need to supply a full and valid tsconfig. You can get started by taking a look at [our internal tsconfig](../src/lib/ts/conf/tsconfig.ngc.json).

Your `tsconfig.lib.json` can extend it

```json
{
  "extends": "<root>/node_modules/ng-packagr/src/lib/ts/conf/tsconfig.ngc.json",
  "compilerOptions": {
    "types": ["node"]
    // Other overrides
  }
}
```

## Angular CLI Users

Overriding a tsconfig for Angular CLI users is straight forward as Angular CLI already uses the API. All you need to do is amend `tsconfig.lib.json` under the library folder.
