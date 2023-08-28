#!/usr/bin/env bash

set -euxo pipefail
shopt -s globstar

node --loader tsx --no-warnings --test ./src/**/*.test.ts
