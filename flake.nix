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
              sd

              edge-pkgs.nodejs_20
              edge-pkgs.nodejs_20.pkgs.pnpm
              edge-pkgs.deno
              edge-pkgs.dprint
              edge-pkgs.typos

              # Helper for writing and linting actions
              edge-pkgs.actionlint
              edge-pkgs.pinact

              # For fighting the GitHub API
              gh
              jq
              edge-pkgs.jnv
            ];
          };

        apps = {
          bump-nix-dependencies = {
            type = "app";
            program = with pkgs; lib.getExe (writeShellApplication {
              name = "bump-nix-dependencies.bash";
              runtimeInputs = [ nix git sd edge-pkgs.nodejs_20 edge-pkgs.nodejs_20.pkgs.pnpm ];
              # Why --really-refresh?: https://stackoverflow.com/q/34807971
              text = ''
                set -x

                nix run github:kachick/selfup/v0.0.2 -- run --prefix='# selfup ' --skip-by='nix run' .github/ISSUE_TEMPLATE/*.yml && git add .github
                git update-index -q --really-refresh
                git diff-index --quiet HEAD || git commit -m 'Update latest versions in issue template' .github

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
      });
}
