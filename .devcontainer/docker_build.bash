#!/usr/bin/env bash

docker build . --tag wait-other-jobs:latest --build-arg container_user_uid="$(stat -c '%u' .)" --build-arg container_user_gid="$(stat -c '%g' .)" --file .devcontainer/Dockerfile
