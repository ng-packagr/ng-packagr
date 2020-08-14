# Secondary Entry Points

Besides the primary entry point, a package can contain one or more secondary entry points (e.g. `@angular/core/testing`, `@angular/cdk/a11y`, …).
These contain symbols that we don't want to group together with the symbols in the main entry point.
The module id of a secondary entry directs the module loader to a sub-directory by the secondary's name.
For instance, `@angular/core/testing` resolves to a directory under `node_modules/@angular/core/testing` containing a `package.json` file that references the correct bundle files for what an application's build system is looking for.

For library developers, secondary entry points are dynamically discovered by searching for `package.json` files within subdirectories of the main `package.json` file's folder!

## Example Folder Layout for Secondary Entry Points

All you have to do is create a `package.json` file and put it where you want a secondary entry point to be created.
One way this can be done is by mimicking the folder structure of the following example which has a testing entry point in addition to its main entry point.

```
my_package
├── src
|   ├── public_api.ts
|   └── *.ts
├── ng-package.json
├── package.json
└── testing
    ├── src
    |   ├── public_api.ts
    |   └── *.ts
    └── package.json
```

The contents of `my_package/testing/package.json` can be as simple as:

```json
{
  "ngPackage": {}
}
```

No, that is not a typo. No name is required. No version is required.
It's all handled for you by ng-packagr!
When built, the primary entry point is imported by `import {..} from '@my/library'` and the secondary entry point with `import {..} from '@my/library/testing'`.

### Alternative to `package.json`

Alternatively, you could create `ng-package.json` instead of `package.json`.
This is particularly useful in conjunction with `no-implicit-dependencies` TSLint rule, which will complain if `package.json` does not contain the dependencies used in the secondary entry point, which is misleading since all the dependencies should be mentioned in the primary `package.json`.
