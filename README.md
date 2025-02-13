# wait-other-jobs

[![Itself](https://github.com/kachick/wait-other-jobs/actions/workflows/itself.yml/badge.svg?branch=main)](https://github.com/kachick/wait-other-jobs/actions/workflows/itself.yml?query=event%3Apush++)\
[![gracePeriod](https://github.com/kachick/wait-other-jobs/actions/workflows/GH-820-graceperiod.yml/badge.svg?branch=main)](https://github.com/kachick/wait-other-jobs/actions/workflows/GH-820-graceperiod.yml?query=event%3Apush++)
[![eventName](https://github.com/kachick/wait-other-jobs/actions/workflows/GH-771-eventname.yml/badge.svg?branch=main)](https://github.com/kachick/wait-other-jobs/actions/workflows/GH-771-eventname.yml?query=event%3Apush++)
[![matrix](https://github.com/kachick/wait-other-jobs/actions/workflows/GH-761-matrix.yml/badge.svg?branch=main)](https://github.com/kachick/wait-other-jobs/actions/workflows/GH-761-matrix.yml?query=event%3Apush++)\
[![CI](https://github.com/kachick/wait-other-jobs/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/kachick/wait-other-jobs/actions/workflows/ci.yml?query=event%3Apush++)

This GitHub action waits for all or specific jobs, even if they are running in other workflows.\
If any of those jobs fail, this action will fail as well.

## v4 and v3

Latest stable versions are v3.x, and developing under v4.x in main branch.
I plan the major difference for default behaviors and option names. So updating v3 -> v4 might require config changes especially if you want to keep old behaviors.

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
      - uses: kachick/wait-other-jobs@v3.7.0
        timeout-minutes: 15 # Recommended to be enabled with your appropriate value for fail-safe use
```

You can change the token, polling interval, allow/deny list and turns early-exit as below.

```yaml
with:
  github-token: '${{ secrets.YOUR_PAT }}'
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
  #       You can disable this validation with `"optional": true` or use the `startupGracePeriod` that described in following section
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

| NAME                                | DESCRIPTION                                                    | TYPE     | DEFAULT                 | OPTIONS                                                         |
| ----------------------------------- | -------------------------------------------------------------- | -------- | ----------------------- | --------------------------------------------------------------- |
| `github-api-url`                    | The Github API endpoint. Override for Github Enterprise usage. | `string` | `${{ github.api_url }}` | `https://api.github.com`, `https://ghe-host.example.net/api/v3` |
| `github-token`                      | The GITHUB_TOKEN secret. You can use PAT if you want.          | `string` | `${{ github.token }}`   |                                                                 |
| `wait-seconds-before-first-polling` | Wait this interval before first polling                        | `number` | `10`                    |                                                                 |
| `min-interval-seconds`              | Wait this interval or the multiplied value (and jitter)        | `number` | `15`                    |                                                                 |
| `retry-method`                      | How to wait for next polling                                   | `string` | `equal_intervals`       | `exponential_backoff`, `equal_intervals`                        |
| `early-exit`                        | Stop rest pollings if faced at least 1 bad condition           | `bool`   | `true`                  |                                                                 |
| `attempt-limits`                    | Stop rest pollings if reached to this limit                    | `number` | `1000`                  |                                                                 |
| `wait-list`                         | Wait only these jobs                                           | `string` | `[]`                    |                                                                 |
| `skip-list`                         | Wait except these jobs                                         | `string` | `[]`                    |                                                                 |
| `skip-same-workflow`                | Skip jobs defined in the same workflow which using this action | `bool`   | `false`                 |                                                                 |
| `dry-run`                           | Avoid requests for tests                                       | `bool`   | `false`                 |                                                                 |

## Required GITHUB_TOKEN permissions

In public repositories, they are satisfied by default

```yaml
permissions:
  contents: read # Since v2
  checks: read
  actions: read
```

## Support for Github Enterprise

To run this action in your Github Enterprise (GHE) instance you need to override `github-api-url`:

```yaml
with:
  github-api-url: 'https://ghe-host.example.net/api/v3'
```

## outputs.<output_id>

- `dump`\
  A file path for collected resources which keeps fields than logged.\
  This data is only provided for debugging purposes, so the schema is not defined.

## Examples

I'm using this action for auto-merging bot PRs and wait for deploy.\
See the [docs](docs/examples.md) for further detail.

## Deadlocks

If you use this action in multiple jobs on the same repository, you should avoid deadlocks.\
The `skip-list`, `wait-list` and `skip-same-workflow` options cover this use case.

If you changed job name from the default, you should set `skip-list` or roughly use `skip-same-workflow`

```yaml
jobs:
  your_job: # This will be used default job name if you not specify below "name" field
    name: 'Changed at here'
    runs-on: ubuntu-24.04
    steps:
      - uses: kachick/wait-other-jobs@v3.7.0
        with:
          skip-list: |
            [
              {
                "workflowFile": "this_file_name.yml",
                "jobName": "Changed at here"
              }
            ]
        timeout-minutes: 15
```

Similar problems should be considered in matrix use. Because of GitHub does not provide the context.

- https://github.com/orgs/community/discussions/8945
- https://github.com/orgs/community/discussions/16614

However you can set `prefix` for `jobMatchMode` to create small skip-list to avoid this problem.

```yaml
jobs:
  your_job:
    strategy:
      matrix:
        os:
          - ubuntu-24.04
          - ubuntu-22.04
    runs-on: ${{ matrix.os }}
    steps:
      - uses: kachick/wait-other-jobs@v3.7.0
        with:
          skip-list: |
            [
              {
                "workflowFile": "this_file_name.yml",
                "jobMatchMode": "prefix",
                "jobName": "${{ github.job }}"
              }
            ]
      - run: make test
```

## Startup grace period

Judge whether the checkRun state at the moment.\
When some jobs are triggered late after this action, we need to use the following configurations.

An example of using a `wait-list`.

```yaml
with:
  wait-list: |
    [
      {
        "workflowFile": "might_be_triggered_after_0-4_minutes.yml",
        "optional": false,
        "startupGracePeriod": { "minutes": 5 }
      }
    ]
```

This action starts immediately but ignores the job missing in the first 5 minutes.

- No need to extend `wait-seconds-before-first-polling`
- Disable `optional`, because it is needed to check
- Set enough value for `startupGracePeriod` for this purpose.\
  It should be parsible with [TC39 - Temporal.Duration](https://github.com/tc39/proposal-temporal/blob/26e4cebe3c49f56932c1d5064fec9993e981823a/docs/duration.md)\
  e.g
  - `"PT3M42S"` # ISO 8601 duration format
  - `{ "minutes": 3, "seconds": 42 }` # key-value for each unit

If not using wait-list, this pattern should be considered in your `wait-seconds-before-first-polling`.

## Alternative candidates

[gh](https://github.com/cli/cli) commands, such as `gh pr checks` and `gh run watch`, should be useful if your requirements are simple.

## Limitations

- If any workflow starts many jobs as 100+, this action does not support it.\
  Because of nested paging in GraphQL makes complex. See [related docs](https://github.com/octokit/plugin-paginate-graphql.js/blob/a6b12e867466b0c583b002acd1cb1ed90b11841f/README.md?plain=1#L184-L218) for further detail.

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
