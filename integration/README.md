Integration Testing for `ng-packagr`
====================================



### Steps to reproduce


##### Sample Libraries

Build the sample libraries and prepare dist packages for linking:

```bash
$ pnpm samples
$ cd integration/sample_custom/dist
$ pnpm link
$ cd integration/sample_material/dist
$ pnpm link
```

##### Angular CLI

Build an `ng` CLI consumer app:

```bash
$ cd integration/consumer-ng-cli
$ pnpm install
$ pnpm link @sample/material
$ pnpm link sample-material
$ pnpm build:dev
$ pnpm build:prod:jit
$ pnpm build:prod:aot
```

Note: `ng` (and `webpack` under the hood) will resolve dependencies through symlinks in the local `node_modules`
