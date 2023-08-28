// Update

import { readdirSync } from 'node:fs';
import { join } from 'path';
import { execFileSync } from 'node:child_process';

// node --loader tsx --no-warnings --test ./src/**/*.test.ts

// Missing in v20.5.1
//   - https://github.com/kachick/times_kachick/issues/244
//   - https://github.com/nodejs/node/pull/48698
const dirEnts = readdirSync('src', { recursive: false, withFileTypes: true });

// const testPaths = dirEnts.flatMap((dirEnt) => dirEnt.name.endsWith('.test.ts') ? [join(dirEnt.path, dirEnt.name)] : []);
const testPaths = dirEnts;

const output = execFileSync('node', ['--loader', 'tsx', '--no-warnings', '--test', '--version']).toString();
console.log(output);
console.log(testPaths);
