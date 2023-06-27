#!/usr/bin/env bash

docker run --interactive --tty --rm --volume "$(pwd):/workspaces/wait-other-job" --workdir "/workspaces/wait-other-job" wait-other-jobs:latest
