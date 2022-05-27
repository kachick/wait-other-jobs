# Wait other jobs

:construction:

## Why?

I mainly use this for auto merge dependabot PRs without PAT(Personal Access Token).
See [kachick/auto-merge-dependabot-pr-after-ensuring-builds](https://github.com/kachick/auto-merge-dependabot-prs-without-pat-after-workflows-passed) for further detail.

## Usage

Below is an typical usecase.

```yaml
name: Auto merge dependabot PRs if passed other jobs
on: pull_request

permissions:
  contents: write
  pull-requests: write

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

