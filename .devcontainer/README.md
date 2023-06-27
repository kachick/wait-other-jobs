## How to update path for each extentions of devcontainer.json?

Like this.

```console
nix-instantiate --eval -E '(import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/4ef0dd85324fca49bf06fd9f2d52711503b1128c.tar.gz") {}).pkgs.dprint.outPath' | tr -d '"'
```

You should update them after updating fetchTarball path in default.nix

I want to realize better integration, but I don't know it.
