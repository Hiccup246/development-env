#!/bin/zsh
# Run all development environment scripts for mac
# - native applications for development
# - run homebrew-setup
# - run appstore-setup scripts
# - run git setup
# - run bash setup
# - run zsh setup
# - run asdf setup
# - run rustup setup
# - run vscode setup

echo "Beginning mac setup..."

# Enable safari developer settings
defaults write com.apple.Safari IncludeInternalDebugMenu -bool true
defaults write com.apple.Safari IncludeDevelopMenu -bool true
defaults write com.apple.Safari WebKitDeveloperExtrasEnabledPreferenceKey -bool true
defaults write com.apple.Safari com.apple.Safari.ContentPageGroupIdentifier.WebKit2DeveloperExtrasEnabled -bool true
defaults write NSGlobalDomain WebKitDeveloperExtras -bool true
echo "✔ Safari configuration for development complete"

# Configure finder view settings
defaults write com.apple.finder ShowStatusBar -bool true
defaults write com.apple.finder ShowPathbar -bool true
echo "✔ Finder configuration for development complete"

# Unhide library folder
chflags nohidden ~/Library

# Do not add recent apps to dock
defaults write com.apple.dock show-recents -bool FALSE

echo "✔ Apple doc and directory configuration complete"

# Install Xcode command line tools
if hash xcode-select; then
	echo "You already have Xcode command line tools installed."
else
	echo "Installing Xcode command line tools..."
	xcode-select —-install
	echo "✔ Xcode install complete"
fi

echo ""
echo "✔ Mac setup complete"
