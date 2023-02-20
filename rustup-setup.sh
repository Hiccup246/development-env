#!/bin/zsh
# Install and initialize rustup

read -q "?Do you want to install Rust using rustup? [y/n]"
if ((!$?)); then
	rustup-init
fi
