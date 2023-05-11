{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/4ef0dd85324fca49bf06fd9f2d52711503b1128c.tar.gz") { } }:

pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs-16_x
    pkgs.dprint
    pkgs.cargo-make
    pkgs.nil
    pkgs.nixpkgs-fmt
  ];
}
