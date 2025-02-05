{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.11";
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
      formatter = forAllSystems (system: nixpkgs.legacyPackages.${system}.nixfmt-rfc-style);
      devShells = forAllSystems (
        system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
        in
        {
          default = pkgs.mkShellNoCC {
            # https://github.com/denoland/deno/issues/17916
            env.DENO_NO_PACKAGE_JSON = "1";
            buildInputs = (
              with pkgs;
              [
                # For Nix environments
                # https://github.com/NixOS/nix/issues/730#issuecomment-162323824
                bashInteractive
                nil
                nixfmt-rfc-style

                nodejs_20
                nodejs_20.pkgs.pnpm
                esbuild
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
                gitleaks
              ]
            );
          };
        }
      );
    };
}
