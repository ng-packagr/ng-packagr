# Embed assets in CSS

## Why?

While developing a library you may want certain assets used inside your components to be embedded into the outputted css as otherwise it can get rather tricky to implement something that will work for all module formats.

One way to overcome this and include certain assets, is to use background images inside css and embed the assets with data URIs.

Something like the below:

```css
background: url('logo.png');
```

During build it will be resolved and the asset will be encoded into base64 format:

```css
background: url(data:image/png;base64, YSBzbGlnaHRseSBsb25nZXIgdGVzdCBmb3IgdGV2ZXIK);
```

Note: it is important to keep the amount of embedded files to a minimum and only embed small files. As this will increase in the final bundle size.

More information [in the CSS tricks website](https://css-tricks.com/data-uris) and [MDN web docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs).

## How?

You can embed assets such as fonts and images inside the outputted css by using the `cssUrl` option.
Valid values: `none` or `inline`.

```json
{
  "lib": {
    "cssUrl": "inline"
  }
}
```
