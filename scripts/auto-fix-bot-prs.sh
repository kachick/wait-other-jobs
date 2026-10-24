#!/usr/bin/env bash
set -euo pipefail

OWNER=$(gh repo view --json owner --jq .owner.login)
echo "Checking open bot PRs for repository owner: ${OWNER}..."

# Find open bot PRs created within the same repository (excluding forks)
# Note: 'gh pr list --json author' returns 'app/renovate' or 'app/dependabot' for GitHub Apps
PRS=$(gh pr list --state open --json number,headRefName,headRepositoryOwner,author --jq '
  .[] | select(
    (.headRepositoryOwner.login == "'"${OWNER}"'") and
    (
      (.author.login == "renovate[bot]") or (.author.login == "app/renovate") or
      (.author.login == "dependabot[bot]") or (.author.login == "app/dependabot")
    )
  ) | [.number, .headRefName, .author.login] | @tsv
')

if [ -z "${PRS}" ]; then
  echo "No open bot PRs found."
  exit 0
fi

BASE_BRANCH=$(git branch --show-current)
echo "Base branch is: ${BASE_BRANCH}"

while IFS=$'\t' read -r number head_ref author; do
  [ -z "${number}" ] && continue
  echo "=================================================="
  echo "Processing PR #${number} (${head_ref}) by ${author}..."

  if ! gh pr checkout "${number}"; then
    echo "Warning: Failed to checkout PR #${number}. Skipping."
    continue
  fi

  # Run build, lint, and tests
  if ! pnpm run all; then
    echo "Warning: 'pnpm run all' failed on PR #${number}. Skipping auto-fix."
    git checkout --force "${BASE_BRANCH}"
    git clean -fd
    continue
  fi

  # Check for uncommitted diffs
  if ! (git add --intent-to-add . && git diff --exit-code); then
    echo "Diff detected in PR #${number}. Committing and pushing fixes..."
    git config user.name "github-actions[bot]"
    git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
    git add .
    git commit -m "Fix lint or build diff"
    git push origin "HEAD:${head_ref}"
    echo "Successfully pushed fixes to ${head_ref}."
  else
    echo "No diff detected in PR #${number}."
  fi

  git checkout --force "${BASE_BRANCH}"
  git clean -fd
done <<< "${PRS}"

echo "Finished processing all bot PRs."
