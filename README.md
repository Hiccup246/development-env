# 👨‍💻 development-env
![](https://img.shields.io/github/license/Hiccup246/development-env)
![](https://img.shields.io/github/languages/code-size/Hiccup246/development-env)

A place for my personal Macintosh development environment setup scripts

![program-main-menu-screenshot](https://raw.githubusercontent.com/Hiccup246/development-env/main/program-main-menu-screenshot.webp)


This repository contains various scripts written in `zsh` shell that configure a mac based development environment. By running the main script you are presented with 5 key setup options which are described below. All the configuration options are listed at the end of this readme in a [index](#Index-of-all-configurations).

## Run entire mac setup
## Configure ssh keys
## Configure global git info
## Clone repos from github user
## Quit

<br>

# Usage
To run the installation script you must:
1. Clone this repository
2. Run the following command to start the main script
   ```
   chmod +x main-setup.sh && ./main-setup.sh
   ```

<br>

# Manual Configuration
Unfortunatley some configuration cannot be done automatically or is more effective when done manually. The following configuration should be done manually:
- Update iTerm2 color scheme to solarized dark
- Manually set vscode terminal font by adding the following line to vscodes JSON settings
  ```json
  "terminal.integrated.fontFamily": "Source Code Pro for Powerline"
  ```
- Set Mac default browser to be Chrome
- Update Flycut to save a larger clipboard history
- Install Bitwarden, Wappalyzer and AdBlock Google Chrome extensions

<br>

# Development
To perform development on this project you must:
1. Clone this project
2. Install [`shfmt`](https://github.com/mvdan/sh) shell formatter by running the following command from [webinstall](https://webinstall.dev/shfmt/)
   ```
   curl -sS https://webi.sh/shfmt | sh
   ```
3. Run scripts using the command
   ```
   chmod +x <script-name>.sh && ./<script-name>.sh
   ```
4. Format scripts after changes by running
   ```
   shfmt -l -w .
   ```

<br>

# Inspiration taken from
- https://github.com/vendasta/setup-new-computer-script
- https://github.com/donnemartin/dev-setup
- https://github.com/thomaspoignant/mac-dev-setup
- https://github.com/thoughtbot/laptop
- https://github.com/nicolashery/mac-dev-setup
- https://starship.rs/

<br>

# Index of all configurations

<br>

# ToDo
- Add more functions/alias's to `.zshrc`
- Review `.zshrc` file
- Implement interactive menus with arrow key selection for multi select and single select menus
- Implement a loading spinner for installation commands
- Complete all readme sections