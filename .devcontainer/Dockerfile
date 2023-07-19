# Do not use `FROM nixos/nix`. It cannot use `groupadd` even not the NixOS
# See https://stackoverflow.com/questions/75653182/why-do-some-official-nix-docker-containers-not-have-the-nixos-rebuild-command
FROM mcr.microsoft.com/devcontainers/base:ubuntu-22.04

# Above microsoft image contains to create vscode user

# Use same UID/GID to avoid mount and nix path permission issues
ARG container_user_uid
ARG container_user_gid
RUN usermod -u $container_user_uid vscode && groupmod -g $container_user_gid vscode

# Switching the user should be after the changed IDs
USER vscode

# This just uses for following build steps.
# vscode will set the WORKDIR into `/workspaces/wait-other-job`
WORKDIR /home/vscode/sandbox

# The install scripts will be syntax error if it will be eval with dash
SHELL ["/bin/bash", "-c"]

# daemon mode required systemd, docker disables it
# As I understand the definition https://hub.docker.com/r/nixos/nix/dockerfile at Nix 2.17, it looks like a single user installation(no-daemon)
# See https://github.com/NixOS/nix/blob/fd4f03b8fdcb0f33552730c786139019e29f5dbe/scripts/install-nix-from-closure.sh#L129-L139
RUN bash <(curl -L https://nixos.org/nix/install) --no-daemon --yes

ENV PATH /home/vscode/.nix-profile/bin:$PATH

# Basically do NOT merge files in COPY to prefer inline cache benefit

# Make sure the building phase done. To cache. `nix-build --no-out-link` does similar, but it skips bash.
# NOTE: This does not mean the entry point is in nix-shell.
COPY ["../default.nix", "./"]

# Do no include like `npm install` here. Currently I don't cache it in container
RUN nix-channel --update && nix-shell --run 'echo "Keep this line to build nix environment in this phase"'

COPY ["./.devcontainer/setup_direnv.bash", "./"]
RUN ./setup_direnv.bash

# Clean up to avoid confusion
# hadolint ignore=DL3059
RUN rm ./default.nix ./setup_direnv.bash

# `ENTRYPOINT` and `CMD` will be ignored in .devcontainer. Use postCreateCommand instead
# To simulate in docker, following CMD requires to specify PWD with repository files. Check `makers docker-shell`
ENTRYPOINT ["./.devcontainer/bootstrap.bash"]
CMD ["zsh"]
