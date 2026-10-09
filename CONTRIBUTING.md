# How to develop

GitHub Actions runs JavaScript actions on Node.js.\
This repository uses Node.js 24 and pnpm for development and runtime.\
The code transpiles and bundles into [dist](dist) with esbuild.

## Dependency management

Dependencies are managed with [Nix](https://nixos.org/) and [pnpm](https://github.com/pnpm/pnpm).

1. Run `nix develop` or `direnv allow .`
2. `pnpm run setup`

## Tasks

```console
> pnpm run
# Print all tasks

> pnpm run all
...tests, typechecks, linters, build
```

## REPL

```bash
pnpm run repl
```

```typescript
Welcome to Node.js v20.12.2.
Type ".help" for more information.
>

// You can use `import()` function, not `import statement`.
> const { Temporal } = await import('temporal-polyfill')
> Temporal.Duration.from({seconds: 500}).round({ largestUnit: 'minutes' }).toString()
'PT8M20S'

// exported methods in this repository also can be loaded
> const { readableDuration } = await import('./src/report.ts');
> readableDuration(Temporal.Duration.from({seconds: 500}))
'about 8 minutes 20 seconds'

// You can directly use TypeScript code
> const map = new Map<K, Array<T>>();
> map.set(undefined, 42)
Map(1) { undefined => 42 }
```

## Why not?

- Why not link to MDN for the Temporal.Duration format?\
  This will be revisited once [nodejs/node#57127](https://github.com/nodejs/node/issues/57127) is resolved.
