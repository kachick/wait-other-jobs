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

### Devcontainer/Docker

You can use Devcontainer or the Docker to skip installing Nix on your local machine.

[![Open in Dev Containers](https://img.shields.io/static/v1?label=Dev%20Containers&message=Open&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/kachick/vwait-other-jobs) 🚶

Simulate devcontainer from docker as following.

```console
> ./.devcontainer/docker_build.bash
...
> ./.devcontainer/docker_shell.bash
vscode ➜ /workspaces/wait-other-jobs (main) $ makers check
...Done in...
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
