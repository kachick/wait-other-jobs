#!/usr/bin/env -S deno run --allow-all
import $ from 'jsr:@david/dax@^0.43.1';
import { parse } from 'jsr:@std/jsonc@^0.224.0';

const jsonschemaCliPath = (await $`which jsonschema-cli`.quiet().noThrow()).stdout.trim();

if (!jsonschemaCliPath) {
  throw new Error("jsonschema-cli command not found. Ensure it's in your Nix development environment.");
}

const schemaPath = $.path('dependencies/oxlint-schema.json');
// jsonschema-cli does not support JSONC, so we need to convert it to JSON
// and write it to a temporary file in dependencies/.
// This file will be added to .gitignore.
const configPath = $.path('dependencies/.oxlintrc.json.tmp');

const configText = await Deno.readTextFile('.oxlintrc.json');
const config = parse(configText);
await Deno.writeTextFile(configPath.toString(), JSON.stringify(config));

try {
  await $`${jsonschemaCliPath} -i ${configPath} ${schemaPath}`;
} catch (e) {
  // If validation fails, re-throw for explicit failure.
  console.error(
    "Failed to run jsonschema-cli. Ensure 'jsonschema-cli' is available in nixpkgs and the config is valid.",
  );
  throw e;
} finally {
  // No need to remove the temporary file, as it's gitignored.
}
