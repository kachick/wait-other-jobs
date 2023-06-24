FROM nixos/nix

WORKDIR /wait-other-jobs/build
COPY default.nix default.nix
RUN nix-channel --update
RUN nix-build
