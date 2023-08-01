#!/bin/zsh
# Configuration for zsh shell based on zsh shell config found in .zshrc

# Add homebrew zsh (as oppose to system zsh) to list of viable shells
sudo sh -c 'echo /usr/local/bin/zsh >> /etc/shells'

# Suppress prompt startup message of "Last login: Sat Feb 11 17:37:09 on ttys003"
touch ~/.hushlogin

# Install oh-my-zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Install zsh-autosuggestions plugin
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

# Install zsh-syntax-highlighting plugin
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

# Install zsh-completions
git clone https://github.com/zsh-users/zsh-completions ${ZSH_CUSTOM:-${ZSH:-~/.oh-my-zsh}/custom}/plugins/zsh-completions

# Install powerline fonts to make agnoster theme work correctly
git clone https://github.com/powerline/fonts.git --depth=1
cd fonts
./install.sh
cd ..
rm -rf fonts

echo "Setting shell to zsh..."
chsh -s /bin/zsh

# Add .zshrc to user home directory
cp .zshrc ~/

echo "✔ Zsh shell installed and configured"
