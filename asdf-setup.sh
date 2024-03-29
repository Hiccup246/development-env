#!/bin/zsh
# Install programming languages using asdf

echo "===Welcome to ASDF program installation==="
echo "Available program/run times are:"
echo "- Python"
echo "- Node.js"
echo "- Ruby"
echo "- Java"
echo "- Clojure"
echo "- Deno"
echo "- Go"

install_python() {
	echo "Installing Python..."

	# https://github.com/asdf-community/asdf-python
	# Prerequisites
	brew install openssl readline sqlite3 xz zlib tcl-tk
	# Plugin installation
	asdf plugin-add python
	asdf install python latest
	asdf global python latest

	echo "✔ Python installed"
}

install_node() {
	echo "Installing Node.js..."

	# https://github.com/asdf-vm/asdf-nodejs
	# Prerequisites
	# - Xcode command line tools
	# Plugin installation
	asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git
	asdf install nodejs latest
	asdf global nodejs latest

	echo "✔ Node.js installed"
}

install_ruby() {
	echo "Installing Ruby..."

	# https://github.com/asdf-vm/asdf-ruby
	# Prerequisites
	# - Xcode command line tools
	# Plugin installation
	asdf plugin add ruby https://github.com/asdf-vm/asdf-ruby.git
	asdf install ruby latest
	asdf global ruby latest

	echo "✔ Ruby installed"
}

install_java() {
	echo "Installing Java..."

	# https://github.com/halcyon/asdf-java
	# Prerequisites
	brew install unzip
	brew install jq
	# Plugin installation
	asdf plugin-add java https://github.com/halcyon/asdf-java.git
	asdf install java latest
	asdf global java latest

	echo "✔ Java installed"
}

install_clojure() {
	echo "Installing Clojure..."

	# https://github.com/asdf-community/asdf-clojure
	# Prerequisites
	# - curl (already installed by homebrew)
	# - git (already installed by homebrew)
	# - Java
	install_java
	brew install rlwrap
	# Plugin installation
	asdf plugin add clojure https://github.com/asdf-community/asdf-clojure.git
	asdf install clojure latest
	asdf global clojure latest

	echo "✔ Clojure installed"
}

install_deno() {
	echo "Installing Deno..."

	# https://github.com/asdf-community/asdf-deno
	# Prerequisites
	# - curl (already installed by homebrew)
	# - git (already installed by homebrew)
	# - unzip (already installed in this file)
	# - gunzip (i am ignoring this dependancy)
	# Plugin installation
	asdf plugin-add deno https://github.com/asdf-community/asdf-deno.git
	asdf install deno latest
	asdf global deno latest

	echo "✔ Deno installed"
}

install_go() {
	# https://github.com/kennyp/asdf-golang
	# Prerequisites
	brew install coreutils
	# Plugin installation
	asdf plugin-add golang https://github.com/kennyp/asdf-golang.git
	asdf install golang latest
	asdf global golang latest

	echo "✔ Go installed"
}

install_direnv() {
	echo "Installing direnv for environment loading..."

	# https://github.com/asdf-community/asdf-direnv
	# Prerequisites
	# - curl (already installed by homebrew)
	# - git (already installed by homebrew)
	# Plugin installation
	asdf plugin-add direnv
	asdf direnv setup --shell zsh --version latest

	echo "✔ Direnv installed"
}

pick_programs_to_install() {
	programs_to_install=()

	read -q "?Do you want to install Python? [y/n]"
	if ((!$?)); then
		programs_to_install+=install_python
	fi

	echo ""

	read -q "?Do you want to install Node.js? [y/n]"
	if ((!$?)); then
		programs_to_install+=install_node
	fi

	echo ""

	read -q "?Do you want to install Ruby? [y/n]"
	if ((!$?)); then
		programs_to_install+=install_ruby
	fi

	echo ""

	read -q "?Do you want to install Java? [y/n]"
	if ((!$?)); then
		programs_to_install+=install_java
	fi

	echo ""

	read -q "?Do you want to install Clojure? [y/n]"
	if ((!$?)); then
		programs_to_install+=install_clojure
	fi

	echo ""

	read -q "?Do you want to install Deno? [y/n]"
	if ((!$?)); then
		programs_to_install+=install_deno
	fi

	echo ""

	read -q "?Do you want to install Go? [y/n]"
	if ((!$?)); then
		programs_to_install+=install_go
	fi

	echo ""

	install_direnv

	for program in "${programs_to_install[@]}"; do
		$program
	done
}

# Add .asdfrc to user home directory
cp .asdfrc ~/

# Add .tool-versions to user home directory
cp .tool-versions ~/

# Program installation menu
read -q "install_everything? Do you want to install everything? [y/n]"
answer=$?

echo ""

if (($answer)); then
	pick_programs_to_install
else
	install_direnv
	install_python
	install_node
	install_ruby
	install_java
	install_clojure
	install_deno
	install_go
fi

echo ""
echo "✔ Programming language setup complete"
