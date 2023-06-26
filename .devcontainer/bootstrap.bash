#!/usr/bin/env bash

whoami && ls -alh /nix && \
  mkdir -m 0755 -p /nix/var/nix/{profiles,gcroots}/per-user/vscode && \
  nix-shell --run 'direnv allow && makers setup' && \
  zsh
