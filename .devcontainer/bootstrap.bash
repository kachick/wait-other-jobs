#!/usr/bin/env bash

nix-shell --run 'direnv allow && makers setup' && zsh
