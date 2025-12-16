#!/usr/bin/env -S deno run --allow-all
import $ from 'jsr:@david/dax@^0.43.1';

await Promise.all([
  $`dprint check`,
  $`biome check`,
  $`typos . .github .vscode`,
  $`gitleaks dir .`, // git mode is 4x slower
  $`git ls-files '*.nix' | xargs nixfmt --check`,
]);
