#!/usr/bin/env bash

echo 'eval "$(nix develop --command direnv hook bash)"' >> ~/.bashrc
echo 'eval "$(nix develop --command direnv hook zsh)"' >> ~/.zshrc
