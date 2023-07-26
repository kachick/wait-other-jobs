{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/21061e4e4a0f46a6f487c7583be916e4e031ee4e";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        # https://discourse.nixos.org/t/mark-a-devshell-dependency-as-insecure/24354/3
        pkgs = import nixpkgs
          {
            inherit system;
            config = {
              permittedInsecurePackages = [
                "nodejs-16.20.1"
              ];
            };
          };
      in
      {
        devShells.default = with pkgs;
          mkShell {
            buildInputs = [
              nodejs-16_x
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
