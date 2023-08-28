import * as esbuild from 'esbuild';

// https://github.com/evanw/esbuild/issues/1921#issuecomment-1491470829
// https://github.com/evanw/esbuild/issues/1921#issuecomment-1575636282
await esbuild.build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  outfile: 'dist/index.js',
  format: 'esm',
  target: 'node20',
  platform: 'node',
  banner: {
    js: `
    import path from 'path';
    import { fileURLToPath } from 'url';
    import { createRequire as topLevelCreateRequire } from 'module';
    const require = topLevelCreateRequire(import.meta.url);
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
        `,
  },
});
