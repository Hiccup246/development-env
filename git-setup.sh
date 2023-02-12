#!/bin/zsh
# Configure git for development

# Make git always use ssh for github repos
git config --global url."git@github.com:".insteadOf https://github.com/

# Configure git email + name + display name
if [ -n "$(git config --global user.email)" ]; then
  echo "✔ Git email is set to $(git config --global user.email)"
else
  read -p 'What is your Git email address?: ' gitEmail
  git config --global user.email "$gitEmail"
fi

if [ -n "$(git config --global user.name)" ]; then
  echo "✔ Git display name is set to $(git config --global user.name)"
else
  read -p 'What is your Git display name (Firstname Lastname)?: ' gitName
  git config --global user.name "$gitName"
fi

# Setup global ssh key
# Capture user ssh key filename
echo "Time to configure a global ssh key using your global github email"
read -p 'Enter filename of your ssh key: ' sshFileName

# Generate the ssh key using the captured filename and global git email
cd .ssh/
ssh-keygen -t rsa -C "$gitEmail" -f "$sshFileName"
echo "Copied generated ssh key to clipboard"
pbcopy < "${sshFileName}.pub"

# Setup ssh config file
touch ~/.ssh/config
FILE=~/.ssh/config

echo "Host github.com\n" > FILE
echo "\tHostName github.com\n" > FILE
echo "\tIdentityFile ~/.ssh/${sshFileName}\n" > FILE
echo "\tIdentitiesOnly yes" > FILE

cd -

echo "ssh key generated and saved in ~/.ssh/"
ls ~/.ssh/

echo "Saving ssh key to ssh agent"
ssh-add -D
ssh-add "~/.ssh/${sshFileName}"