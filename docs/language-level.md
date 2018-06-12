# Change Language Level

To use `es2016` or `es2017` features in your library you need to set the `languageLevel` option in your ng-packagr config file or `lib` option in `tsconfig`.

For a list of valid values check [TypeScript's handbook](https://www.typescriptlang.org/docs/handbook/compiler-options.html).

## Non-Angular CLI Users

You can change the TypeScript language level support in tsconfig by setting `lib.languageLevel` property in the `ngPackage` section:
For example:

```json
{
  "ngPackage": {
    "lib": {
      "languageLevel": ["dom", "es2017"]
    }
  }
}
```

## Angular CLI Users

If you are an Angular CLI users can amend the language level by setting the `lib` property under `compilerOptions` in your `tsconfig.lib.json`.
