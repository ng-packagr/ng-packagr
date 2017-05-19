Develop Guideline
=================


## Design Doc

#### Config file ".ng-packagr.json"

```json
{
  "src": ".",
  "dest": "dist",
  "workingDirectory": ".ng_build",
  "ngc": {
    "tsconfig": "tsconfig.lib.json"
  },
  "rollup": {
    "config": "rollup-config.js"
  }
}
```


#### Default file layout

```
src
| - public_api.ts
| - ..
.ng-packagr.json
package.json
rollup-config.js
tsconfig.lib.json
```

Dist folder according to [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview):

```
@<prefix>
|- <name>.js
|- <name>.js.map
|- <name>.es5.js
|- <name>.es5.js.map
bundles
|- <name>.umd.js
|- <name>.umd.js.map
src
|- index.d.ts
|- index.metadata.json
package.json
README.md
LICENSE
```


#### Custom file layout

Used by official sample:

```
sample
| - src
    | - public_api.ts
    | - ..
| - package.json
| - rollup-config.js
| - tsconfig.lib.json
.ng-packagr.json
```

With config:

```json
{
  "src": "sample",
  "dest": "dist",
  "workingDirectory": ".ng_build",
  "ngc": {
    "tsconfig": "tsconfig.lib.json"
  },
  "rollup": {
    "config": "rollup-config.js"
  }
}
```



## Release & Publish Workflow

```bash
$ yarn release
```

This builds the tool, cuts a release, and copies the distributable artefacts to `dist`.
It's then ready to be published:

```bash
$ npm publish dist
$ git push origin --follow-tags master
```
