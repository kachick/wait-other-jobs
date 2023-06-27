#!/usr/bin/env bash

whoami && id && cat /etc/passwd && ls -alh /nix && ls -alh . && \
  nix-shell --run 'direnv allow && makers setup'
