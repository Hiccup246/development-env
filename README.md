# 👨‍💻 development-env
![](https://img.shields.io/github/license/Hiccup246/development-env)
![](https://img.shields.io/github/languages/code-size/Hiccup246/development-env)

A place for my personal Macintosh development environment setup scripts

![program-main-menu-screenshot](https://raw.githubusercontent.com/Hiccup246/development-env/main/program-main-menu-screenshot.webp)


This repository contains various scripts written in `zsh` shell that configures a mac based development environment. The various scripts and configuration options are listed at the end of this readme in a [index](#%EF%B8%8F-index-of-all-configurations).

<br>

# 🕹️ Usage
To run the installation scripts you must:

0. Setup ssh key if you have none
  - Generate a SSH key using the command 
     ```zsh
     ssh-keygen -t ecdsa -C <git_user_email> -f <ssh_file_name>
     ```
  - Copy the SSH key to your clipboard using the command below and add it to [Github](https://github.com/)
     ```zsh
     pbcopy < ~/.ssh/id_ecdsa.pub
     ```
1. Clone this repository
2. Run `sudo chmod -R +x development-env` to make all project files executable
3. Navigate to the root directory. From here you can run any of the project scripts
  
The scripts can be run in any order but I would recommend executing them in the following order (Note that no 'main' script exists due to the execution times of some scripts):

0. `./info.sh` - Prints all possible commands
1. `./mac-setup.sh` - Configures MacOS
2. `./homebrew-setup.sh` - Installs homebrew packages and casks (GUI applications)
3. `./bash-setup.sh` - Adds homebrew bash (as opposed to system bash) to the list of viable shells
4. `./zsh-setup.sh` - Configures zsh terminal
5. `./appstore-setup.sh` - Installs appstore applications
6. `./git-setup.sh` - Configures Git global username and email
7. `./asdf-setup.sh` - Installs all programming languages
8. `./rustup-setup.sh` - Installs rust tooling
9. `./vscode-setup.sh` - Configures vscode for development
10. `./ssh-setup.sh` - Sets up ssh configuration
11. `./github-setup.sh` - Clone all public repos from a GitHub user

<br>

# ✍️ Manual Configuration
Unfortunately, some configuration cannot be done automatically or is more effective when done manually. The following configuration should be done manually:
- Update iTerm2 color scheme to solarized dark
   ```
   iTerm settings > Profiles > Colors
   ```
   Set "Color Presets..." to "Solarized Dark"
- Update iTerm2 fonts to use installed powerline fonts
   ```
   iTerm settings > Profiles > Text
   ```
   Set the font to "Space Mono for Powerline"
- If zsh-autosuggestions are not showing edit the iTerm
  ```
  iTerm settings > Profiles > Colors
  ```
  Then set ANSI Colors "Black bright to 40% grey"
- Manually set vscode terminal font by adding the following line to vscodes JSON settings (Nesting and position do not matter unless `terminal.integrated.fontFamily` already exists)
  ```json
  "terminal.integrated.fontFamily": "Source Code Pro for Powerline"
  ```
- Set Mac default browser to be Chrome
- Set Bluetooth to show in the MacOS Menu bar (MacOS Ventura)
   ```
      System settings > Control Centre > Bluetooth
   ```
- Update Flycut to save a larger clipboard history
- Install Bitwarden, Wappalyzer and AdBlock Google Chrome extensions
   - Optionally install ColorPick Eyedropper or Ultimate Color Picker extensions
- Setup Mac email accounts

<br>

# 👷 Development
To perform development on this project you must:
1. Clone this project
2. Grant executable permissions to the root directory with `sudo chmod -R +x development-env`
3. Install [`shfmt`](https://github.com/mvdan/sh) shell formatter by running the following command from [webinstall](https://webinstall.dev/shfmt/)
   ```zsh
   curl -sS https://webi.sh/shfmt | sh
   ```
4. Run the info script or refer to this documentation for available commands
   ```zsh
   ./info.sh
   ```
5. Format scripts after changes by running
   ```zsh
   shfmt -l -w .
   ```

<br>

# 🔧 Troubleshooting
If a script fails to run first try re-running it, if it continues to fail then you will have to investigate why. The most common failure occurs in the `.zsh-setup` script where the powerline fonts and `.zshrc` file fail to configure correctly. To fix this one can try the following 
- Re-run the script
- Manually set the system `.zshrc` file using the command `cp .zshrc ~/` from within the root of the project directory

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
- Flyctl
- Bitwarden
- Microsoft Teams
- Slack

## Mac appstore installtions
- Flycut

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
- Even better TOML
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
- Javascript and Typescript
- Tailwind Fold

## Mac setup
- Sets safari debug menu
- Sets safari development menu
- Sets safari webkit development extras
- Sets finder to show path and status bar
- Sets finder to show all file extensions
- Unhides the library directory
- Sets mac doc to not display recent apps

<br>

# 💡 Inspired By:
- https://github.com/vendasta/setup-new-computer-script
- https://github.com/donnemartin/dev-setup
- https://github.com/thomaspoignant/mac-dev-setup
- https://github.com/thoughtbot/laptop
- https://github.com/nicolashery/mac-dev-setup
- https://starship.rs/