// Update
// import { join } from 'path';
// import { execFileSync } from 'node:child_process';

// node --loader tsx --no-warnings --test ./src/**/*.test.ts

// Missing in v20.5.1
//   - https://github.com/kachick/times_kachick/issues/244
//   - https://github.com/nodejs/node/pull/48698
// const dirEnts = readdirSync('src', { recursive: false, withFileTypes: true });

import { walkSync } from 'https://deno.land/std@0.200.0/fs/walk.ts';

const testPaths = [];

for (const walkEnt of walkSync('./src')) {
  if (walkEnt.name.endsWith('.test.ts') && walkEnt.isFile) {
    testPaths.push(walkEnt.path);
  }
}

const command = new Deno.Command('node', { args: ['--loader', 'tsx', '--no-warnings', '--test', ...testPaths] });

const output = command.outputSync();
console.log(output.stderr.toString());
console.log(testPaths.join(', '));
