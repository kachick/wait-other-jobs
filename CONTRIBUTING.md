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

```typescript
npm run repl

Welcome to Node.js v20.5.1.
Type ".help" for more information.

> // You can use `import()` function, not `import statement`.
> const { info, isDebug, debug } = await import('@actions/core');
> isDebug()
false

> // Utils can be loaded
> const { readableDuration } = await import('./src/wait.ts');
> readableDuration(4200)
'about 4 seconds'
```
