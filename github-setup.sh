#!/bin/zsh
# Download all public, non-archived, non-forked github repos for a github user into the current directory
# Inspiration taken from https://gist.github.com/santoshphegde/218e26317327f9c5aa9791ad767c1b3e

clone_user_repos() {
    read 'githubUser?Enter the github user name you want to clone repos from: '
    response=$(curl -s -f "https://api.github.com/users/${githubUser}/repos")

    if (($?)); then
        echo "Request to github failed. Did you enter the correct github user?"
    else
        for row in $(echo $response | jq -r '.[] | select(.private==false) | select(.fork==false) | select(.archived==false) | .ssh_url'); do
            git clone $row
            echo ""
        done

        echo "✔ Cloning of all repos from ${githubUser} complete"
    fi
}

# Core github setup loop
ANSWER=0

while ((!$ANSWER)); do
    read -q "?Do you want to clone all public, non-archived, non-forked repos from a github user? [y/n] "
    ANSWER=$?
    echo ""

    if ((!$ANSWER)); then
        clone_user_repos
    fi

    echo ""
done

echo "\nEnd of github setup, returning to main menu..."