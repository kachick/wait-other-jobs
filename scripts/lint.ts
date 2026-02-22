#!/usr/bin/env -S deno run --allow-all
import $ from 'jsr:@david/dax@^0.43.1';

await Promise.all([
  $`dprint fmt`,
  $`dprint check`,
  $`oxlint -c .oxlintrc.json --deny-warnings`,
  $`typos . .github .vscode`,
  $`gitleaks dir .`,
  $`git ls-files '*.nix' | xargs nixfmt --check`,
]);
