{
  inputs = {
    nixpkgs.url = "github:cachix/devenv-nixpkgs/rolling";
    systems.url = "github:nix-systems/default";
    devenv.url = "github:cachix/devenv";
    devenv.inputs.nixpkgs.follows = "nixpkgs";
  };

  nixConfig = {
    extra-trusted-public-keys = "devenv.cachix.org-1:w1cLUi8dv3hnoSPGAuibQv+f9TZLr6cv/Hm9XgU50cw=";
    extra-substituters = "https://devenv.cachix.org";
  };

  outputs = { self, nixpkgs, devenv, systems, ... } @ inputs:
    let
      forEachSystem = nixpkgs.lib.genAttrs (import systems);
    in
    {
      packages = forEachSystem (system: {
        devenv-up = self.devShells.${system}.default.config.procfileScript;
      });

      devShells = forEachSystem
        (system:
          let
            pkgs = nixpkgs.legacyPackages.${system};
            frameworks = pkgs.darwin.apple_sdk.frameworks;
          in
          {
            default = devenv.lib.mkShell {
              inherit inputs pkgs;
              modules = [
                ({ pkgs, config, lib, ... }: {
                  languages.javascript = {
                    enable = true;
                    pnpm = {
                      enable = true;
                      install.enable = true;
                    };
                  };
                  languages.rust.enable = true;
                  packages = with pkgs; [
                    gcc
                  ] ++ lib.optionals pkgs.stdenv.isDarwin [
                    # https://discourse.nixos.org/t/compile-bevy-with-nix-developer-environment-on-macos/31512/3
                    darwin.libobjc
                    darwin.libiconv
                    frameworks.Security
                    frameworks.CoreServices
                    frameworks.CoreFoundation
                    frameworks.AppKit
                    frameworks.Foundation
                    frameworks.ApplicationServices
                    frameworks.CoreGraphics
                    frameworks.CoreVideo
                    frameworks.Carbon
                    frameworks.IOKit
                    frameworks.CoreAudio
                    frameworks.AudioUnit
                    frameworks.QuartzCore
                    frameworks.Metal
                    frameworks.WebKit
                  ];
                  env.CFLAGS = lib.mkForce (if pkgs.stdenv.isDarwin then "-I${pkgs.darwin.libobjc}/include/" else "");
                })
              ];
            };
          }
        );
    };
}
