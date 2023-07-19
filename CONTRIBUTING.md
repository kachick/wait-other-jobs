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
> ./.devcontainer/docker_shell.bash
vscode ➜ /workspaces/wait-other-job (main) $ 
vscode ➜ /workspaces/wait-other-job (main) $ makers check
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

## Why using nodejs16 instead of deno/bun/nodejs18?

They are not yet supported in JavaScript action engine.

- https://github.com/actions/runner/blob/5421fe3f7107f770c904ed4c7e506ae7a5cde2c2/src/Runner.Worker/ActionManifestManager.cs#L492
- https://github.com/kachick/wait-other-jobs/pull/273#issuecomment-1306058624

After bumped to nodejs18, I'd like to replace jest with [built-in test runner](https://github.com/nodejs/node/pull/42325).
