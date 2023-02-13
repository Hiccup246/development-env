#!/bin/zsh
# Install programming languages using asdf

# Add .asdfrc to user home directory
cp .asdfrc ~/

# https://github.com/asdf-community/asdf-python
# Prerequisites
brew install openssl readline sqlite3 xz zlib tcl-tk
# Plugin installation
asdf plugin-add python
asdf global python latest

# https://github.com/asdf-vm/asdf-nodejs
# Prerequisites
# - Xcode command line tools
# Plugin installation
asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git
asdf global nodejs latest

# https://github.com/asdf-vm/asdf-ruby
# Prerequisites
# - Xcode command line tools
# Plugin installation
asdf plugin add ruby https://github.com/asdf-vm/asdf-ruby.git
asdf global ruby latest

# https://github.com/halcyon/asdf-java
# Prerequisites
brew install unzip
brew install jq
# Plugin installation
asdf plugin-add java https://github.com/halcyon/asdf-java.git
asdf global java latest

# https://github.com/asdf-community/asdf-clojure
# Prerequisites
# - curl (already installed by homebrew)
# - git (already installed by homebrew)
# - Java (already installed in this file)
brew install rlwrap
# Plugin installation
asdf plugin add clojure https://github.com/asdf-community/asdf-clojure.git
asdf global clojure latest

# https://github.com/asdf-community/asdf-rust
# Prerequisites
# - None
# Plugin installation
asdf plugin-add rust https://github.com/asdf-community/asdf-rust.git
asdf global rust latest

# https://github.com/asdf-community/asdf-deno
# Prerequisites
# - curl (already installed by homebrew)
# - git (already installed by homebrew)
# - unzip (already installed in this file)
# - gunzip (i am ignoring this dependancy)
# Plugin installation
asdf plugin-add deno https://github.com/asdf-community/asdf-deno.git
asdf global deno latest

# https://github.com/asdf-community/asdf-direnv
# Prerequisites
# - curl (already installed by homebrew)
# - git (already installed by homebrew)
# Plugin installation
asdf plugin-add direnv
asdf direnv setup --shell zsh --version latest

echo "✔ Asdf and programming languages installed"