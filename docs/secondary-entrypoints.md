# Secondary Entry Points

Besides the primary entry point, a package can contain one or more secondary entry points (e.g. `@angular/core/testing`, `@angular/cdk/a11y`, …).
These contain symbols that we don't want to group together with the symbols in the main entry point.
The module id of a secondary entry directs the module loader to a sub-directory by the secondary's name.

For library developers, secondary entry points are configured by adding a `ng-package.json` file in subdirectories of the main `package.json` file's folder!

## Example Folder Layout for Secondary Entry Points

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
    └── ng-package.json
```

The contents of `my_package/testing/ng-package.json` can be as simple as:

```json
{}
```

No, that is not a typo. No name is required. No version is required.
It's all handled for you by ng-packagr!
When built, the primary entry point is imported by `import {..} from '@my/library'` and the secondary entry point with `import {..} from '@my/library/testing'`.
