# If you come from bash you might have to change your $PATH.
# export PATH=$HOME/bin:/usr/local/bin:$PATH

# Path to your oh-my-zsh installation.
export ZSH="$HOME/.oh-my-zsh"

# Add Visual Studio Code (code)
export PATH="\$PATH:/Applications/Visual Studio Code.app/Contents/Resources/app/bin"

# Path to common utilities
export PATH=/bin:/usr/bin:/usr/local/bin:${PATH}

# Set name of the theme to load --- if set to "random", it will
# load a random theme each time oh-my-zsh is loaded, in which case,
# to know which specific one was loaded, run: echo $RANDOM_THEME
# See https://github.com/ohmyzsh/ohmyzsh/wiki/Themes
ZSH_THEME="agnoster"

# Uncomment the following line to use case-sensitive completion.
# CASE_SENSITIVE="true"

# Uncomment the following line to enable command auto-correction.
# ENABLE_CORRECTION="true"

# Source homebrew
eval "$(/opt/homebrew/bin/brew shellenv)"

# Homebrew completions https://docs.brew.sh/Shell-Completion#configuring-completions-in-bash
FPATH="$(brew --prefix)/share/zsh/site-functions:${FPATH}"

# Which plugins would you like to load?
# Standard plugins can be found in $ZSH/plugins/
# Custom plugins may be added to $ZSH_CUSTOM/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
# Add wisely, as too many plugins slow down shell startup.
# zsh-syntax-highlighting must come at the end
plugins=(git asdf zsh-autosuggestions zsh-syntax-highlighting)

# https://github.com/zsh-users/zsh-completions
fpath+=${ZSH_CUSTOM:-${ZSH:-~/.oh-my-zsh}/custom}/plugins/zsh-completions/src

source $ZSH/oh-my-zsh.sh

# Source cargo for rust commands
source "$HOME/.cargo/env"

# User configuration

# Preferred editor for local and remote sessions
EDITOR="code -w"

# Set personal aliases, overriding those provided by oh-my-zsh libs,
# plugins, and themes. Aliases can be placed here, though oh-my-zsh
# users are encouraged to define aliases within the ZSH_CUSTOM folder.
# For a full list of active aliases, run `alias`.
#
# Example aliases
alias zshconfig="code ~/.zshrc"
alias ohmyzsh="code ~/.oh-my-zsh"
alias gs="git status"
alias gammend="git commit --amend --no-edit"
alias pn=pnpm
alias merge-main="git fetch --all && git merge origin/main"
alias rebase-main="git fetch --all && git pull origin main --rebase"

prompt_context() {
  # %{$fg[yellow]%} - sets the foreground color to yellow
  # [%T] - Is the 24 hour time without seconds
  # %f - Resets the foreground color to the default
  # $USER - Is the current user name
  prompt_segment black default "%{$fg[yellow]%}[%T] %f$USER"
}

update_and_upgrade() {
  echo "Start updating and upgrading. This may take a while"
  omz update
  echo "****************************************************************"
  echo "brew..."
  brew update --verbose && brew upgrade && brew cleanup
  echo "****************************************************************"
}

kanye_welcome_message() {
  # Print welcome message which is a pre-2022 Kanye West quote
  KANYE_REST_API_RESPONSE=$(curl -s https://api.kanye.rest)
  QUOTE=`echo ${KANYE_REST_API_RESPONSE} | grep -o -E '[^{"quote":].*[^"}]'`
  if [ $QUOTE ]; then
    echo "\"${QUOTE}\" - Kanye West"
  else
    echo "No internet to grab quotes from"
  fi
}

npm_welcome_message() {
  npm_expansions_file=$(curl -s https://raw.githubusercontent.com/npm/npm-expansions/master/expansions.txt)
  npm_expansions_arr=(${(@f)"${npm_expansions_file}"})
  number_of_lines=${#npm_expansions_arr[@]}
  # Ignore first line
  starting_comments=1
  # Ignore last 5 lines
  ending_comments=5

  if (($number_of_lines == 0)); then
    echo "No internet to grab quotes from"
  else
    start_index=$((1+$starting_comments))
    end_index=$(($number_of_lines-$ending_comments))

    selected_expansion_index=$(shuf -i $start_index-$end_index -n 1)
    selected_expansion=$npm_expansions_arr[$selected_expansion_index]
    echo "${selected_expansion} - NPM"
  fi
}

welcome_message_percentage=$(shuf -i 1-10 -n 1)
if (($welcome_message_percentage <= 2)); then
  echo $(npm_welcome_message)
else
  echo $(kanye_welcome_message)
fi
