# Embed assets in CSS

## Why?

While developing a library you may want to certain assets that are being used inside your components gets embedded into the outputted css as otherwise it can get rather tricky to implement something that will work for all module formats.

## How?

You can embed assets such as fonts and images inside the outputted css.
More information [in the CSS tricks website](https://css-tricks.com/data-uris)

Valid values: `none` or `inline`.

```json
{
  "ngPackage": {
    "lib": {
      "cssUrl": "inline"
    }
  }
}
```
