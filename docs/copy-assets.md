# Copy assets

## Why?

As a library author you may want to distribute certain assets that are outside of the library compilation such as a `CHANGELOG.md` or SCSS mixins.

## How?

You can copy these assets by using the `assets` option.

```json
{
  "ngPackage": {
    "assets": [
      "CHANGELOG.md",
      "./styles/**/*.theme.scss"
    ],
    "lib": {
      ...
    }
  }
}
```

## Exporting Styles
If your copied assets include styles that should be part of your library's public API, they need to be represented in the [`exports`](https://angular.io/guide/angular-package-format#exports) of its `package.json`.

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
