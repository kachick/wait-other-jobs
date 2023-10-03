#!/usr/bin/env bash

set -euo pipefail

current_tag="v$(typos --version | cut -d ' ' -f 2)"
commit_sha="$(gh api -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2022-11-28" "/repos/crate-ci/typos/commits/${current_tag}" | jq --raw-output .sha)"

echo "crate-ci/typos@${commit_sha} # ${current_tag}"
