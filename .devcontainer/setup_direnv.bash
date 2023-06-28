#!/usr/bin/env bash

echo 'eval "$(nix-shell --run '"'"'direnv hook bash'"'"')"' >> ~/.bashrc
echo 'eval "$(nix-shell --run '"'"'direnv hook zsh'"'"')"' >> ~/.zshrc
