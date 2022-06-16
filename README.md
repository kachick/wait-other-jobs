# Wait other jobs

[![Test & Lint](https://github.com/kachick/wait-other-jobs/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/kachick/wait-other-jobs/actions/workflows/test.yml)

This action waits all GitHub Action jobs even if they are running in other workflows.\
When some jobs failed, this action exit with NON 0 value. Otherwise exit with 0.

<img src="./assets/actual-log-v1.1.1-passed.png?raw=true" alt="Example of actual log" width=700>

# GITHUB_TOKEN vs PAT

I mainly use this for auto merge dependabot PRs without PAT(Personal Access Token).

This action just requires following GITHUB_TOKEN permissions.

```yaml
permissions:
  contents: write
  checks: read
  actions: read
```

# Usage

Just requires `github-token` for minimum configuration.\
I recommend to use `timeout-minutes` together with.

```yaml
jobs:
  with-waiting:
    runs-on: ubuntu-latest
    steps:
      - name: Wait other jobs are passed or failed
        uses: kachick/wait-other-jobs@v1
        timeout-minutes: 30
        with:
          github-token: "${{ secrets.GITHUB_TOKEN }}"
```

You can adjust status polling interval and turns early-exit as below.

```yaml
with:
  github-token: "${{ secrets.GITHUB_TOKEN }}"
  min-interval-seconds: '300' # default '30'
  early-exit: 'false' # default 'true'
```

Below is a typical usecase. Assume test jobs defined in another workflow.

```yaml
name: Auto merge dependabot PRs if passed other jobs
on: pull_request

permissions:
  contents: write
  pull-requests: write
  # checks: read # For private repositories
  # actions: read # For private repositories

jobs:
  auto-merge-dependabot-prs:
    runs-on: ubuntu-latest
    if: ${{ github.actor == 'dependabot[bot]' }}
    steps:
      - name: Dependabot metadata
        id: metadata
        uses: dependabot/fetch-metadata@v1.3.1
        with:
          github-token: "${{ secrets.GITHUB_TOKEN }}"
      - name: Wait other jobs are passed or failed
        if: ${{contains(steps.metadata.outputs.dependency-names, 'my-dependency') && steps.metadata.outputs.update-type == 'version-update:semver-patch'}}
        uses: kachick/wait-other-jobs@v1
        timeout-minutes: 30
        with:
          github-token: "${{ secrets.GITHUB_TOKEN }}"
      - name: Enable auto approve and merge for Dependabot PRs
        if: ${{contains(steps.metadata.outputs.dependency-names, 'my-dependency') && steps.metadata.outputs.update-type == 'version-update:semver-patch'}}
        run: gh pr review --approve "$PR_URL" && gh pr merge --auto --squash "$PR_URL"
        env:
          PR_URL: ${{github.event.pull_request.html_url}}
          GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}
```

[An actual example is here](https://github.com/kachick/rspec-matchers-power_assert_matchers/blob/650a0ef0c290d42cd0a70ef7c011de2c3777c966/.github/workflows/auto-merge-dependabot-prs.yml)

# Why using for dependabot auto-merge?

I used a way to comment `@dependabot merge`. This is simple to ensure CI passed.\
However it requires PAT(Personal Access Token).\
[Current PAT can't be reduced the permission scope to repository.](https://github.community/t/limiting-scope-of-a-pat-to-a-single-repository/3129)
It is all.\
So this action provides another way. It checks other jobs statuses.

## Cons

- [Above merging logics are written in GitHub official docs](https://github.com/github/docs/blob/914134b5c7d10ceb19a50919b267480fd1ad55f1/content/code-security/dependabot/working-with-dependabot/automating-dependabot-with-github-actions.md#enable-auto-merge-on-a-pull-request). However [GITHUB_TOKEN merged commit does not trigger new workflows even if defined as "push"](https://github.com/github/docs/blob/914134b5c7d10ceb19a50919b267480fd1ad55f1/data/reusables/actions/actions-do-not-trigger-workflows.md?plain=1#L1). So the badges will not be shown in the GitHub history :<
  - ref: https://github.community/t/githhub-acitons-push-event-not-triggered-if-githubactions-bot-enabled-auto-merge/238439

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
