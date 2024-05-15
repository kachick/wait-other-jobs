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

  outputs =
    {
      self,
      nixpkgs,
      edge-nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        edge-pkgs = edge-nixpkgs.legacyPackages.${system};
      in
      {
        formatter = edge-pkgs.nixfmt-rfc-style;
        devShells.default =
          with pkgs;
          mkShell {
            buildInputs = [
              # For Nix environments
              # https://github.com/NixOS/nix/issues/730#issuecomment-162323824
              bashInteractive
              nil
              edge-pkgs.nixfmt-rfc-style

              cargo-make
              sd

              edge-pkgs.nodejs_20
              edge-pkgs.nodejs_20.pkgs.pnpm
              edge-pkgs.deno
              edge-pkgs.dprint
              edge-pkgs.typos

              # Helper for writing and linting actions
              # NOTE: Do NOT add actionlint as a dependency
              #   * It does not targets actions, it lints user side
              #   * It assumes major actions in stable state, often made problems between versions
              #   * Better solution is hinting with https://github.com/github/vscode-github-actions
              edge-pkgs.pinact

              # For fighting the GitHub API
              gh
              jq
              edge-pkgs.jnv
              gitleaks
            ];
          };

        apps = {
          bump-nix-dependencies = {
            type = "app";
            program =
              with pkgs;
              lib.getExe (writeShellApplication {
                name = "bump-nix-dependencies.bash";
                runtimeInputs = [
                  nix
                  git
                  sd
                  edge-pkgs.nodejs_20
                  edge-pkgs.nodejs_20.pkgs.pnpm
                ];
                # Why --really-refresh?: https://stackoverflow.com/q/34807971
                text = ''
                  set -x

                  node --version | sd '^v?' "" > .node-version && git add .node-version
                  git update-index -q --really-refresh
                  git diff-index --quiet HEAD || git commit -m 'Sync .node-version with nixpkgs' .node-version

                  sd '("packageManager": "pnpm)@([0-9\.]+)' "\$1@$(pnpm --version)" package.json && git add package.json
                  git update-index -q --really-refresh
                  git diff-index --quiet HEAD || git commit -m 'Sync pnpm version with nixpkgs' package.json
                '';
                meta = {
                  description = "Bump dependency versions except managed by node package manager";
                };
              });
          };
        };
      }
    );
}
