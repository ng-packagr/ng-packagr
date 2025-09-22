## Release Process for `ng-packagr`

Releases for `ng-packagr` are handled by **GitHub Actions** when a release tag (e.g., `16.1.0`) is pushed. **Crucially, the release job requires manual approval via the GitHub Actions UI.**

-----

### Important Branch Note

If you're making a **patch release** and the `main` branch is currently in a pre-release state, you must replace `main` with the appropriate versioned branch name in the commands below (e.g., `git checkout 16.2.x`).

-----

### Steps to Release

Follow these steps to release `ng-packagr`:

1.  **Sync to the latest `main` commit.**

    ```shell
    git checkout main
    git pull upstream main
    ```

2.  **Consider dry running the release** to preview the changes.

    ```shell
    pnpm release --dry-run
    ```

3.  **Run the `release` script.** This script doesn't actually publish but instead bumps the `package.json` version, updates the changelog, commits the changes, and tags the commit. Choose the command appropriate for the release type:

    ```shell
    pnpm release --release-as=patch
    pnpm release --release-as=minor
    pnpm release --release-as=major
    pnpm release --prerelease
    ```

4.  **Push the commit to upstream**, making sure to include the tag. This triggers the GitHub Actions workflow.

    ```shell
    git push --follow-tags upstream main
    ```

5.  **Approve the GitHub Actions deployment.**

      * Navigate to the **Actions** tab on the `ng-packagr` repository.
      * Find the workflow run associated with your new tag.
      * The workflow will run tests first. Once tests pass, the **release/deploy job will pause and require manual approval**.
      * Click on the job run and approve the deployment via the GitHub Actions UI.
      * Once approved and the job completes successfully, the new version will be published to npm\! 🚀
      * *If tests fail, the deployment will not be available for approval.* You'll need to fix the issue, retag the fixed commit, and push again to trigger a new deployment run.

6.  **Create a new release on GitHub.**

      * Go to **[https://github.com/ng-packagr/ng-packagr/releases/](https://github.com/ng-packagr/ng-packagr/releases/)**.
      * Create a new release for the pushed tag.
      * Copy the content from your local `CHANGELOG.md` for the release description and click **Publish**.
