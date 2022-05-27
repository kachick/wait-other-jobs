# Auto merge dependabot PRs without PAT after all workflows passed

:construction:

## Why?

I used a way to comment "@dependabot merge". This is simple to ensure CI passed. However it requires PAT(Personal Access Token). It is all.
So this action provides another way. It checks other builds and merging the dependabot PR with GITHUB_TOKEN not PAT.

## Usage

```yaml
name: Auto merge dependabot PRs
on: pull_request

permissions:
  contents: write
  pull-requests: write

jobs:
  auto-merge-dependabot-prs:
    runs-on: ubuntu-latest
    if: ${{ github.actor == 'dependabot[bot]' }}
     timeout-minutes: 30
    steps:
      - name: Dependabot metadata
        id: metadata
        uses: dependabot/fetch-metadata@v1.3.1
        with:
          github-token: "${{ secrets.GITHUB_TOKEN }}"
      - name: Auto merge Dependabot PRs
        if: ${{steps.metadata.outputs.update-type == 'version-update:semver-patch'}}
        uses: kachick/auto-merge-dependabot-prs-without-pat-after-workflows-passed@v1-beta
        with:
          github-token: "${{ secrets.GITHUB_TOKEN }}"
        env:
          GITHUB_TOKEN: "${{ secrets.GITHUB_TOKEN }}" # Currently needed to pass same value separately with ~ github-token
```

You can adjust status polling interval and merging strategy as below.

```yaml
        with:
          github-token: "${{ secrets.GITHUB_TOKEN }}"
          min-interval-seconds: 300 # default 30
          merging-strategy: "merge" # default "squash"
```

## TODO

* Configurable updating policy: Below is the idea
  ```typescript
  // This is an example to get updating info. However delegating to https://github.com/dependabot/fetch-metadata/f should be robust.
  //
  const title = pr.title as string;
  const match = title.match(/from (\S+) (?<before>\S+) to (?<after>\S+)$/);
  if (!match) {
    throw 'dependabot title format might be changed :<';
  }
  const before = match[1].split('.');
  const after = match[2].split('.');
  const isSemVerPatchLevel = before[0] === after[0] && before[1] === after[1];
  if (isSemVerPatchLevel) {
    merge ();
  }

  // Passing from dependabot/fetch-metadata and use it might be approvable
  ```
