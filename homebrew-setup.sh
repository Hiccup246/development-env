#!/bin/zsh
# Install homebrew and all packages

# Install homebrew package manager
if ! hash brew
then
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    brew update
else
    echo "You already have brew installed."
fi


# Install command line programs
# Command line utilities
brew install curl
brew install wget

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
brew install nvm
brew install asdf

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
