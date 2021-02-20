Develop Guideline
=================

Before creating a pull-request, make sure to locally build and test the changes:

```bash
$ cd PATH_NG_PACKAGR_REPO
$ yarn install
$ yarn build
$ yarn test
```

To only build and tests a few integration samples, you could pass a list of sample names:

```bash
$ yarn integration:samples sample1
$ yarn integration:samples custom material secondary
```

Special environment variables for the `yarn integration:samples` command:

* `DEBUG=true` - display debug information
* `NG_PACKAGR_REBUILD=true` - rebuild ng-packagr before building and testing integration samples
* `NG_PACKAGR_SAMPLES_SKIP_BUILD=true` - skip building of integration samples, useful when writing tests
* `NG_PACKAGR_SAMPLES_SKIP_SPECS=true` - skip testing of integration samples, useful for checking the build output when changing ng-packagr


## Testing a custom build

To test a custom ng-packagr build against your application:

1)  When using npm as a package manager:
    ```bash
    $ cd PATH_NG_PACKAGR_REPO/dist && npm link
    $ cd MY_PROJECT && npm link ng-packagr
    ```
    For more information see: https://docs.npmjs.com/cli/v6/commands/npm-link

2)  When using yarn as a package manager:
    ```bash
    $ cd PATH_NG_PACKAGR_REPO/dist && yarn link
    $ cd MY_PROJECT && yarn link ng-packagr
    ```
    For more information see: https://classic.yarnpkg.com/en/docs/cli/link

HINT: To make sure that you are using your custom build, add a `console.log()` to `NgPackagr.build()`.


## Release & Publish Workflow

```bash
$ yarn release
```

This builds the tool, cuts a release, and copies the distributable artefacts to `dist`.
When cutting the release, it uses the [standard-version workflow](https://github.com/conventional-changelog/standard-version).
The release is then ready to be published:

```bash
$ git push --follow-tags origin master
```

This pushes branch `master` and the `v{x}.{y}.{z}` tag to the GitHub repository, thus triggering a build on Circle CI.
Circle CI will checkout the Git tag, build from sources (again), and automatically publish to the npm registry.

If necessary, distributable artefacts can be created and published by hand:

```bash
$ yarn pack dist
$ npm publish dist/<name-x.y.z>.tgz
```
