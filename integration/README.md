Integration Testing for `ng-packagr`
====================================



### Steps to reproduce


##### Sample Libraries

Build the sample libraries and prepare dist packages for linking:

```bash
$ yarn samples
$ cd integration/sample_custom/dist
$ yarn link
$ cd integration/sample_material/dist
$ yarn link
```

##### Angular CLI

Build an `ng` CLI consumer app:

```bash
$ cd integration/consumer-ng-cli
$ yarn install
$ yarn link @sample/material
$ yarn link sample-material
$ yarn build:dev
$ yarn build:prod:jit
$ yarn build:prod:aot
```

Note: `ng` (and `webpack` under the hood) will resolve dependencies through symlinks in the local `node_modules` folder.


##### TypeScript Consumer

Build a plain `tsc` consumer app:

```bash
$ cd integration/consumer-tsc
$ tsc
$ tsc --target es2015 --module es2015
$ tsc --target es5 --module es2015
$ tsc --target es5 --module umd
$ tsc --target es5 --module commonjs
```

Note: through `tsconfig.json`, this project resolves dependencies through a `paths` mapping.
