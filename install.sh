#!/bin/sh
# Downloads the latest devenv release binary, verifies its checksum, and runs it.
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
BINARY="devenv-darwin-${ARCH}"
BASE_URL="https://github.com/${REPO}/releases/latest/download"
DEST="${HOME}/.local/bin"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

curl -fsSL "${BASE_URL}/${BINARY}" -o "${TMP}/${BINARY}"
curl -fsSL "${BASE_URL}/checksums.txt" -o "${TMP}/checksums.txt"

# Verify only the binary we downloaded against its published checksum
(
	cd "$TMP"
	grep " ${BINARY}\$" checksums.txt | shasum -a 256 -c - > /dev/null
) || {
	echo "Checksum verification failed for ${BINARY} — aborting" >&2
	exit 1
}
echo "✔ Checksum verified"

mkdir -p "$DEST"
mv "${TMP}/${BINARY}" "${DEST}/devenv"
chmod +x "${DEST}/devenv"

exec "${DEST}/devenv"
