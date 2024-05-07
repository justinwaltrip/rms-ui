{ pkgs, lib, config, inputs, env, ... }:

let frameworks = pkgs.darwin.apple_sdk.frameworks; in
{
  languages.javascript = {
    enable = true;
    pnpm = {
      enable = true;
      install.enable = true;
    };
  };
  languages.rust.enable = true;
  # https://discourse.nixos.org/t/compile-bevy-with-nix-developer-environment-on-macos/31512/3
  packages = with pkgs; [
    gcc
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
  env.CFLAGS = lib.mkForce ("-I${pkgs.darwin.libobjc}/include/");
}
