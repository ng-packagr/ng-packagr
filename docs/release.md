# Release

`ng-packagr` releases are done through CI when a release tag (ex. `v16.1.0`) is
pushed.

## Important
When a patch release is to be released and the `main` branch is in a pre-release state.
In the below commands the `main` branch should be replaced with versioned branch name (ex. `git checkout 16.2.x`).

## Steps
To release `ng-packagr`:

1.  Sync to the latest `main` commit.
    ```shell
    git checkout main
    git pull upstream main
    ```
2.  Consider dry running the release:
    ```shell
     pnpm release --dry-run
    ```
3.  Run the `release` script. This does not _actually_ release, instead it bumps
    the `package.json` version, updates the changelog, commits the changes, and
    tags the commit. Depending on the kind of release, use one of:
    ```shell
    pnpm release --release-as=patch
    pnpm release --release-as=minor
    pnpm release --release-as=major
    pnpm release --prerelease
    ```
4.  Push the commit to upstream, make sure to include the tag so CI triggers the
    release.
    ```shell
    git push --follow-tags upstream main
    ```
5.  CircleCI will run tests and trigger the release. Look in the
    [CircleCI page for `ng-packagr`](https://app.circleci.com/pipelines/github/ng-packagr/ng-packagr)
    which should include a `deploy` job for the tagged commit. Once this job
    completes, the new version should be successfully published to NPM!
    *   If tests fail for whatever reason, the release will _not_ be deployed.
    *   After fixing the relevant issue, try again by retagging the fixed commit
        and pushing to trigger another `deploy` job.
6.  Go to https://github.com/ng-packagr/ng-packagr/releases/ and create a new
    release for the pushed tag. Copy the content from
    [`CHANGELOG.md`](/CHANGELOG.md) and click publish.
