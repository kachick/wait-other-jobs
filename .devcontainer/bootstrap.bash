#!/usr/bin/env bash

whoami && id && ls -alh /nix && ls -alh . && \
  nix develop --command direnv allow && nix develop
