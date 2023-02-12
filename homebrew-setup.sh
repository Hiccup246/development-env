#!/bin/zsh
# Install homebrew and all packages

# Install homebrew package manager
if hash brew; then
    echo "You already have brew installed."
else
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    brew update
fi

# Install command line programs
# Command line utilities
brew install curl
brew install wget

# Install shells
brew install bash
brew install zsh

# Code repostiry
brew instsall git

# Package managers
brew install pnpm
brew install npm
brew install pip

# Run time environments
brew install deno
brew install node

# GUI Application installer
brew install mas

# Version managers
brew install asdf

# Programming languages
brew install ruby
brew install python
brew install node
brew install clojure/tools/clojure
brew install deno
brew install python

# Rust setup
brew install rustup
rustup-init


# Optional installations
brew install railway

# Install GUI applications
# --appdir="/Applications" installs applications for all users
# --appdir="~/Applications" installs applications for the current user

brew install --cask --appdir="/Applications" spotify
brew install --cask --appdir="/Applications" discord
brew install --cask --appdir="/Applications" visual-studio-code
brew install --cask --appdir="/Applications" google-chrome
brew install --cask --appdir="/Applications" discord
brew install --cask --appdir="/Applications" postman
brew install --cask --appdir="/Applications" firefox
brew install --cask --appdir="/Applications" docker

if [[ ! -d /Applications/iTerm.app ]]; then
    brew install --cask --appdir="/Applications" iterm2
else
    echo "You already have iTerm2 installed."
fi
