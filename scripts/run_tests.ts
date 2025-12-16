#!/usr/bin/env -S deno run --allow-all
import $ from 'jsr:@david/dax@^0.43.1';

import { join } from 'jsr:@std/path@^1.0.8';

const cwd = Deno.cwd();
const testDir = join(cwd, '__tests__');
const dirEnts = Deno.readDirSync(testDir);
const testPaths = Array.from(dirEnts).flatMap((dirent) =>
  dirent.name.endsWith('.test.ts') ? [join(testDir, dirent.name)] : []
);

console.log('Starting to run tests for', testPaths);

await $`node --test ${testPaths}`;
