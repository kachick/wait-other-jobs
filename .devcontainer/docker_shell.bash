#!/usr/bin/env bash

docker run --interactive --tty --rm --volume "$(pwd):/workspaces/wait-other-jobs" --workdir "/workspaces/wait-other-jobs" wait-other-jobs:latest
