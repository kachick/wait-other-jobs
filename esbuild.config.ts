import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { build } from 'esbuild';

const bannerText = readFileSync(join(process.cwd(), 'dependencies', 'banner.js'), 'utf8');
const require = createRequire(import.meta.url);

await build({
  entryPoints: ['src/main.ts'],
  outfile: 'dist/index.js',
  bundle: true,
  format: 'esm',
  target: 'node24',
  platform: 'node',

  banner: {
    // https://github.com/evanw/esbuild/issues/1921#issuecomment-1491470829
    // https://github.com/evanw/esbuild/issues/1921#issuecomment-1575636282
    js: bannerText,
  },

  plugins: [
    // https://github.com/microsoft/node-jsonc-parser/issues/57
    // https://github.com/evanw/esbuild/issues/1619
    // https://github.com/vercel/vercel/pull/13263
    {
      name: 'jsonc-parser-module-first',
      setup(build) {
        build.onResolve({ filter: /^jsonc-parser$/ }, args => {
          const pkgJsonPath = require.resolve('jsonc-parser/package.json', {
            paths: [args.resolveDir],
          });
          const { module, main } = JSON.parse(
            readFileSync(pkgJsonPath, 'utf8'),
          );
          const entryRel = module ?? main ?? 'index.js';
          const entryAbs = join(dirname(pkgJsonPath), entryRel);
          return { path: entryAbs, namespace: 'file' };
        });
      },
    },
  ],
});
