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

## Angular Package Format 13
If your copied assets include styles that should be made available for importing/using, please see the guidance on how to [export styles](export-styles) in a way that's compatible with APF version 13.
