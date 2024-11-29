import { argv } from 'node:process';
import { rmSync } from 'fs';

const dirs = argv.slice(2);
for (const dir of dirs) {
  rmSync(dir, { recursive: true, force: true });
}
