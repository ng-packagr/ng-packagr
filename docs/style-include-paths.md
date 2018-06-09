# Add Style Include Paths

You can also make use of the `includePaths` in Sass, while `paths` for Less and Stylus functionality for both component and global styles, which allows you to add extra base paths that will be checked for imports.

In case you have multiple include paths for `@import` statements (e.g., when setting the `stylePreprocessorOptions` in `angular.json`),
the additional paths may be configured through the `styleIncludePaths` option.

```json
{
  "ngPackage": {
    "lib": {
      "styleIncludePaths": ["./src/assets/styles"]
    }
  }
}
```
