#!/usr/bin/env -S deno run --allow-all
import $ from 'jsr:@david/dax';

// Sync dependency versions with current PATH. Providing to adjust with Nix devshell

const nodeVersion = await $`node --version`.text();
const normalizedNodeVersion = nodeVersion.replace(/^v/, '');
await $`echo ${normalizedNodeVersion} > '.node-version'`;

await $`git update-index -q --really-refresh`;
await $`git diff-index --quiet HEAD || git commit -m 'Sync .node-version with nixpkgs' .node-version`;

const pnpmVersion = await $`pnpm --version`.text();
const packageManagerSpecifier = `pnpm@${pnpmVersion}`;

import packageJson from '../package.json' with { type: 'json' };

const updatedPackageJson = { ...packageJson, packageManager: packageManagerSpecifier };

Deno.writeTextFileSync('package.json', JSON.stringify(updatedPackageJson, null, 2));

await $`dprint fmt package.json`;

await $`git update-index -q --really-refresh`;
await $`git diff-index --quiet HEAD || git commit -m 'Sync pnpm version with nixpkgs' package.json`;
