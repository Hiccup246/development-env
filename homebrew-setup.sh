#!/bin/zsh

# Install homebrew package manager
if hash brew; then
	echo "You already have brew installed."
else
	/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
	brew update
	echo "✔ Homebrew installed and updated"
fi

# Install all home brew packages
xargs brew install < homebrew.txt

# Install GUI applications
# --appdir="/Applications" installs applications for all users
# --appdir="~/Applications" installs applications for the current user

read -q "?Do you want to install desktop GUI applications using homebrew? [y/n]"
if ((!$?)); then
	grep -e '^[^#]' homebrew-cask.txt | xargs brew install --cask --appdir="/Applications"
fi

echo ""
echo "✔ Homebrew packages installed"
