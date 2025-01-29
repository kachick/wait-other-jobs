#!/usr/bin/env -S deno run --allow-all
import $ from 'jsr:@david/dax';

// https://github.com/evanw/esbuild/issues/1921#issuecomment-1491470829
// https://github.com/evanw/esbuild/issues/1921#issuecomment-1575636282
const text = await Deno.readTextFile('dependencies/banner.js');
await $`esbuild --bundle 'src/main.ts' --outfile='dist/index.js' --format=esm --target=node20 --platform=node --banner:js=${text}`;
