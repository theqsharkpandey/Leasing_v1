# Contributing to The Leasing World

First off, thank you for considering contributing to The Leasing World! It's people like you that make this platform such a great tool.

## Where do I go from here?

If you've noticed a bug or have a question, [search the issue tracker](https://github.com/your-username/Leasing_v1/issues) to see if someone else in the community has already created a ticket. If not, go ahead and [make one](https://github.com/your-username/Leasing_v1/issues/new/choose)!

## Fork & create a branch

If this is something you think you can fix, then [fork The Leasing World](https://docs.github.com/en/get-started/quickstart/fork-a-repo) and create a branch with a descriptive name.

A good branch name would be (where issue #325 is the ticket you're working on):

```sh
git checkout -b 325-add-graphql-support
```

## Get the test suite running

Make sure you're using Node.js 18+. To set up your local development environment:

1. Clone the repository and install dependencies:
   ```sh
   npm run install:all
   ```
2. Copy the example env files and configure them according to the `README.md`.
3. Start the application locally:
   ```sh
   npm run dev
   ```

## Implement your fix or feature

At this point, you're ready to make your changes. Feel free to ask for help; everyone is a beginner at first.

## Make a Pull Request

At this point, you should switch back to your master branch and make sure it's up to date with The Leasing World's master branch:

```sh
git remote add upstream git@github.com:your-username/Leasing_v1.git
git checkout master
git pull upstream master
```

Then update your feature branch from your local copy of master, and push it!

```sh
git checkout 325-add-graphql-support
git rebase master
git push --set-upstream origin 325-add-graphql-support
```

Finally, go to GitHub and [make a Pull Request](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) :D

## Keeping your Pull Request updated

If a maintainer asks you to "rebase" your PR, they're saying that a lot of code has changed, and that you need to update your branch so it's easier to merge.

## Merging A Pull Request (maintainers only)

A pull request can only be merged into master by a maintainer if:

* It is passing all tests/checks.
* It has no syntax errors or obvious security issues.
* It has been approved by at least one other maintainer.
