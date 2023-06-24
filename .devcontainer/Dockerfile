# Do not use `FROM nixos/nix`. It cannot use `groupadd` even not the NixOS
# See https://stackoverflow.com/questions/75653182/why-do-some-official-nix-docker-containers-not-have-the-nixos-rebuild-command
FROM mcr.microsoft.com/devcontainers/base:ubuntu

# Above microsoft image includes this user
USER vscode

WORKDIR /home/vscode/sandbox

# The install scripts will be syntax error if it will be eval with dash
SHELL ["/bin/bash", "-c"]

# daemon mode required systemd, docker disables it
# As I understand the definition https://hub.docker.com/r/nixos/nix/dockerfile at Nix 2.17, it looks like a single user installation(no-daemon)
# See https://github.com/NixOS/nix/blob/fd4f03b8fdcb0f33552730c786139019e29f5dbe/scripts/install-nix-from-closure.sh#L129-L139
RUN bash <(curl -L https://nixos.org/nix/install) --no-daemon --yes

ENV PATH /home/vscode/.nix-profile/bin:$PATH

# Make sure the building phase done. To cache. `nix-build --no-out-link` does similar, but it skips bash.
# NOTE: This does not mean the entry point is in nix-shell.
COPY ["../default.nix", "../Makefile.toml", "../package.json", "../package-lock.json", "./"]

# Do no include like `npm install` here. Cuurently I don't cache it in container
RUN nix-channel --update && nix-shell --run 'echo "Welcome to this project :)"'
COPY ["../.envrc", "./"]
RUN nix-shell --run 'direnv allow'
COPY ["./.devcontainer/bootstrap.bash", "./"]
RUN ./bootstrap.bash

# This can be skipped if you specify `docker run -it wait-other-jobs:ubuntu bash`. Also skipped in devcontainer, Use postCreateCommand instead.
# CMD nix-shell --command zsh
