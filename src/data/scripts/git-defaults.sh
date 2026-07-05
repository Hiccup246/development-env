#!/bin/bash
# Static git configuration defaults (user identity prompted separately)

git config --global url."git@github.com:".insteadOf https://github.com/
git config --global core.fileMode false
git config --global diff.tool vscode
# shellcheck disable=SC2016 # $LOCAL/$REMOTE are expanded by git at diff time, not here
git config --global difftool.vscode.cmd 'code --wait --diff $LOCAL $REMOTE'
git config --global difftool.prompt false
git config --global core.editor "code --wait"
git config --global merge.tool vscode
# shellcheck disable=SC2016 # $MERGED is expanded by git at merge time, not here
git config --global mergetool.vscode.cmd 'code --wait $MERGED'
git config --global mergetool.prompt false
