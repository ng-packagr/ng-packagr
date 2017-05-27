Integration Testing for `ng-packagr`
====================================



#### Steps to reproduce

Prepare `sample` library:

```bash
$ yarn sample
$ cd integration/sample/dist
$ yarn link
```

Build an `ng` CLI consumer app:

```bash
$ cd integration/consumer-ng-cli
$ yarn link @foo/bar
$ yarn install
$ yarn build:dev
$ yarn build:prod:jit
$ yarn build:prod:aot
```
