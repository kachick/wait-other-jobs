# wait-other-jobs

[![Itself](https://github.com/kachick/wait-other-jobs/actions/workflows/itself.yml/badge.svg?branch=main)](https://github.com/kachick/wait-other-jobs/actions/workflows/itself.yml?query=event%3Apush++)
[![TypeScript](https://github.com/kachick/wait-other-jobs/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/kachick/wait-other-jobs/actions/workflows/ci.yml?query=event%3Apush++)

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
    runs-on: ubuntu-24.04
    steps:
      - uses: kachick/wait-other-jobs@v3.2.0
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
  skip-same-workflow: 'true' # default 'false'
  # lists should be given with JSON formatted array, do not specify both wait-list and skip-list
  #   - Each item should have a "workflowFile" field, and they can optionally have a "jobName" field.
  #   - If no jobName is specified, all the jobs in the workflow will be targeted.
  #   - wait-list: 
  #     - If the checkRun for the specified name is not found, this action raise errors by default.
  #       You can disable this validation with `"optional": true` or use the method written in "Timing" section
  #     - Wait for all event types by default, you can change with `"eventName": "EVENT_NAME_AS_push"`.
  wait-list: |
    [
      {
        "workflowFile": "ci.yml",
        "jobName": "test",
        "eventName": "${{ github.event_name }}"
      },
      {
        "workflowFile": "release.yml",
        "optional": true
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

| NAME                                | DESCRIPTION                                                    | TYPE     | DEFAULT               | OPTIONS                                  |
| ----------------------------------- | -------------------------------------------------------------- | -------- | --------------------- | ---------------------------------------- |
| `github-token`                      | The GITHUB_TOKEN secret. You can use PAT if you want.          | `string` | `${{ github.token }}` |                                          |
| `wait-seconds-before-first-polling` | Wait this interval before first polling                        | `number` | `10`                  |                                          |
| `min-interval-seconds`              | Wait this interval or the multiplied value (and jitter)        | `number` | `15`                  |                                          |
| `retry-method`                      | How to wait for next polling                                   | `string` | `equal_intervals`     | `exponential_backoff`, `equal_intervals` |
| `early-exit`                        | Stop rest pollings if faced at least 1 bad condition           | `bool`   | `true`                |                                          |
| `attempt-limits`                    | Stop rest pollings if reached to this limit                    | `number` | `1000`                |                                          |
| `wait-list`                         | Wait only these jobs                                           | `string` | `[]`                  |                                          |
| `skip-list`                         | Wait except these jobs                                         | `string` | `[]`                  |                                          |
| `skip-same-workflow`                | Skip jobs defined in the same workflow which using this action | `bool`   | `false`               |                                          |
| `dry-run`                           | Avoid requests for tests                                       | `bool`   | `false`               |                                          |

## Required GITHUB_TOKEN permissions

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

## Deadlocks

- If you use this action in multiple jobs on the same repository, you should avoid deadlocks.\
  The `skip-list`, `wait-list` and `skip-same-workflow` options cover this use case.

- If you changed job name from the default, you should specify with `skip-list` or use `skip-same-workflow`
  ```yaml
  jobs:
    your_job: # This will be used default job name if you not specify below "name" field
      name: "Changed at here"
      runs-on: ubuntu-24.04
      steps:
        - uses: kachick/wait-other-jobs@v3
          with:
            skip-list: |
              [
                {
                  "workflowFile": "this_file_name_here.yml",
                  "jobName": "Changed at here"
                }
              ]
          timeout-minutes: 15
  ```
  Similar problems should be considered in matrix jobs. See [#761](https://github.com/kachick/wait-other-jobs/issues/761) for further detail

## Timing

Judge whether the checkRun state is OK or bad at the moment.\
When some jobs will be triggered after this action with `needs: [distant-first]`, it might be inaccurate.\
Basically we set large `wait-seconds-before-first-polling` for this case.

However, using a `wait-list` may avoid this problem.

```yaml
with:
  wait-list: |
    [
      {
        "workflowFile": "might_be_triggered_after_0-4_minutes.yml",
        "optional": false,
        "startupGracePeriod": 300
      }
    ]
```

- No need to extend `wait-seconds-before-first-polling`
- Disable `optional`, because it is needed to check
- Specify `startupGracePeriod` for it

This action starts immediately but ignores the job missing in the first 5 minutes.

## Limitations

- If any workflow starts many jobs as 100+, this action does not support it.\
  Because of nested paging in GraphQL makes complex. See [related docs](https://github.com/octokit/plugin-paginate-graphql.js/blob/a6b12e867466b0c583b002acd1cb1ed90b11841f/README.md#L184-L218) for further detail.

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
