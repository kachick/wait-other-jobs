#!/usr/bin/env bash

whoami && ls -alh /nix && \
  nix-shell --run 'direnv allow && makers setup' && \
  zsh
