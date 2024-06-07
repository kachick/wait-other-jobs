# Example

I mainly use this action for below use-case when they should run after multiple CI workflows

- [Deploy to Firebase/Vercel/Netlify](https://github.com/kachick/convert-color-json-between-windows-terminal-and-vscode/blob/1a8eac43be819204ff21eec1198fd2dfad3fcaa3/.github/workflows/firebase-hosting-pull-request.yml#L39-L43)
- [Release with GitHub releasing](https://github.com/kachick/asdf-cargo-make/blob/a666005e239cfd2b78d43e462e6279e8d8ab4d3d/.github/workflows/release.yml#L12-L16)
- [Auto approve and merge dependabot PRs without PAT(Personal Access Token)](https://github.com/kachick/ruby-ulid/blob/ad4c6090d7835d80ff02a1a5f57d6e9ae11a85d3/.github/workflows/merge-bot-pr.yml#L21-L26)
- [Auto approve and merge renovatebot PRs without `platformAutomerge` feature](https://github.com/kachick/ruby-ulid/blob/ad4c6090d7835d80ff02a1a5f57d6e9ae11a85d3/.github/workflows/merge-bot-pr.yml#L46-L50)

## Auto merge

- Assume test jobs defined in another workflow
- Assume 1 workflow file defines 2 jobs with this action, it needs to avoid deadlocks with `skip-list` or `skip-same-workflow` option

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
    runs-on: ubuntu-24.04
    if: ${{ github.actor == 'dependabot[bot]' }}
    steps:
      - name: Dependabot metadata
        id: metadata
        uses: dependabot/fetch-metadata@0fb21704c18a42ce5aa8d720ea4b912f5e6babef # v2.0.0
      - name: Wait other jobs
        if: ${{steps.metadata.outputs.update-type != 'version-update:semver-major'}}
        uses: kachick/wait-other-jobs@v3.4.0
        timeout-minutes: 10
        with:
          skip-same-workflow: 'true'
      - name: Approve and merge
        if: ${{steps.metadata.outputs.update-type != 'version-update:semver-major'}}
        run: gh pr review --approve "$PR_URL" && gh pr merge --auto --squash --delete-branch "$PR_URL"
        env:
          PR_URL: ${{github.event.pull_request.html_url}}
          GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}

  renovate:
    runs-on: ubuntu-24.04
    if: ${{ github.actor == 'renovate[bot]' }}
    steps:
      - name: Wait other jobs
        uses: kachick/wait-other-jobs@v3.4.0
        timeout-minutes: 10
        with:
          skip-same-workflow: 'true'
      - name: Approve and merge
        run: gh pr review --approve "$PR_URL" && gh pr merge --auto --squash --delete-branch "$PR_URL"
        env:
          PR_URL: ${{github.event.pull_request.html_url}}
          GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}
```

## GITHUB_TOKEN vs PAT

I used a way to comment `@dependabot merge` in past. This is simple to ensure CI passed.\
However it requires PAT(Personal Access Token).\
[PAT could't be reduced the permission scope to repository.](https://github.community/t/limiting-scope-of-a-pat-to-a-single-repository/3129)\
And it requires annoy steps to generate, sets and maintains tokens [even if refined with beta version](https://github.blog/changelog/2022-10-18-introducing-fine-grained-personal-access-tokens/).

This action provides another way. It checks other workflows/jobs statuses in actions with GITHUB_TOKEN.

If you use GITHUB_TOKEN as above, make sure two options are enabled

`https://github.com/OWNER/REPO/settings` => `Allow auto-merge`

How to enable with gh CLI

```bash
gh repo edit OWNER/REPO --enable-auto-merge
```

`https://github.com/OWNER/REPO/settings/actions` => `Allow GitHub Actions to create and approve pull requests`

How to enable with gh CLI

```bash
gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  /repos/OWNER/REPO/actions/permissions/workflow \
  -F can_approve_pull_request_reviews=true
```

See [GitHub Blog](https://github.blog/changelog/2022-05-03-github-actions-prevent-github-actions-from-creating-and-approving-pull-requests/) for further detail.

### Cons

- [Above merging logics are written in GitHub official docs](https://github.com/github/docs/blob/914134b5c7d10ceb19a50919b267480fd1ad55f1/content/code-security/dependabot/working-with-dependabot/automating-dependabot-with-github-actions.md#enable-auto-merge-on-a-pull-request). However [GITHUB_TOKEN merged commit does not trigger new workflows even if defined as "push"](https://github.com/github/docs/blob/914134b5c7d10ceb19a50919b267480fd1ad55f1/data/reusables/actions/actions-do-not-trigger-workflows.md?plain=1#L1). So the badges will not be shown in commit history of default branch :<
  - ref: <https://github.com/orgs/community/discussions/25251#discussioncomment-3247100>

## Why avoid `automerge` and `platformAutomerge` provided by renovate official?

`automerge` is slow. `platformAutomerge` requires many repository settings.

When you feel no issues around that, do not need to migrate to this action.\
It requires many changes in repository settings around `Allow auto-merge`, `Require status checks to pass before merging` and **specify the checked workflow name**.\
Especially specifying mandatory CI names in all personal repositories are annoy task to me.\
If we are talking only about organizations, [hashicorp/terraform](https://github.com/hashicorp/terraform) might resolve it easier.
