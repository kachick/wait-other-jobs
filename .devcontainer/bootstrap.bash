#!/usr/bin/env bash

whoami && id && \
  nix develop --command direnv allow
