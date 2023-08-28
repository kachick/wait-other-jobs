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
        # https://discourse.nixos.org/t/mark-a-devshell-dependency-as-insecure/24354/3
        unstable-pkgs = import nixpkgs-unstable
          {
            inherit system;
            config = {
              permittedInsecurePackages = [
                "nodejs-16.20.2"
              ];
            };
          };
        stable-pkgs = nixpkgs-stable.legacyPackages.${system};
      in
      {
        devShells.default = with unstable-pkgs;
          mkShell {
            buildInputs = [
              # https://github.com/NixOS/nix/issues/730#issuecomment-162323824
              bashInteractive

              nodejs-16_x
              deno
              dprint
              cargo-make
              nil
              nixpkgs-fmt
              typos
              actionlint
              stable-pkgs.hadolint
            ];
          };
      });
}
