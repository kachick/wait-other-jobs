# How to develop

## Setup

1. Install [Nix](https://nixos.org/) package manager
2. Run `nix-shell`
3. You can use development tasks

```console
> nix-shell
(prepared bash)

> npm install
64 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities..

> makers help
Tools
----------
check - ...
help - ...

> makers check
...tests, typechecks, linters...
```

See also [scripts](package.json) for tasks details.

## REPL

```typescript
> npm run repl
Welcome to Node.js v16.19.0.
Type ".help" for more information.

> // You can use `import()` function, not `import statement`.
> const { info, isDebug, debug } = await import('@actions/core');
> isDebug()
false

> // TypeScript syntax can be used, but no typechecking executed.
> const foo: number = 42;
undefined

> // Utils can be loaded
> const { readableDuration } = await import('./src/wait.ts');
> readableDuration(4200)
'about 4 seconds'
```

## Why using ncc and esbuild?

Honestly I want to have only one tool. However keeping ncc for compatibility. Quote from [esbuild documents](https://github.com/esbuild/esbuild.github.io/blob/b431563203d117c4cf9f467481960aeaabcc0fde/src/content/getting-started.yml#L268-L314).

```
You also may not want to bundle your dependencies with esbuild. There are many node-specific features that esbuild doesn't support while bundling such as __dirname, import.meta.url, fs.readFileSync, and *.node native binary modules. You can exclude all of your dependencies from the bundle by setting packages to external:

esbuild app.jsx --bundle --platform=node --packages=external

If you do this, your dependencies must still be present on the file system at run-time since they are no longer included in the bundle.
```
