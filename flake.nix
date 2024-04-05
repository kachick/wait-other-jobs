{
  inputs = {
    # Candidate channels
    #   - https://github.com/kachick/anylang-template/issues/17
    #   - https://discourse.nixos.org/t/differences-between-nix-channels/13998
    # How to update the revision
    #   - `nix flake update --commit-lock-file` # https://nixos.org/manual/nix/stable/command-ref/new-cli/nix3-flake-update.html
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-23.11";
    edge-nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, edge-nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        edge-pkgs = edge-nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = with pkgs;
          mkShell {
            buildInputs = [
              # For Nix environments
              # https://github.com/NixOS/nix/issues/730#issuecomment-162323824
              bashInteractive
              nil
              nixpkgs-fmt

              cargo-make

              edge-pkgs.nodejs_20
              edge-pkgs.deno
              edge-pkgs.dprint
              edge-pkgs.typos
              edge-pkgs.actionlint

              # For fighting the GitHub API
              gh
              jq
            ];
          };
      });
}
