# Copy assets

## Why?

As a library author you may want to distribute certain assets that are outside of the library compilation such as a `CHANGELOG.md` or SCSS mixins.

## How?

You can copy these assets by using the `assets` option.
The assets array can accept a string or an object:
```
  | {
      /**
       * The pattern to match.
       */
      glob: string;
      /**
       * The input directory path in which to apply 'glob'. Defaults to the project root.
       */
      input: string;
      /**
       * An array of globs to ignore.
       */
      ignore?: string[];
      /**
       * Absolute path within the output.
       */
      output: string;
       /**
       * Allow glob patterns to follow symlink directories. This allows subdirectories of the symlink to be searched.
       */
      followSymlinks: boolean;
    }
  | string;


## Example strings

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
## Example complex object

```
{
  "ngPackage": {
    "assets": [
      {
      "glob": "**/*.scss",
      "input": "./src/lib",
      "output": "/lib"
      },
      ...
    ],
    "lib": {
      ...
    }
  }
}

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
