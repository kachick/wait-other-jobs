# wait-other-jobs

[![CI](https://github.com/kachick/wait-other-jobs/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/kachick/wait-other-jobs/actions/workflows/ci.yml?query=event%3Apush++)
[![Itself](https://github.com/kachick/wait-other-jobs/actions/workflows/itself.yml/badge.svg?branch=main)](https://github.com/kachick/wait-other-jobs/actions/workflows/itself.yml?query=event%3Apush++)

This GitHub action waits for all or specific jobs, even if they are running in other workflows.\
If any of those jobs fail, this action will fail as well.

## Usage

Zero or tiny configuration may work.

```yaml
jobs:
  your_job:
    # Enabling these permissions are required in private repositories
    # permissions:
    #   contents: read
    #   checks: read
    #   actions: read
    runs-on: ubuntu-latest
    steps:
      - uses: kachick/wait-other-jobs@v3.0.0
        timeout-minutes: 15 # Recommended to be enabled with your appropriate value for fail-safe use
```

You can change the token, polling interval, allow/deny list and turns early-exit as below.

```yaml
with:
  github-token: "${{ secrets.YOUR_PAT }}"
  wait-seconds-before-first-polling: '30' # default '10'
  min-interval-seconds: '300' # default '15'
  retry-method: 'exponential_backoff' # default 'equal_intervals'
  early-exit: 'false' # default 'true'
  # lists should be given with JSON formatted array, do not specify both wait-list and skip-list
  #   - Each items should have "workflowFile" field and they can optinaly have "jobName" field
  #   - If no jobName is specified, all of jobs in the workflow will be targeted
  wait-list: |
    [
      {
        "workflowFile": "ci.yml",
        "jobName": "test"
      },
      {
        "workflowFile": "release.yml"
      }
    ]
  skip-list: |
    [
      {
        "workflowFile": "pages.yml"
      }
    ]
```

Full list of the options

| NAME                                | DESCRIPTION                                                                     | TYPE     | REQUIRED | DEFAULT               | OPTIONS                                  |
| ----------------------------------- | ------------------------------------------------------------------------------- | -------- | -------- | --------------------- | ---------------------------------------- |
| `github-token`                      | The GITHUB_TOKEN secret. You can use PAT if you want.                           | `string` | `true`   | `${{ github.token }}` |                                          |
| `wait-seconds-before-first-polling` | Wait this interval before first polling                                         | `number` | `false`  | `10`                  |                                          |
| `min-interval-seconds`              | Wait this interval or the multiplied value (and jitter) for next polling        | `number` | `false`  | `15`                  |                                          |
| `retry-method`                      | How to wait for next polling                                                    | `string` | `false`  | `equal_intervals`     | `exponential_backoff`, `equal_intervals` |
| `early-exit`                        | Stop rest pollings if faced at least 1 bad condition                            | `bool`   | `false`  | `true`                |                                          |
| `attempt-limits`                    | Stop rest pollings after this attempts even if other jobs are not yet completed | `number` | `false`  | `1000`                |                                          |
| `wait-list`                         | This action will not wait for items other than this list                        | `string` | `false`  | `[]`                  |                                          |
| `skip-list`                         | This action will not wait for items on this list                                | `string` | `false`  | `[]`                  |                                          |
| `dry-run`                           | Avoid requests for tests                                                        | `bool`   | `false`  | `false`               |                                          |

## Required GTHUB_TOKEN permissions

In public repositories, they are satisfied by default

```yaml
permissions:
  contents: read # Since v2
  checks: read
  actions: read
```

## Examples

I'm using this action for auto-merging bot PRs and wait for deploy.\
See the [docs](docs/examples.md) for further detail.

## Limitations

- If you use this action in multiple jobs on the same repository, you should avoid deadlocks.\
  The `skip-list` and `wait-list` options described above cover this use case.

- Judge OK or Bad with the checkRun state at the moment.\
  When some jobs will be triggered after this action with `needs: [distant-first]`, it might be unaccurate.\
  (I didn't see actual example yet)

- If any workflow starts many jobs as 100+, this action does not support it.\
  Because of nested paging in GraphQL makes complex. See [related docs](https://github.com/octokit/plugin-paginate-graphql.js/blob/a6b12e867466b0c583b002acd1cb1ed90b11841f/README.md#L184-L218) for further detail.

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
