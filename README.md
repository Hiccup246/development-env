# development-env
A place for my development environment setup scripts

These scripts aid in setting up development for python, rust, clojure, ruby and javascript

<br>

# Usage
To start the installation run the followin gshell command.
```
chmod +x mac-setup.sh && ./mac-setup.sh
```

<br>

# Manual Configuration
- Update iTerm2 color scheme to solarized dark
- Manually set vscode terminal adding the following line to vscodes JSON settings
  `"terminal.integrated.fontFamily": "Source Code Pro for Powerline"`
- Set Mac default browser to be Chrome
- Update Flycut to save a larger history
- Install Bitwarden, Wappalyzer and AdBlock chrome extensions

<br>

# Inspiration taken from
- https://github.com/vendasta/setup-new-computer-script
- https://github.com/donnemartin/dev-setup
- https://github.com/thomaspoignant/mac-dev-setup
- https://github.com/thoughtbot/laptop
- https://github.com/nicolashery/mac-dev-setup

<br>

# ToDo
- Add shell setup (bash + zsh)
  - Functions/Alias's
  - Bash config [system](https://starship.rs/)
- Add editor setup
  - Add `code` command to path
  - export PATH="\$PATH:/Applications/Visual Studio Code.app/Contents/Resources/app/bin"
- Review .zshrc file
- Add bash/zsh shell linting and formatting
- Update readme to be more polished
- Add npm acronyms to shell start up message with maybe a 10% chance