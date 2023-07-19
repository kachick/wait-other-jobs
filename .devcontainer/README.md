## How to update path for each extensions of devcontainer.json?

Like this.

```console
> makers deps
v16.20.1
nix (Nix) 2.15.1
cargo-make 0.36.11
dprint 0.37.1
1.6.25
installed by building from source
built with go1.20.5 compiler for linux/amd64
Haskell Dockerfile Linter 2.12.0
typos-cli 1.16.1
```

You should update them after updating fetchTarball path in flake.nix

I want to realize better integration, but I don't know it.
