#!/bin/zsh
# Download all public, non-archived, non-forked github repos for a github user into the current directory

# Configure github user to clone repos from
read -r -p "Do you want to clone all public, non-archived, non-forked repos from a github user? [y/N] " response

case "$response" in
    [yY][eE][sS]|[yY]) 
        clone_user_repos
        ;;
esac

clone_user_repos() {
    read -r -p 'Enter the github user name you want to clone repos from: ' githubUser
    
    for row in $(curl -s "https://api.github.com/users/${githubUser}/repos" | jq -r '.[] | select(.private==false) | select(.fork==false) | select(.archived==false) | .ssh_url'); do
        clone() {
            git clone $row
        }

        clone '.name'
    done
}