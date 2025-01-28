#!/usr/bin/env -S deno run --allow-all
import $ from 'jsr:@david/dax';

await Promise.all([
  $`dprint check`,
  $`deno lint`,
  $`typos . .github .vscode`,
  $`gitleaks dir .`, // git mode is 4x slower
  $`git ls-files '*.nix' | xargs nixfmt --check`,
  $`git ls-files '.github' | xargs selfup list -check`,
]);
