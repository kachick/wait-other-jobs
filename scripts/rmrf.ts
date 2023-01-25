import { rmSync } from 'fs';

const dirs = process.argv.slice(2);
for (const dir of dirs) {
  rmSync(dir, { recursive: true, force: true });
}
