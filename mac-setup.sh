#!/bin/zsh
# Configure mac native applications for development + run homebrew-setup and appstore-setup scripts

# Enable safari developer settings
defaults write com.apple.Safari IncludeInternalDebugMenu -bool true
defaults write com.apple.Safari IncludeDevelopMenu -bool true
defaults write com.apple.Safari WebKitDeveloperExtrasEnabledPreferenceKey -bool true
defaults write com.apple.Safari com.apple.Safari.ContentPageGroupIdentifier.WebKit2DeveloperExtrasEnabled -bool true
defaults write NSGlobalDomain WebKitDeveloperExtras -bool true

# Configure finder view settings
defaults write com.apple.finder ShowStatusBar -bool true
defaults write com.apple.finder ShowPathbar -bool true

# Unhide library folder
chflags nohidden ~/Library

# Do not add recent apps to dock
defaults write com.apple.dock show-recents -bool FALSE

# Install Xcode command line tools
if hash xcode-select; then
    echo "You already have Xcode command line tools installed."
else
    xcode-select —-install
fi

# Install homebrew + install applications + GUI applications
chmod +x homebrew-setup.sh && ./homebrew-setup.sh

# Install appstore applications
chmod +x appstore-setup.sh && ./appstore-setup.sh
