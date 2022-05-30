# Wait other jobs

This action waits all GitHub Action jobs even if they are in other workflows

## Why?

I mainly use this for auto merge dependabot PRs without PAT(Personal Access Token).

This action requires following GITHUB_TOKEN permissions.

```yaml
permissions:
  contents: write
  checks: read
  actions: read
```

## Usage

Below is a typical usecase.

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
        uses: kachick/wait-other-jobs@v1-beta
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

You can adjust status polling interval as below.

```yaml
        with:
          github-token: "${{ secrets.GITHUB_TOKEN }}"
          min-interval-seconds: 300 # default 30
```

[An actual example is here](https://github.com/kachick/rspec-matchers-power_assert_matchers/blob/650a0ef0c290d42cd0a70ef7c011de2c3777c966/.github/workflows/auto-merge-dependabot-prs.yml)

# Why using for dependabot auto-merge?

I used a way to comment `@dependabot merge`. This is simple to ensure CI passed. However it requires PAT(Personal Access Token). [Current PAT can't be reduced the permission scope to repository.](https://github.community/t/limiting-scope-of-a-pat-to-a-single-repository/3129) It is all. So this action provides another way. It checks other jobs statuses.

# Development

Using typescript@next for native ESM on Node.js
So recommend to enable https://github.com/microsoft/vscode-typescript-next/tree/487aee08c23a8f7364825a821fa95baf17c184d4#enabling on your vscode
