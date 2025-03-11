Develop Guideline
=================


## Release & Publish Workflow

```bash
$ pnpm release
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
$ pnpm pack dist
$ npm publish dist/<name-x.y.z>.tgz
```
