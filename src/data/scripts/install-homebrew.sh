#!/bin/bash
# Install Homebrew itself if missing, then update

if command -v brew > /dev/null 2>&1; then
	echo "✔ Homebrew already installed"
else
	/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

	# The installer doesn't modify this script's PATH, so put brew on it before
	# calling it (Apple Silicon installs to /opt/homebrew, Intel to /usr/local)
	if [ -x /opt/homebrew/bin/brew ]; then
		eval "$(/opt/homebrew/bin/brew shellenv)"
	elif [ -x /usr/local/bin/brew ]; then
		eval "$(/usr/local/bin/brew shellenv)"
	fi

	brew update
	echo "✔ Homebrew installed and updated"
fi
