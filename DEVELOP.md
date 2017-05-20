Develop Guideline
=================


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
