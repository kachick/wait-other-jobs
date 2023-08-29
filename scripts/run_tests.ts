import { readdirSync } from 'node:fs';
import { join } from 'path';
import { execFileSync } from 'node:child_process';

// TODO: Update with enabling withFileTypes if fixed the feature
//
// Do NOT specify both recursive and withFileTypes as true, entries will be missed in v20.5.1
//   - https://github.com/kachick/times_kachick/issues/244
//   - https://github.com/nodejs/node/pull/48698
const baseNames = readdirSync('src', { encoding: 'utf-8', recursive: true, withFileTypes: false });

const testPaths = baseNames.flatMap((name) => name.endsWith('.test.ts') ? [join('src', name)] : []);

console.log('Starting to run tests for', testPaths);

execFileSync('node', ['--loader', 'tsx', '--no-warnings', '--test', ...testPaths], {
  // preserving color: https://github.com/nodejs/help/issues/2183#issuecomment-532362821
  stdio: 'inherit',
});
