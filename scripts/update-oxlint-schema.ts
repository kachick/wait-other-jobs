#!/usr/bin/env -S deno run --allow-all
import $ from 'jsr:@david/dax@^0.43.1';

// 1. Get oxlint version
const versionOutput = await $`oxlint --version`.text(); // e.g. "oxlint 0.15.10 (3ef...)"
const match = versionOutput.match(/(\d+\.\d+\.\d+)/);

if (!match) {
  console.error(`Could not parse oxlint version: ${versionOutput}`);
  Deno.exit(1);
}

const version = match[1];
console.log(`Detected oxlint version: ${version}`);

// 2. Construct Schema URL (Tag format: oxlint_vX.Y.Z)
// Note: This relies on oxc project tag naming convention.
const url =
  `https://raw.githubusercontent.com/oxc-project/oxc/refs/tags/oxlint_v${version}/npm/oxlint/configuration_schema.json`;

const dest = 'dependencies/oxlint-schema.json';

// 3. Download
try {
  console.log(`Downloading schema from: ${url}`);
  await $.request(url).pipeToPath(dest);
  await $`dprint fmt ${dest}`;
  console.log('Schema updated successfully.');
} catch (error) {
  console.error(`Failed to download schema: ${error}`);
  Deno.exit(1);
}
