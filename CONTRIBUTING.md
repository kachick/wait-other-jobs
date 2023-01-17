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
