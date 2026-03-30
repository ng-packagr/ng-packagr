/**
 * Github configuration for the `ng-dev` command. This repository is used as
 * remote for the merge script and other utilities like `ng-dev pr rebase`.
 *
 * @type { import("@angular/ng-dev").GithubConfig }
 */
export const github = {
  owner: 'ng-packagr',
  name: 'ng-packagr',
  mainBranchName: 'main',
  mergeMode: 'team-only',
  requireReleaseModeForRelease: false,
};
