import { readdirSync } from 'node:fs';
import { join } from 'path';
import { execFileSync } from 'node:child_process';

const dirEnts = readdirSync('.', { encoding: 'utf-8', recursive: true, withFileTypes: true });
const testPaths = dirEnts.flatMap((dirent) => dirent.name.endsWith('.test.ts') ? [join(dirent.path, dirent.name)] : []);

console.log('Starting to run tests for', testPaths);

execFileSync('node', ['--import', 'tsx', '--no-warnings', '--test', ...testPaths], {
  // preserving color: https://github.com/nodejs/help/issues/2183#issuecomment-532362821
  stdio: 'inherit',
});
