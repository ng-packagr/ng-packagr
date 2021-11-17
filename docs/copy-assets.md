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
When including additional assets like Sass mixins or pre-compiled CSS, you need to add these manually to the conditional "exports" in the `package.json` of the primary entry point.

ng-packagr will merge the manually-added "exports" with auto-generated ones, allowing for library authors to configure additional export sub-paths, or custom conditions.

### Example package.json
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
    "./styles/light-theme": {
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
