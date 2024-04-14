# CHANGELOG

This file only records notable changes. Not synchronized with all releases and tags.

- main - not yet released
  - Add option to disable validations for `wait-list` and not found the checkRun
- v3.0.0
  - Wait other jobs which defined in same workflow by default: [#754](https://github.com/kachick/wait-other-jobs/issues/754)\
    You can change this behavior with new option `skip-same-workflow: 'true'`
  - Validate if the checkRun for the `wait-list` specified name is not found: [#760](https://github.com/kachick/wait-other-jobs/issues/760)
- v2.0.2
  - Allow some neutral patterns: [93299c](https://github.com/kachick/wait-other-jobs/commit/93299c2fa22fd463db31668eba54b34b58270696)
- v2.0.0
  - Add options for list-based waiting with replacing to GraphQL API: [#474](https://github.com/kachick/wait-other-jobs/issues/474), [#574](https://github.com/kachick/wait-other-jobs/pull/574)
  - Update action engine to Node20: [#586](https://github.com/kachick/wait-other-jobs/issues/586), [#564](https://github.com/kachick/wait-other-jobs/pull/564)
  - Change default intervals and the determined logics: [#596](https://github.com/kachick/wait-other-jobs/pull/596), [15456c0](https://github.com/kachick/wait-other-jobs/commit/15456c0)
- v1.3.0
  - Provide default value for `github-token`: [#523](https://github.com/kachick/wait-other-jobs/pull/523)
