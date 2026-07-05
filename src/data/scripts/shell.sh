#!/bin/bash
# Configure shells: oh-my-zsh, plugins, default shell
# No sudo needed: /bin/zsh has been the macOS default since Catalina (2019) and is
# already listed in /etc/shells, which is the only shell chsh targets below.

touch ~/.hushlogin
echo "✔ Suppressed login message"

if [ -d "$HOME/.oh-my-zsh" ]; then
	echo "✔ oh-my-zsh already installed"
else
	# RUNZSH/CHSH disabled so the installer doesn't spawn a nested shell or prompt
	# interactively; KEEP_ZSHRC leaves ~/.zshrc for the dotfiles task to own.
	RUNZSH=no CHSH=no KEEP_ZSHRC=yes sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
fi

ZSH_CUSTOM_DIR="${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}"

clone_plugin_if_missing() {
	local name="$1" url="$2"
	local dir="${ZSH_CUSTOM_DIR}/plugins/${name}"
	if [ -d "$dir" ]; then
		echo "✔ ${name} already installed"
	else
		git clone "$url" "$dir"
	fi
}

clone_plugin_if_missing "zsh-autosuggestions" "https://github.com/zsh-users/zsh-autosuggestions"
clone_plugin_if_missing "zsh-syntax-highlighting" "https://github.com/zsh-users/zsh-syntax-highlighting.git"
clone_plugin_if_missing "zsh-completions" "https://github.com/zsh-users/zsh-completions"

chsh -s /bin/zsh
echo "✔ Shell configuration complete"
