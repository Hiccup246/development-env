#!/bin/zsh
# Configure git for development

# Make git always use ssh for github repos
git config --global url."git@github.com:".insteadOf https://github.com/

configure_global_git_email() {
  read 'git_email?What do you want your global git email address to be?: '
  git config --global user.email "$git_email"
  echo "✔ Git email is now set to $(git config --global user.email)"
}

configure_global_git_display_name() {
  read 'git_display_name?What do you want your global git display name to be (Firstname Lastname)?: '
  git config --global user.displayname "$git_display_name"
  echo "✔ Git display name is now set to $(git config --global user.displayname)"

}

configure_global_git_name() {
  read 'git_name?What do you want your global git name to be (Firstname Lastname)?: '
  git config --global user.name "$git_name"
  echo "✔ Git name is now set to $(git config --global user.name)"
}

# Configure git email
if [ -n "$(git config --global user.email)" ]; then
  echo "✔ Git email is set to $(git config --global user.email)"

  read -q "?Do you want to change your global git email? [y/n] "
  answer=$?

  if ((!$answer)); then
    echo ""
    configure_global_git_email
  fi
else
  configure_global_git_email
fi

echo ""

# Configure git name
if [ -n "$(git config --global user.name)" ]; then
  echo "✔ Git name is set to $(git config --global user.name)"

  read -q "?Do you want to change your global git name? [y/n] "
  answer=$?

  if ((!$answer)); then
    echo ""
    configure_global_git_name
  fi
else
  configure_global_git_name
fi

echo ""

# Configure git display name
if [ -n "$(git config --global user.displayname)" ]; then
  echo "✔ Git display name is set to $(git config --global user.displayname)"
  
  read -q "?Do you want to change your global git display name? [y/n] "
  answer=$?

  if ((!$answer)); then
    echo ""
    configure_global_git_display_name
  fi
else
  configure_global_git_display_name
fi

echo ""
echo ""
echo "Git global info configured..."