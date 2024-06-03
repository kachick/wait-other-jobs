# How to develop

## Setup

### Nix

1. Install [Nix](https://nixos.org/) package manager
2. Run `nix develop` or `direnv allow`
3. You can use development tasks

```console
> nix develop
(prepared shell)
```

### Tasks

```console
> makers help
> Tools

---

check - ...
help - ...

> makers setup
added 438 packages, and audited 439 packages in 6s

> makers check
...tests, typechecks, linters...
```

See also [scripts](package.json) for tasks details.

## REPL

```bash
pnpm run repl
```

```typescript
Welcome to Node.js v20.12.2.
Type ".help" for more information.
>

> // You can use `import()` function, not `import statement`.
> const { Temporal } = await import('temporal-polyfill')
> Temporal.Duration.from({seconds: 500}).round({ largestUnit: 'minutes' }).toString()
'PT8M20S'

> // exported methods in this repository also can be loaded
> const { readableDuration } = await import('./src/report.ts');
> readableDuration(Temporal.Duration.from({seconds: 500}))
'about 8 minutes 20 seconds'
```
