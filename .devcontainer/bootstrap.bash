#!/usr/bin/env bash

whoami && id && ls -alh /nix && ls -alh . && \
  nix develop --command direnv allow

if ! (echo "$CI" | grep --silent -F true); then
  nix develop
fi
