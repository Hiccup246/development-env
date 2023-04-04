# 👨‍💻 development-env
![](https://img.shields.io/github/license/Hiccup246/development-env)
![](https://img.shields.io/github/languages/code-size/Hiccup246/development-env)

A place for my personal Macintosh development environment setup scripts

![program-main-menu-screenshot](https://raw.githubusercontent.com/Hiccup246/development-env/main/program-main-menu-screenshot.webp)


This repository contains various scripts written in `zsh` shell that configure a mac based development environment. By running the main script you are presented with 5 key setup options which are described below. All the configuration options are listed at the end of this readme in a [index](#%EF%B8%8F-index-of-all-configurations).

## Run entire mac setup
1. Configures safari, finder, doc and default directories
2. Installs Xcode command line tools
3. Installs all homebrew packages
4. Installs all homebrew GUI packages
5. Install mac app store applications
6. Configures git global config
7. Adds homebrew `bash` (mac comes with an old version) to system shells
8. Sets up and configures `zsh` shell
9. Sets up and configures programming languages via `asdf`
10. Sets up and configures the `rust` programming language via `rustup`
11. Configures some generic Vscode plugins
## Configure ssh keys
- Allows you to configure global and/or local ssh keys
## Configure global git info
- Allows you to configure global git info
## Clone repos from github user
- Allows you to clone all public, non-forked, non-archived git repos from a given user
## Quit
- Allows you to quit the main menu

<br>

# 🕹️ Usage
To run the installation script you must:
1. Clone this repository
2. Run the following command to start the main script
   ```
   chmod +x main-setup.sh && ./main-setup.sh
   ```

<br>

# ✍️ Manual Configuration
Unfortunately, some configuration cannot be done automatically or is more effective when done manually. The following configuration should be done manually:
- Update iTerm2 color scheme to solarized dark
- Update iTerm2 fonts to use installed powerline fonts
- If zsh-autosuggestions are not showing edit the suggestions text color
  ```
  Basic Colors > Background and ANSI Colors > Bright Black are different
  ```
- Manually set vscode terminal font by adding the following line to vscodes JSON settings
  ```json
  "terminal.integrated.fontFamily": "Source Code Pro for Powerline"
  ```
- Set Mac default browser to be Chrome
- Update Flycut to save a larger clipboard history
- Install Bitwarden, Wappalyzer and AdBlock Google Chrome extensions
   - Optionally install ColorPick Eyedropper or Ultimate Color Picker extensions
- Setup mac email accounts

<br>

# 👷 Development
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

# 🗂️ Index of all configurations
## Homebrew packages
- curl
- wget
- coreutils
- bash
- zsh 
- git
- pnpm
- npm
- pip
- mas
- asdf
- rustup-init
- railway
- docker
- nginx

## Homebrew cask packages
- Spotify
- Discord
- Vscode
- Google Chrome
- Postman
- Firefox
- Docker
- iTerm2

## Mac appstore installtions
- Flycut
- Bitwarden

## Zsh configuration
- `zsh-autosuggestions` plugin
- `zsh-syntax-highlighting` plugin
- `zsh-completions` plugin
- Powerline fonts

## Asdf configuration
- Direnv
- Python
- Node.js
- Ruby
- Java
- Clojure
- Deno
- Go

## Vscode plugins
- Dotenv
- Editorconfig
- Better TOML
- Docker
- Deno
- Remote containers
- Nginx
- React js snippets
- Jest
- Playwright
- Rust
- Svelte
- Typescript vue
- Vue Volar

## Mac setup
- Sets safari debug menu
- Sets safari development menu
- Sets safari webkit development extras
- Sets finder to show path and status bar
- Unhides the library directory
- Sets mac doc to not display recent apps

<br>

# 💡 Inspiration taken from
- https://github.com/vendasta/setup-new-computer-script
- https://github.com/donnemartin/dev-setup
- https://github.com/thomaspoignant/mac-dev-setup
- https://github.com/thoughtbot/laptop
- https://github.com/nicolashery/mac-dev-setup
- https://starship.rs/

<br>

# 🤔 ToDo
- Implement interactive menus with arrow key selection for multi-select and single select menus
- Implement a loading spinner for installation commands