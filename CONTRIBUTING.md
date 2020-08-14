# Contributing

Hi you,

since an official solution from the core team is missing for now,
ng-packagr is a community-driven effort!
Angular is a great framework with a good community and
contributions to ng-packagr are welcome!

However, if you like to help improving ng-packagr please follow these guidelines!

## For Users

Please use the [issue template](./.github/ISSUE_TEMPLATE.md) when opening a new issue!

Think you discovered a bug?
Please provide a reproduction of the issue!

Can you reproduce the error in the integration tests in ng-packagr?
If possible, take a look at the [`integration/samples`](./integration/samples) and try to break one of these builds!

Is the error you faced in an application importing the library?
Try to break the Angular CLI app in [`integration/consumers/ng-cli`](./integration/consumers/ng-cli)!

## For Developers

Want to open a pull request?

Please take a look at the [issues labelled with "PR Welcome"](https://github.com/ng-packagr/ng-packagr/labels/community%3A%20PR%20welcome)!
These are good issues to get started with and help improving ng-packagr!

#### Before opening the pull request

Obviously, please use the [pull request template](./.github/PULL_REQUEST_TEMPLATE.md) when opening a pull request!

Try to keep the changes minimal and focus on the essentials.
A small and focused changeset is more likely to be merged than a large one!

#### Setting up local developement

Stuck at setting up a development environment?
Read through the [developer guide](./docs/DEVELOP.md) for further instructions.

#### Adding a new feature

Make sure to read the [design doc](./docs/DESIGN.md) and understand the motivations behind `ng-packagr`!

Again, if the changeset is small, just go open a pull request!
If the feature requires a bigger change in the code base, please start a discussion in an issue first!
