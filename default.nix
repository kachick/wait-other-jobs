{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/21061e4e4a0f46a6f487c7583be916e4e031ee4e.tar.gz") { } }:

pkgs.mkShell {
  buildInputs = [
    pkgs.direnv
    pkgs.nodejs-16_x
    pkgs.dprint
    pkgs.cargo-make
    pkgs.nil
    pkgs.nixpkgs-fmt
    pkgs.typos
    pkgs.actionlint
    pkgs.hadolint
  ];
}
