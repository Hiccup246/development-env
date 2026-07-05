# 👨‍💻 development-env

![](https://img.shields.io/github/license/Hiccup246/development-env)
![](https://img.shields.io/github/languages/code-size/Hiccup246/development-env)
[![Style Check](https://github.com/Hiccup246/development-env/actions/workflows/style-check.yml/badge.svg)](https://github.com/Hiccup246/development-env/actions/workflows/style-check.yml)
[![Release](https://github.com/Hiccup246/development-env/actions/workflows/release.yml/badge.svg)](https://github.com/Hiccup246/development-env/actions/workflows/release.yml)
![](https://img.shields.io/github/v/release/Hiccup246/development-env)
![](https://img.shields.io/badge/runtime-bun-000000?logo=bun)
[![](https://img.shields.io/badge/release-checksum_verified-brightgreen)](#%EF%B8%8F-usage)

A personal Macintosh development environment setup tool — an interactive terminal app (built with [clack](https://github.com/bombshell-dev/clack)) that configures a fresh Mac for development.

This repository contains a TypeScript CLI, compiled to a standalone binary, that walks through configuring a mac based development environment. The various tasks and configuration options are listed at the end of this readme in an [index](#%EF%B8%8F-configuration-index).

<br>

# 🕹️ Usage

0. Setup an SSH key if you have none

- Generate an SSH key using the command
  ```zsh
  ssh-keygen -t ecdsa -C <git_user_email> -f <ssh_file_name>
  ```
- Copy the SSH key to your clipboard using the command below and add it to [Github](https://github.com/)
  ```zsh
  pbcopy < ~/.ssh/id_ecdsa.pub
  ```

1. Run the installer. No prerequisites needed, this works on a completely fresh Mac
   ```zsh
   curl -fsSL https://raw.githubusercontent.com/Hiccup246/development-env/main/install.sh | sh
   ```
   Prefer not to pipe curl into a shell? Download the binary for your Mac's chip directly instead:
   ```zsh
   # Apple Silicon
   curl -fsSL https://github.com/Hiccup246/development-env/releases/latest/download/devenv-darwin-arm64 -o devenv
   # Intel
   curl -fsSL https://github.com/Hiccup246/development-env/releases/latest/download/devenv-darwin-x64 -o devenv

   chmod +x devenv
   ./devenv
   ```
   Each release also publishes a `checksums.txt` — `install.sh` verifies the binary against it automatically; if you download manually you can check it yourself with `shasum -a 256 -c`.
2. Follow the interactive prompts. Pick **Guided setup** to run every task in recommended order (uncheck any you want to skip), or **Pick individual tasks** to run one at a time. Two more options sit on the main menu independent of setup, for reconfiguring anytime after install: **Clone GitHub user's repos** and **Reconfigure git identity**.

<br>

# ✍️ Manual Configuration

Unfortunately, some configuration cannot be done automatically or is more effective when done manually. The following configuration should be done manually:

## iTerm

- Profiles
  - Default
    - General -> Working Directory -> Reuse previous session's directory
    - Colors -> Color Presets -> Solarized Dark
    - Colors -> ANSI Colors -> Black bright to 40% grey
    - Text -> Font -> FiraCode Nerd Font
    - Keys -> Key Mappings -> Presets -> Natural Text Editing
      - This allows me to use the [keyboard shortcuts](https://gist.github.com/w3cj/022081eda22081b82c52)

## VSCode

Open VSCode and search for VSCode's `settings.json` file. Copy the content from `vscode-config.json` into the `settings.json`. You should see your editor instantly update.

## codiff

Open the codiff app and run `Codiff > Install Terminal Helper` from the app menu to make the `codiff` command available in your shell. It picks up the Claude Code CLI automatically once the AI tooling task has run.

## Alt tab

- Preferences
  - Appearance
    - Hide Space number labels -> True
    - Hide status icons -> True

## Chrome

- Install Chrome Extensions
  - Bitwarden
  - Wappalyzer
  - AdBlock
  - Tabliss
  - ColorPick Eyedropper or Ultimate Color Picker

## Flycut

- Preferences
  - Clippings -> Remember -> 40

## MacOS

- System Settings
  - Desktop & Dock
    - Widgets -> Default web browser -> Google Chrome
  - General
    - Login Items
      - Open At Login
        - Add -> AltTab
        - Add -> Raycast
        - Add ->Flycut
  - Control centre
    - Menu Bar Only -> Spotlight -> Don't Show in Menu Bar
    - Automatically hide and show the menu bar -> Never
    - Control Centre Modules -> Bluetooth -> Show in Menu Bar

<br>

# 🔧 Troubleshooting

If a task fails, the app offers to retry, skip, or abort, no need to start over. The most common source of trouble are the shell tasks, since they install oh-my-zsh from a remote script. To fix:

- Retry the task from the failure menu
- Re-run the Dotfiles task — it backs up any conflicting `~/.zshrc` before restoring the managed one via [stow](https://www.gnu.org/software/stow/)

<br>

# 👷 Development

To perform development on this project you must:

1. Clone this project
2. Install [Bun](https://bun.sh) (`curl -fsSL https://bun.sh/install | bash`)
3. Install dependencies
   ```zsh
   bun install
   ```
4. Run the app
   ```zsh
   bun run dev    # watch mode
   bun run start  # single run
   ```
5. Before committing, typecheck, test, lint and format. Linting covers both TypeScript ([eslint](https://eslint.org/)) and the embedded shell scripts ([shellcheck](https://www.shellcheck.net/), install via `brew install shellcheck`)
   ```zsh
   bun run typecheck
   bun test              # unit tests
   bun run lint          # eslint + shellcheck
   bun run lint:sh       # shellcheck only
   bun run fix           # auto-fix what eslint can (shellcheck has no autofix)
   bun run format        # prettier (src/data/dotfiles/ is excluded — see below)
   bun run format:check  # what CI runs
   ```
6. Format embedded shell scripts (`src/data/scripts/*.sh`, `install.sh`) after changes using [`shfmt`](https://github.com/mvdan/sh)
   ```zsh
   shfmt -l -w install.sh src/data/scripts
   ```
   Note: don't run `shfmt -w .` across the whole repo — `src/data/dotfiles/` holds byte-exact copies of real personal dotfiles, and reformatting them breaks that.

Releases are built by `.github/workflows/release.yml` on any `v*` tag push — it compiles standalone `arm64`/`x64` binaries with `bun build --compile` and publishes them to GitHub Releases, which `install.sh` downloads.

<br>

# 🧭 Project structure

A quick map of the codebase, for anyone new to the project:

```
src/
  index.ts              starts the app, shows the menu
  runner.ts             runs shell commands for tasks
  prompts.ts            small shared prompt helper
  types/                TypeScript type helpers

  tasks/                one file per setup step
    registry.ts         the list of steps, in order
    mac.ts, homebrew.ts, shell.ts, appstore.ts,
    git.ts, languages.ts, rust.ts, vscode.ts,
    dotfiles.ts, ai.ts, ssh.ts, github.ts     what each step actually does

  data/                 files the tasks use
    *.txt               lists of packages to install
    scripts/*.sh        bash scripts for trickier steps
    dotfiles/           copies of personal config files

install.sh              downloads and runs the app
vscode-config.json      VSCode settings you copy in yourself
.github/workflows/      runs checks and builds releases
```

**How a task works:** each file in `tasks/` is one setup step (installing Homebrew, configuring git, and so on). `registry.ts` just lists them in the order they run. Anything a task needs (a package list, a bash script, a config file) lives in `data/` and gets bundled straight into the app when it's compiled, so there's nothing extra to copy around at install time.

**Where to make changes:**

- **Add a new setup step**: create a new file in `src/tasks/`, then add it to the list in `src/tasks/registry.ts`.
- **Add something that runs anytime, not just during setup** (like the GitHub-repo-cloning option): same as above, but wire it into the menu in `src/index.ts` instead of the registry list.
- **Add a package to install**: just edit the relevant `.txt` file in `src/data/`, no code needed.
- **Change a bash script**: edit the file in `src/data/scripts/`, then run `shfmt -l -w install.sh src/data/scripts` and `bun run lint:sh` to check it.
- **Change the dotfiles a fresh machine gets**: edit the files in `src/data/dotfiles/` directly.

<br>

# 🗂️ Configuration index

Package lists (in `src/data/`):

- `vscode-extensions.txt` - All VSCode extensions
- `homebrew-cask.txt` - All GUI applications
- `homebrew.txt` - All homebrew packages

## Standalone actions

Available on the main menu, independent of setup — safe to run anytime, not just during initial install:

- **Clone GitHub user's repos** — prompts for a username, clones all their public, non-fork, non-archived repos
- **Reconfigure git identity** — re-prompts for global git email, name, and display name

## Mac appstore installations

- Flycut

## Zsh configuration

- `zsh-autosuggestions` plugin
- `zsh-syntax-highlighting` plugin
- `zsh-completions` plugin
- `history-substring-search`, `docker`, `docker-compose`, `gradle` (bundled oh-my-zsh plugins)
- FiraCode Nerd Font (provides the powerline glyphs the agnoster theme and status line use)

## Language version managers

- Direnv
- Python via `pyenv`
- Node.js via `fnm`
- Ruby via `rbenv`
- Java via `sdkman`
- Clojure, Deno, Go via Homebrew

## AI & review tooling

- [Claude Code](https://claude.ai/code) CLI, with login handled interactively
- [Caveman](https://github.com/JuliusBrussee/caveman) Claude Code plugin
- [Rtk](https://www.rtk-ai.app/) token-optimized CLI proxy
- [Codiff](https://github.com/nkzw-tech/codiff) local diff review tool

## Dotfiles

Managed with [GNU Stow](https://www.gnu.org/software/stow/). The Dotfiles task writes `~/dotfiles` (from the app's embedded copies) and symlinks:

- `~/.zshrc`
- `~/.claude/settings.json`, `~/.claude/CLAUDE.md`, `~/.claude/RTK.md`, `~/.claude/statusline-command.sh`

## Mac setup

- Sets safari debug menu
- Sets safari development menu
- Sets safari webkit development extras
- Sets finder to show path and status bar
- Sets finder to show all file extensions
- Sets finder to search in current directory
- Unhides the library directory
- Sets mac doc to not display recent apps

<br>

# ❤️ Some of my Favourite Fonts

- [FiraCode Nerd Font](https://www.nerdfonts.com/) (installed automatically — my editor and terminal font)
- [Hack](https://sourcefoundry.org/hack/) (My second favourite editor font)

<br>

# 💡 Inspired By:

- https://github.com/vendasta/setup-new-computer-script
- https://github.com/donnemartin/dev-setup
- https://github.com/thomaspoignant/mac-dev-setup
- https://github.com/thoughtbot/laptop
- https://github.com/nicolashery/mac-dev-setup
- https://starship.rs/
- https://github.com/CodingGarden/mac-setup
- https://gist.github.com/MatthewEppelsheimer/2269385
