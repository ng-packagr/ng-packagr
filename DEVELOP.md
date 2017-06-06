Develop Guideline
=================


## Release & Publish Workflow

```bash
$ yarn release
```

This builds the tool, cuts a release, and copies the distributable artefacts to `dist`.
It's then ready to be published:

```bash
$ git push --follow-tags origin master
```

This pushes master and the newly created tag to the GitHub repository, thus triggering a build on Circle CI for new tag.
Circle CI will build the tag from sources (again) and automatically publish to the npm registry.

If neccessary, distributable artefacts can be created and published by hand:

```bash
$ yarn pack dist
$ npm publish dist/<name-x.y.z>.tgz
```
