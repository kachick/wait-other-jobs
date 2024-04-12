# CHANGELOG

This file only records notable changes. Not synchronized with all releases and tags.

- v3.0.0
  - Wait other jobs which defined in same workflow by default: #754\
    You can change this behavior with new option `skip-same-workflow: 'true'`
- v2.0.2
  - Allow some neutral patterns: 93299c2fa22fd463db31668eba54b34b58270696
- v2.0.0
  - Add options for list-based waiting with replacing to GraphQL API: #474, #574
  - Update action engine to Node20: #586, #564
  - Change default intervals and the determined logics: #596, 15456c0
- v1.3.0
  - Provide default value for `github-token`: #523
