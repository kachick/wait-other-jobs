{
  inputs = {
    # Candidate channels
    #   - https://github.com/kachick/anylang-template/issues/17
    #   - https://discourse.nixos.org/t/differences-between-nix-channels/13998
    # How to update the revision
    #   - `nix flake update --commit-lock-file` # https://nixos.org/manual/nix/stable/command-ref/new-cli/nix3-flake-update.html
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.05";
  };

  outputs =
    { self, nixpkgs }:
    let
      # Candidates: https://github.com/NixOS/nixpkgs/blob/release-23.11/lib/systems/flake-systems.nix
      forAllSystems = nixpkgs.lib.genAttrs [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        # I don't have M1+ mac, providing this for macos-14 free runner https://github.com/actions/runner-images/issues/9741
        "aarch64-darwin"
      ];
    in
    {
      formatter = forAllSystems (system: nixpkgs.legacyPackages.${system}.nixfmt-rfc-style);
      devShells = forAllSystems (
        system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
        in
        {
          default =
            with pkgs;
            mkShell {
              buildInputs = [
                # For Nix environments
                # https://github.com/NixOS/nix/issues/730#issuecomment-162323824
                bashInteractive
                nil
                nixfmt-rfc-style

                cargo-make
                sd

                nodejs_20
                nodejs_20.pkgs.pnpm
                deno
                dprint
                typos
                yamlfmt

                # Helper for writing and linting actions
                #
                # NOTE: Do NOT add actionlint as a dependency
                # - It does not target actions; it lints the user's side.
                # - It assumes major actions in a stable state, often causing problems between versions.
                # - Use https://github.com/github/vscode-github-actions for a better solution to get hints.
                pinact

                # For fighting the GitHub API
                gh
                jq
                jnv
                gitleaks
              ];
            };
        }
      );

      apps = forAllSystems (
        system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
        in
        {
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
                  nodejs_20
                  nodejs_20.pkgs.pnpm
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
        }
      );
    };
}
