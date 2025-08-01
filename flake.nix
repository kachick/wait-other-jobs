{
  inputs = {
    # Avoid using the unstable channel until issue GH-998 is resolved.
    # Using it may cause issues GH-1106 and GH-749.
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.05";
  };

  outputs =
    {
      self,
      nixpkgs,
    }:
    let
      forAllSystems = nixpkgs.lib.genAttrs [
        "x86_64-linux"
        "aarch64-linux"
      ];
    in
    {
      formatter = forAllSystems (system: nixpkgs.legacyPackages.${system}.nixfmt-tree);
      devShells = forAllSystems (
        system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
        in
        {
          default = pkgs.mkShellNoCC {
            env = {
              # https://github.com/denoland/deno/issues/17916
              DENO_NO_PACKAGE_JSON = "1";

              # Correct nixd inlay hints
              NIX_PATH = "nixpkgs=${nixpkgs.outPath}";

              # NixOS cannot run external pre-built CLI by default
              RECHECK_BACKEND = "pure";
              RECHECK_SYNC_BACKEND = "pure";
            };

            buildInputs = (
              with pkgs;
              [
                # For Nix environments
                # https://github.com/NixOS/nix/issues/730#issuecomment-162323824
                bashInteractive
                nixd
                nixfmt-rfc-style

                nodejs_20
                nodejs_20.pkgs.pnpm
                deno
                dprint
                typos

                # NOTE: Do NOT add actionlint as a dependency
                # - It does not target actions; it lints the user's side.
                # - It assumes major actions in a stable state, often causing problems between versions.
                # - Use https://github.com/github/vscode-github-actions for a better solution to get hints.

                # For fighting the GitHub API
                gh
                jq
                yq-go
                gitleaks
                act
              ]
            );
          };
        }
      );
    };
}
