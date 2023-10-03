{
  inputs = {
    # Candidate channels
    #   - https://github.com/kachick/anylang-template/issues/17
    #   - https://discourse.nixos.org/t/differences-between-nix-channels/13998
    # How to update the revision
    #   - `nix flake update --commit-lock-file` # https://nixos.org/manual/nix/stable/command-ref/new-cli/nix3-flake-update.html
    nixpkgs-unstable.url = "github:NixOS/nixpkgs/nixos-unstable";
    nixpkgs-stable.url = "github:NixOS/nixpkgs/release-23.05";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs-unstable, nixpkgs-stable, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        unstable-pkgs = nixpkgs-unstable.legacyPackages.${system};
        stable-pkgs = nixpkgs-stable.legacyPackages.${system};
      in
      {
        devShells.default = with unstable-pkgs;
          mkShell {
            buildInputs = [
              # https://github.com/NixOS/nix/issues/730#issuecomment-162323824
              bashInteractive

              nodejs_20
              deno
              dprint
              cargo-make
              nil
              nixpkgs-fmt
              typos
              actionlint

              gh
              jq

              # Avoided broken hadolint in latest
              # https://github.com/NixOS/nixpkgs/pull/240387#issuecomment-1686601267
              stable-pkgs.hadolint
            ];
          };
      });
}
