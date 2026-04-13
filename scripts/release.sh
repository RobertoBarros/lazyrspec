#!/bin/bash
set -euo pipefail

# Build and create a GitHub release for lazyrspec
# Usage: ./scripts/release.sh <version>
# Example: ./scripts/release.sh 0.1.0

VERSION="${1:?Usage: ./scripts/release.sh <version>}"
TAG="v${VERSION}"
BINARY_NAME="lazyrspec"
TARBALL="${BINARY_NAME}-${VERSION}-darwin-arm64.tar.gz"

echo "==> Building ${BINARY_NAME} ${TAG}..."
bun build --compile ./src/index.ts --outfile "${BINARY_NAME}"

echo "==> Creating tarball..."
tar czf "${TARBALL}" "${BINARY_NAME}"

SHA256=$(shasum -a 256 "${TARBALL}" | awk '{print $1}')
echo "==> SHA256: ${SHA256}"

echo "==> Creating git tag ${TAG}..."
git tag -a "${TAG}" -m "Release ${TAG}"
git push origin "${TAG}"

echo "==> Creating GitHub release..."
gh release create "${TAG}" "${TARBALL}" \
  --title "${TAG}" \
  --notes "Release ${TAG}"

echo "==> Cleaning up..."
rm -f "${BINARY_NAME}" "${TARBALL}"

echo ""
echo "Done! Update your Homebrew formula with:"
echo "  url: https://github.com/RobertoBarros/lazyrspec/releases/download/${TAG}/${TARBALL}"
echo "  sha256: ${SHA256}"
