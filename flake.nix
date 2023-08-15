{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/21061e4e4a0f46a6f487c7583be916e4e031ee4e";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        # https://discourse.nixos.org/t/mark-a-devshell-dependency-as-insecure/24354/3
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = with pkgs;
          mkShell {
            buildInputs = [
              nodejs_20
              deno
              dprint
              cargo-make
              nil
              nixpkgs-fmt
              typos
              actionlint
              hadolint
            ];
          };
      });
}
