# How to develop

We can only use Node.js for JavaScript actions in GitHub Hosted runners.\
However, managing the Node.js toolset is a pain for me, so this repository prefers Deno for the development tasks.\
And finally, it transpiles and bundles into [dist](dist), which will be loaded in Node.js.

In short, [scripts](scripts) can only be adjusted for Deno.\
Other `*.ts` and `*.js` files should be considered for use with Node.js.

## Dependency management

It will be done in [Nix](https://nixos.org/) and [pnpm](https://github.com/pnpm/pnpm).

1. Run `nix develop` or `direnv allow .`
2. `deno task setup`

## Tasks

```console
> deno task
# Print all tasks

> deno task all
...tests, typechecks, linters, build
```

## REPL

```bash
deno task repl
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

## [act](https://github.com/nektos/act)

```bash
act --platform 'ubuntu-24.04=ghcr.io/catthehacker/ubuntu:full-24.04' --workflows .github/workflows/lint.yml
```
