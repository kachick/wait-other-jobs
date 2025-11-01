# wait-other-jobs

[![Itself](https://github.com/kachick/wait-other-jobs/actions/workflows/itself.yml/badge.svg?branch=main)](https://github.com/kachick/wait-other-jobs/actions/workflows/itself.yml?query=branch%3Amain)\
[![gracePeriod](https://github.com/kachick/wait-other-jobs/actions/workflows/GH-820-graceperiod.yml/badge.svg?branch=main)](https://github.com/kachick/wait-other-jobs/actions/workflows/GH-820-graceperiod.yml?query=branch%3Amain)
[![eventName](https://github.com/kachick/wait-other-jobs/actions/workflows/GH-771-eventname.yml/badge.svg?branch=main)](https://github.com/kachick/wait-other-jobs/actions/workflows/GH-771-eventname.yml?query=branch%3Amain)
[![matrix](https://github.com/kachick/wait-other-jobs/actions/workflows/GH-761-matrix.yml/badge.svg?branch=main)](https://github.com/kachick/wait-other-jobs/actions/workflows/GH-761-matrix.yml?query=branch%3Amain)\
[![CI](https://github.com/kachick/wait-other-jobs/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/kachick/wait-other-jobs/actions/workflows/ci.yml?query=branch%3Amain)

This GitHub Action waits for all jobs by default even if they run in other workflows.\
You can also choose to wait for specific jobs.\
If any of the jobs fail, this action fails too.

## v4 or v3

Latest stable versions are v3.x, and developing v4.x in main branch.

## Usage

It works with zero or little configuration.

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
      - uses: kachick/wait-other-jobs@v3.8.1
        timeout-minutes: 15 # Recommended to be enabled with your appropriate value for fail-safe use
```

You can configure the token, polling interval, allow/deny lists, and early-exit behavior as shown below.

```yaml
with:
  warmup-delay: 'PT30S' # default 'PT1S'
  minimum-interval: 'PT300S' # default 'PT10S'
  retry-method: 'exponential_backoff' # default 'equal_intervals'
  early-exit: 'false' # default 'true'
  skip-same-workflow: 'true' # default 'false'
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

| NAME                 | DESCRIPTION                                                                     | TYPE     | DEFAULT                 | OPTIONS                                                         |
| -------------------- | ------------------------------------------------------------------------------- | -------- | ----------------------- | --------------------------------------------------------------- |
| `github-api-url`     | The Github API endpoint. Override for Github Enterprise usage.                  | `string` | `${{ github.api_url }}` | `https://api.github.com`, `https://ghe-host.example.net/api/v3` |
| `github-token`       | The GITHUB_TOKEN secret. You can use PAT if you want.                           | `string` | `${{ github.token }}`   |                                                                 |
| `warmup-delay`       | Wait this interval before first polling                                         | `string` | `PT1S`                  | [ISO 8601 duration format][tc39-temporal-duration]              |
| `minimum-interval`   | Wait for this or a longer interval between each poll to reduce GitHub API calls | `string` | `PT10S`                 | [ISO 8601 duration format][tc39-temporal-duration]              |
| `retry-method`       | How to wait for next polling                                                    | `string` | `equal_intervals`       | `exponential_backoff`, `equal_intervals`                        |
| `early-exit`         | Stop polling as soon as one job fails                                           | `bool`   | `true`                  |                                                                 |
| `attempt-limits`     | Stop polling if reached to this limit                                           | `number` | `1000`                  |                                                                 |
| `wait-list`          | Wait only for these jobs                                                        | `string` | `[]`                    | JSON Array                                                      |
| `skip-list`          | Wait for all jobs except these                                                  | `string` | `[]`                    | JSON Array                                                      |
| `skip-same-workflow` | Skip jobs defined in the same workflow which using this action                  | `bool`   | `false`                 |                                                                 |
| `dry-run`            | Avoid requests for tests                                                        | `bool`   | `false`                 |                                                                 |

## Guide for option syntax and reasonable values

- [Trailing commas are not allowed in JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Trailing_commas)
- GitHub API Limit: At least we should consider about `GITHUB_TOKEN`, that is allowed 1000 per hour per repository.\
  Roughly calculating for long jobs, setting the `minimum-interval` larger than or equal `PT4S` would be safer.
  - [Primary Rate Limit for GITHUB_TOKEN](https://github.com/github/docs/blob/c26f36dbabb133b263c0f979f257b31d6c979341/data/reusables/rest-api/primary-rate-limit-github-token-in-actions.md)
  - [Secondary Limit](https://github.com/github/docs/blob/c26f36dbabb133b263c0f979f257b31d6c979341/data/reusables/rest-api/secondary-rate-limit-rest-graphql.md)

## Schema of wait-list and skip-list

Lists should be given with JSON array, do not use both wait-list and skip-list together

- Each item should have a "workflowFile" field, and they can optionally have a "jobName" field.
- If no jobName is specified, all the jobs in the workflow will be targeted.
- wait-list:
  - If the checkRun for the specified name is not found, this action raise errors by default.\
    You can disable this validation with `"optional": true` or use the `startupGracePeriod` that described in following section
  - Wait for all event types by default, you can change with `"eventName": "EVENT_NAME_AS_push"`.

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

These outputs are for testing and debugging only. The schema is not defined.

- `parameters`\
  Parsed values from `with` and some context.

- `dump`\
  A file path for collected resources which keeps fields than logged.

## Examples

I'm using this action for auto-merging bot PRs and wait for deploy.\
See the [docs](docs/examples.md) for further detail.

## Deadlocks

When using this action in multiple jobs within the same repository, be careful to avoid deadlocks.\
The `skip-list`, `wait-list` and `skip-same-workflow` options cover this use case.

If you changed job name from the default, you should set `skip-list` or roughly use `skip-same-workflow`

```yaml
jobs:
  your_job: # This will be used default job name if you not specify below "name" field
    name: 'Changed at here'
    runs-on: ubuntu-24.04
    steps:
      - uses: kachick/wait-other-jobs@v3.8.1
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

You need to consider similar problems when using matrix, because GitHub does not provide enough context.

- <https://github.com/orgs/community/discussions/8945>
- <https://github.com/orgs/community/discussions/16614>

However you can set `prefix` for `jobMatchMode` to create small skip-list to avoid this problem.

```yaml
jobs:
  your_job:
    strategy:
      matrix:
        os:
          - ubuntu-24.04
          - ubuntu-24.04-arm
          - macos-26
          - windows-2025
    runs-on: ${{ matrix.os }}
    steps:
      - uses: kachick/wait-other-jobs@v3.8.1
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

This action only checks the status of jobs at each polling time.\
Use this option when a job may start with a short delay after this action starts.

Example using a `wait-list`.

```yaml
with:
  wait-list: |
    [
      {
        "workflowFile": "might_be_triggered_after_0-4_minutes.yml",
        "optional": false,
        "startupGracePeriod": "PT5M"
      }
    ]
```

This action starts immediately but ignores the job missing in the first 5 minutes.

- No need to extend `warmup-delay`
- Disable `optional`, because it is needed to check
- Set enough value for `startupGracePeriod`.\
  Use the [ISO 8601 duration format][tc39-temporal-duration].

If you're not using `wait-list`, you need to handle this pattern with `warmup-delay`.

## Alternative candidates

[gh](https://github.com/cli/cli) commands, such as `gh pr checks` and `gh run watch`, should be useful if your requirements are simple.

## Limitations

- If any workflow starts many jobs as 100+, this action does not support it.\
  Because of nested paging in GraphQL makes complex. See [related docs](https://github.com/octokit/plugin-paginate-graphql.js/blob/a6b12e867466b0c583b002acd1cb1ed90b11841f/README.md?plain=1#L184-L218) for further detail.

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE)

[tc39-temporal-duration]: https://github.com/tc39/proposal-temporal/blob/0.9.0/docs/duration.md
