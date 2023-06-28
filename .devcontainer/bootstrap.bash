#!/usr/bin/env bash

whoami && id && ls -alh /nix && ls -alh . && \
  nix-shell --run 'direnv allow && makers setup'
