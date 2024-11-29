# CHANGELOG

This file only records notable changes. Not synchronized with all releases and tags.

- main - not yet released
- v3.5.0
  - Support GitHub Enterprise: [#618](https://github.com/kachick/wait-other-jobs/pull/618)
- v3.4.1
  - Fix to support `.yaml` pattern for workflow path: [#930](https://github.com/kachick/wait-other-jobs/pull/930)
- v3.4.0
  - Add `jobMatchMode` option for both the wait and skip lists. It typically helps to use matrix: [#761](https://github.com/kachick/wait-other-jobs/issues/761)
  - Add `outputs.dump`
- v3.3.0
  - Add `startupGracePeriod` option in wait-list: [#820](https://github.com/kachick/wait-other-jobs/issues/820)
  - Restrict `wait-seconds-before-first-polling` if it is too short as zero or shorter than `startupGracePeriod`
- v3.2.0
  - Add `eventName` option in wait-list: [#771](https://github.com/kachick/wait-other-jobs/issues/771)
- v3.1.0
  - Add `optional` option in wait-list: [#762](https://github.com/kachick/wait-other-jobs/pull/762)
  - Refine inputs validations and the messages: [#766](https://github.com/kachick/wait-other-jobs/pull/766)
- v3.0.0
  - Wait other jobs which defined in same workflow by default: [#754](https://github.com/kachick/wait-other-jobs/issues/754)\
    You can change this behavior with new option `skip-same-workflow: 'true'`
  - Validate if the checkRun for the wait-list specified name is not found: [#760](https://github.com/kachick/wait-other-jobs/issues/760)
- v2.0.2
  - Allow some neutral patterns: [93299c](https://github.com/kachick/wait-other-jobs/commit/93299c2fa22fd463db31668eba54b34b58270696)
- v2.0.0
  - Add options for list-based waiting with replacing to GraphQL API: [#474](https://github.com/kachick/wait-other-jobs/issues/474), [#574](https://github.com/kachick/wait-other-jobs/pull/574)
  - Update action engine to Node20: [#586](https://github.com/kachick/wait-other-jobs/issues/586), [#564](https://github.com/kachick/wait-other-jobs/pull/564)
  - Change default intervals and the determined logics: [#596](https://github.com/kachick/wait-other-jobs/pull/596), [15456c0](https://github.com/kachick/wait-other-jobs/commit/15456c0)
- v1.3.0
  - Provide default value for `github-token`: [#523](https://github.com/kachick/wait-other-jobs/pull/523)
