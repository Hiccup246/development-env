#!/bin/zsh
# Install Homebrew itself if missing, then update

if command -v brew >/dev/null 2>&1; then
	echo "✔ Homebrew already installed"
else
	/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
	brew update
	echo "✔ Homebrew installed and updated"
fi
