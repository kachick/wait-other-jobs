#!/usr/bin/env -S deno run --allow-all
import $ from 'jsr:@david/dax';

import { join } from 'jsr:@std/path';

const cwd = Deno.cwd();
const testDir = join(cwd, '__tests__');
const dirEnts = Deno.readDirSync(testDir);
const testPaths = Array.from(dirEnts).flatMap((dirent) =>
  dirent.name.endsWith('.test.ts') ? [join(testDir, dirent.name)] : []
);

console.log('Starting to run tests for', testPaths);

await $`node --import tsx --no-warnings --test ${testPaths}`;
