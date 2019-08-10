# Define Library's Module Type

## Why?

By default, the generated library's package.json `module` property points to the fesm5 bundle which is sometimes not treeshakable.

You might want the `module` property of your library's package.json to point to the esm5 bundle for example.

The same logic can be applied for `es2015` property if you want to point to esm2015 module instead of the default fesm2015.

## How?

### ES5 modules
You can easily achieve this by adding a `module` property in the ng-package.json under lib:
``` json
{
    "$schema": "../../node_modules/ng-packagr/ng-package.schema.json",
    "dest": "../../dist/my-lib",
    "lib": {
      "entryFile": "src/public-api.ts",
      "module": "esm5"
    }
}
```

Possible values for the module property are: 
- fesm5 (default)
- esm5

### ES2015 modules
You can easily achieve this by adding a `es2015` property in the ng-package.json under lib:
``` json
{
    "$schema": "../../node_modules/ng-packagr/ng-package.schema.json",
    "dest": "../../dist/my-lib",
    "lib": {
      "entryFile": "src/public-api.ts",
      "es2015": "esm2015"
    }
}
```

Possible values for the module property are: 
- fesm2015 (default)
- esm2015
