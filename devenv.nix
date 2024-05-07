{ pkgs, lib, config, inputs, ... }:

{
  languages.javascript = {
    enable = true;
    pnpm = {
      enable = true;
      install.enable = true;
    };
  };
  languages.rust.enable = true;
}
