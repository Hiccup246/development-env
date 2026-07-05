#!/bin/sh
# Downloads the latest devenv release binary and runs it.
# curl -fsSL https://raw.githubusercontent.com/Hiccup246/development-env/main/install.sh | sh
set -e

case "$(uname -m)" in
	arm64) ARCH="arm64" ;;
	x86_64) ARCH="x64" ;;
	*)
		echo "Unsupported architecture: $(uname -m)" >&2
		exit 1
		;;
esac

REPO="Hiccup246/development-env"
URL="https://github.com/${REPO}/releases/latest/download/devenv-darwin-${ARCH}"
DEST="${HOME}/.local/bin"

mkdir -p "$DEST"
curl -fsSL "$URL" -o "${DEST}/devenv"
chmod +x "${DEST}/devenv"

exec "${DEST}/devenv"
