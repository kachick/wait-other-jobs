#!/usr/bin/env -S deno run --allow-all
import $ from 'jsr:@david/dax';

await $`node --import tsx --no-warnings src/generate_json_schema.ts`;
