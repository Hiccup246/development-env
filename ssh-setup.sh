#!/bin/zsh
# Generate ssh keys for github global user name
# Inspiration taken from https://gist.github.com/jexchan/2351996 and https://gist.github.com/oanhnn/80a89405ab9023894df7

echo ""

echo "Time to configure ssh"

echo ""

read 'ssh_file_name?Enter the name of your ssh key (located in ~/.ssh) (EXCLUDE .pub extension): '

# Setup ssh config file
touch ~/.ssh/config

echo "\nHost github.com" >>  ~/.ssh/config
echo "\tHostName github.com" >>  ~/.ssh/config
echo "\tIdentityFile ~/.ssh/${ssh_file_name}" >>  ~/.ssh/config
echo "\tIdentitiesOnly yes" >>  ~/.ssh/config

cd -

ssh-add ~/.ssh/${ssh_file_name}

echo "Ssh configuration successfull!"

echo ""


