# Export Styles

## Why?
As part of the updates made to the [Angular Package Format](https://angular.io/guide/angular-package-format) in version 13, any styles (e.g. `css`, `scss`) that should be part of your library's public API need to be represented in the [`"exports"`](https://angular.io/guide/angular-package-format#exports) of its `package.json`.

## How?
To do this, you can enumerate all such exports in an `"exports"` object in your base `package.json`.  `ng-packagr` will augment this and merge the additional exports generated from the build.

### Example `package.json`
```json
{
  "name": "your-library",
  "version": "1.2.3",
  "exports": {
    ".": {
      "sass": "./_index.scss"
    },
    "./styles/dark-theme": {
      "sass": "./styles/_dark-theme.scss"
    },
    "./styles/_dark-theme": {
      "sass": "./styles/_dark-theme.scss"
    },
    "./styles/light-theme": {
      "sass": "./styles/_light-theme.scss"
    },
    "./styles/_light-theme": {
      "sass": "./styles/_light-theme.scss"
    }
  },
  "peerDependencies": {
    ...
  },
  "dependencies": {
    ...
  }
}
```

### Example ngPackage Config
```json
{
  "ngPackage": {
    "assets": [
      "CHANGELOG.md",
      "./styles",
      "_index.scss"
    ],
    "lib": {
      ...
    }
  }
}
```
