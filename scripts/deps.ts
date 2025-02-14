#!/usr/bin/env -S deno run --allow-all
import $ from 'jsr:@david/dax';

await Promise.all([
  $`node --version`,
  $`pnpm --version`,
  $`nix --version`,
  $`deno --version`,
  $`dprint --version`,
  $`nixfmt --version`,
  $`typos --version`,
  $`gh --version`,
  $`jq --version`,
  $`gitleaks version`,
]);
