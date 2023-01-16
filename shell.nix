{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/b77bbeca8ba3069eea82a3711242cdc2240cc7c9.tar.gz") {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs-16_x
    pkgs.dprint
  ];
}
