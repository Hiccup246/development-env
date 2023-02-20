#!/bin/zsh
# Install homebrew and all packages

# Install homebrew package manager
if hash brew; then
	echo "You already have brew installed."
else
	/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
	brew update
	echo "✔ Homebrew installed and updated"
fi

# Install command line programs
# Shells
brew install zsh
brew install bash

# Command line utilities
brew install curl
brew install wget
brew install coreutils

# Code repostiry
brew install git

# Package managers
brew install pnpm
brew install npm

# GUI Application installer
brew install mas

# Version managers
brew install asdf
brew install rustup-init

# Optional installations
brew install railway

# Install GUI applications
# --appdir="/Applications" installs applications for all users
# --appdir="~/Applications" installs applications for the current user
brew install --cask --appdir="/Applications" spotify
brew install --cask --appdir="/Applications" discord
brew install --cask --appdir="/Applications" visual-studio-code
brew install --cask --appdir="/Applications" google-chrome
brew install --cask --appdir="/Applications" postman
brew install --cask --appdir="/Applications" firefox
brew install --cask --appdir="/Applications" docker

if [[ ! -d /Applications/iTerm.app ]]; then
	brew install --cask --appdir="/Applications" iterm2
else
	echo "You already have iTerm2 installed."
fi

echo "✔ Homebrew packages installed"
