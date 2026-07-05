#!/bin/bash
# Configure macOS defaults for development

# Safari developer settings
defaults write com.apple.Safari IncludeInternalDebugMenu -bool true
defaults write com.apple.Safari IncludeDevelopMenu -bool true
defaults write com.apple.Safari WebKitDeveloperExtrasEnabledPreferenceKey -bool true
defaults write com.apple.Safari com.apple.Safari.ContentPageGroupIdentifier.WebKit2DeveloperExtrasEnabled -bool true
defaults write NSGlobalDomain WebKitDeveloperExtras -bool true
echo "✔ Safari configuration for development complete"

# Finder view settings
defaults write com.apple.finder ShowStatusBar -bool true
defaults write com.apple.finder ShowPathbar -bool true
defaults write NSGlobalDomain AppleShowAllExtensions -bool true
defaults write com.apple.finder FXDefaultSearchScope -string "SCcf"
echo "✔ Finder configuration for development complete"

# Unhide library folder, disable dock recents
chflags nohidden ~/Library
defaults write com.apple.dock show-recents -bool FALSE
echo "✔ Dock and Library configuration complete"

# Xcode command line tools
if xcode-select -p > /dev/null 2>&1; then
	echo "✔ Xcode command line tools already installed"
else
	echo "Installing Xcode command line tools..."
	# --install only opens a GUI dialog and returns immediately; wait for the
	# actual install to finish so later tasks (Homebrew) don't race it
	xcode-select --install
	echo "Complete the Xcode command line tools dialog — waiting for it to finish..."
	until xcode-select -p > /dev/null 2>&1; do
		sleep 5
	done
	echo "✔ Xcode command line tools installed"
fi
