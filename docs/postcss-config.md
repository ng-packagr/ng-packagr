# PostCSS configuration

ng-packagr will automatically detect and use specific [PostCSS](https://postcss.org/) configuration files if present in project root directory. If using a custom PostCSS configuration file, the automatic Tailwind CSS integration will be disabled. To use both a custom PostCSS configuration and [Tailwind CSS](https://tailwindcss.com/), the Tailwind CSS setup must be included in the custom PostCSS configuration file.

The configuration files must be JSON and named one of the following:

- `postcss.config.json`
- `.postcss.json`

A configuration file can use either an array form or an object form to setup plugins.

An example of the array form:

```json
{
  "plugins": ["tailwindcss", ["rtlcss", { "useCalc": true }]]
}
```

The same in an object form:

```json
{
  "plugins": {
    "tailwindcss": {},
    "rtlcss": { "useCalc": true }
  }
}
```

**NOTE:** Using a custom PostCSS configuration may result in reduced build and rebuild performance. PostCSS will be used to process all global and component stylesheets when a custom configuration is present. Without a custom PostCSS configuration, PostCSS is only used for a stylesheet when Tailwind CSS is enabled and the stylesheet requires Tailwind CSS processing.
