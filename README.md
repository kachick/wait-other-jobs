# wait-other-jobs

[![CI](https://github.com/kachick/wait-other-jobs/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/kachick/wait-other-jobs/actions/workflows/ci.yml?query=event%3Apush++)
[![Itself](https://github.com/kachick/wait-other-jobs/actions/workflows/itself.yml/badge.svg?branch=main)](https://github.com/kachick/wait-other-jobs/actions/workflows/itself.yml?query=event%3Apush++)

## Overview

This action waits all GitHub Action jobs even if they are running in other workflows.\
When some jobs failed, this action exit with NON 0 value. Otherwise exit with 0.

I mainly use this action for below use-case when they should run after multiple CI workflows

- [Deploy to Firebase/Vercel/Netlify](https://github.com/kachick/convert-color-json-between-windows-terminal-and-vscode/blob/1a8eac43be819204ff21eec1198fd2dfad3fcaa3/.github/workflows/firebase-hosting-pull-request.yml#L39-L43)
- [Release with GitHub releasing](https://github.com/kachick/asdf-cargo-make/blob/a666005e239cfd2b78d43e462e6279e8d8ab4d3d/.github/workflows/release.yml#L12-L16)
- [Auto approve and merge dependabot PRs without PAT(Personal Access Token)](https://github.com/kachick/ruby-ulid/blob/ad4c6090d7835d80ff02a1a5f57d6e9ae11a85d3/.github/workflows/merge-bot-pr.yml#L21-L26)
- [Auto approve and merge renovatebot PRs without `platformAutomerge` feature](https://github.com/kachick/ruby-ulid/blob/ad4c6090d7835d80ff02a1a5f57d6e9ae11a85d3/.github/workflows/merge-bot-pr.yml#L46-L50)

### Success pattern with default inputs, it behaves as `Exponential Backoff And Jitter`.

<img src="./assets/log-v1.2.0-exponential_backoff.png?raw=true" alt="Example of actual log - success in default" width=900>

### Error pattern with specified `equal_intervals` and `attempt-limits`.

<img src="./assets/log-v1.2.0-equal_intervals_and_attempt-limits.png?raw=true" alt="Example of actual log - error in equal_intervals_and_attempt-limits" width=900>

## Usage

This is the minimum configuration.\
I recommend to use `timeout-minutes` together with.

```yaml
jobs:
  with-waiting:
    runs-on: ubuntu-latest
    steps:
      - name: Wait for other jobs to pass or fail
        uses: kachick/wait-other-jobs@v1.3.0
        timeout-minutes: 15
```

You can change the token, status polling interval and turns early-exit as below.

```yaml
with:
  github-token: "${{ secrets.YOUR_PAT }}"
  min-interval-seconds: '300' # default '30'
  retry-method: 'equal_intervals' # default 'exponential_backoff'
  early-exit: 'false' # default 'true'
```

Full list of the changeable parameters

| NAME                   | DESCRIPTION                                                                     | TYPE     | REQUIRED | DEFAULT               | OPTIONS                                  |
| ---------------------- | ------------------------------------------------------------------------------- | -------- | -------- | --------------------- | ---------------------------------------- |
| `github-token`         | The GITHUB_TOKEN secret. You can use PAT if you want.                           | `string` | `true`   | `${{ github.token }}` |                                          |
| `min-interval-seconds` | Wait this interval or the multiplied value (and jitter) for next polling        | `number` | `false`  | `30`                  |                                          |
| `retry-method`         | How to wait for next polling                                                    | `string` | `false`  | `exponential_backoff` | `exponential_backoff`, `equal_intervals` |
| `early-exit`           | Stop rest pollings if faced at least 1 bad condition                            | `bool`   | `false`  | `true`                |                                          |
| `attempt-limits`       | Stop rest pollings after this attempts even if other jobs are not yet completed | `number` | `false`  | `1000`                |                                          |
| `dry-run`              | Avoid http requests for tests                                                   | `bool`   | `false`  | `false`               |                                          |

Below is a typical usecase. Assume test jobs defined in another workflow.

```yaml
name: Merge bot PR after CI
on: pull_request

permissions:
  contents: write
  pull-requests: write
  # checks: read # For private repositories
  # actions: read # For private repositories

jobs:
  dependabot:
    runs-on: ubuntu-latest
    if: ${{ github.actor == 'dependabot[bot]' }}
    steps:
      - name: Dependabot metadata
        id: metadata
        uses: dependabot/fetch-metadata@v1.5.1
      - uses: actions/checkout@v3
      - name: Wait for other jobs to pass or fail
        if: ${{steps.metadata.outputs.update-type != 'version-update:semver-major'}}
        uses: kachick/wait-other-jobs@v1.3.0
        timeout-minutes: 10
      - name: Approve and merge
        if: ${{steps.metadata.outputs.update-type != 'version-update:semver-major'}}
        run: gh pr review --approve "$PR_URL" && gh pr merge --auto --squash "$PR_URL"
        env:
          PR_URL: ${{github.event.pull_request.html_url}}
          GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}

  renovate:
    runs-on: ubuntu-latest
    if: ${{ github.actor == 'renovate[bot]' }}
    steps:
      - uses: actions/checkout@v3
      - name: Wait for other jobs to pass or fail
        uses: kachick/wait-other-jobs@v1.3.0
        timeout-minutes: 10
      - name: Approve and merge
        run: gh pr review --approve "$PR_URL" && gh pr merge --auto --squash "$PR_URL"
        env:
          PR_URL: ${{github.event.pull_request.html_url}}
          GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}
```

## Limitations

Judge OK or Bad with the checkRun state at the moment.\
When some jobs will be triggered after this action with `needs: [distant-first]`, it might be unaccurate. (I didn't faced yet)

## GITHUB_TOKEN vs PAT

This action just requires following GITHUB_TOKEN permissions. Needless annoying setup and needless unsecure around PAT.

```yaml
permissions:
  contents: write
  checks: read
  actions: read
```

I used a way to comment `@dependabot merge` in past. This is simple to ensure CI passed.\
However it requires PAT(Personal Access Token).\
[PAT could't be reduced the permission scope to repository.](https://github.community/t/limiting-scope-of-a-pat-to-a-single-repository/3129)\
And it requires annoy steps to generate, sets and maintains tokens [even if refined with beta version](https://github.blog/changelog/2022-10-18-introducing-fine-grained-personal-access-tokens/).

This action provides another way. It checks other workflows/jobs statuses in actions with GITHUB_TOKEN.

### Cons

- [Above merging logics are written in GitHub official docs](https://github.com/github/docs/blob/914134b5c7d10ceb19a50919b267480fd1ad55f1/content/code-security/dependabot/working-with-dependabot/automating-dependabot-with-github-actions.md#enable-auto-merge-on-a-pull-request). However [GITHUB_TOKEN merged commit does not trigger new workflows even if defined as "push"](https://github.com/github/docs/blob/914134b5c7d10ceb19a50919b267480fd1ad55f1/data/reusables/actions/actions-do-not-trigger-workflows.md?plain=1#L1). So the badges will not be shown in commit history of default branch :<
  - ref: <https://github.com/orgs/community/discussions/25251#discussioncomment-3247100>

## Why avoid `automerge` and `platformAutomerge` provided by renovate official?

`automerge` is slow. `platformAutomerge` requires many repository settings.

When you feel no issues around that, do not need to migrate to this action.\
It requires many changes in repository settings around `Allow auto-merge`, `Require status checks to pass before merging` and **specify the checked workflow name**.\
Especially specifying mandatory CI names in all personal repositories are annoy task to me.\
If we are talking only about organizations, [hashicorp/terraform](https://github.com/hashicorp/terraform) might resolve it easier.

## FAQ

Q:\
What is `failed to create review: Message: GitHub Actions is not permitted to approve pull requests.`?

A:\
Needs `Allow GitHub Actions to create and approve pull requests` to be enabled at `https://github.com/{onwer}/{repo}/settings/actions`.\
See [GitHub Blog](https://github.blog/changelog/2022-05-03-github-actions-prevent-github-actions-from-creating-and-approving-pull-requests/) for further detail.

![Disabled `Allow GitHub Actions to create and approve pull requests`](assets/allow-create-approve.png)

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
