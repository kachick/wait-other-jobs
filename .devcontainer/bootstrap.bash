#!/usr/bin/env bash

whoami && cat /etc/passwd && ls -alh /nix && \
  nix-shell --run 'direnv allow && makers setup' && \
  zsh
