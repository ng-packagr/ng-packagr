# JSX Templates.

> a.k.a.: React loves Angular, Angular loves React

What if I want to use React Components in Angular?

If you have React Components that you're using in your library, and want to use proper JSX/TSX syntax in order to
construct them, you can set the `jsx` flag for your library through `ng-package.json` like so:

```json
{
  "$schema": "../../../src/ng-package.schema.json",
  "lib": {
    "entryFile": "public_api.ts",
    "umdModuleIds": {
      "react": "React",
      "react-dom": "ReactDOM"
    },
    "jsx": "react"
  }
}
```

The `jsx` flag will accept what the corresponding `tsconfig` accepts, more information [in the TypeScript Handbook chaper on JSX](https://www.typescriptlang.org/docs/handbook/jsx.html).

Note: Don't forget to include `react` and `react-dom` in `umdModuleIds` so that you're shipping a correct UMD bundle!
