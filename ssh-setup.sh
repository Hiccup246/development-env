#!/bin/zsh
# Generate ssh keys for github global user name
# Inspiration taken from https://gist.github.com/jexchan/2351996 and https://gist.github.com/oanhnn/80a89405ab9023894df7

# Setup global ssh key
# Capture user ssh key filename
echo "Time to configure ssh keys"
read -r -p 'Do you want to configure this ssh key using global git info? [y/N] ' useGlobalGitInfo

case "$useGlobalGitInfo" in
    [yY][eE][sS]|[yY]) 
        setup_global_ssh_key
        ;;
esac

read -r -p 'Do you want to configure this ssh key using local git info? [y/N] ' useLocalGitInfo

case "$useLocalGitInfo" in
    [yY][eE][sS]|[yY]) 
        setup_local_ssh_key
        ;;
    *)
        echo "No other ssh options available"
        ;;
esac

setup_global_ssh_key() {
    if [[ ! $(git config --global user.email) ]]; then
       echo "No global git email found, please set one"
       return 
    fi

    read -r -p 'Enter desired filename of your ssh key: ' sshFileName

    # Generate the ssh key using the captured filename and global git email
    cd .ssh/
    ssh-keygen -t rsa -C $(git config --global user.email) -f "$sshFileName"
    echo "Copied generated ssh key to clipboard"
    pbcopy < "${sshFileName}.pub"

    # Setup ssh config file
    touch ~/.ssh/config
    FILE=~/.ssh/config

    echo "\nHost github.com\n" > FILE
    echo "\tHostName github.com\n" > FILE
    echo "\tIdentityFile ~/.ssh/${sshFileName}\n" > FILE
    echo "\tIdentitiesOnly yes" > FILE

    cd -

    echo "ssh key generated and saved in ~/.ssh/"
    ls ~/.ssh/

    echo "Saving ssh key to ssh agent"
    ssh-add -D
    ssh-add "~/.ssh/${sshFileName}"
}

setup_local_ssh_key() {
    if [[ ! $(git config user.email && git config user.name) ]]; then
       echo "No local git email or user name found, please set one"
       return 
    fi

    read -r -p 'Enter desired filename of your ssh key: ' sshFileName

    # Generate the ssh key using the captured filename and global git email
    cd .ssh/
    ssh-keygen -t rsa -C $(git config user.email) -f "$sshFileName"
    echo "Copied generated ssh key to clipboard"
    pbcopy < "${sshFileName}.pub"

    # Setup ssh config file
    touch ~/.ssh/config
    FILE=~/.ssh/config

    echo "\nHost github.com-${git config user.name}\n" > FILE
    echo "\tHostName github.com\n" > FILE
    echo "\tIdentityFile ~/.ssh/${sshFileName}\n" > FILE
    echo "\tIdentitiesOnly yes" > FILE

    cd -

    echo "ssh key generated and saved in ~/.ssh/"
    ls ~/.ssh/

    echo "Saving ssh key to ssh agent"
    ssh-add -D
    ssh-add "~/.ssh/${sshFileName}"
}
