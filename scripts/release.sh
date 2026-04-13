#!/bin/bash
set -euo pipefail

# Build, sign, and create a GitHub release for lazyrspec
# Usage: ./scripts/release.sh <version>
# Example: ./scripts/release.sh 0.1.0

VERSION="${1:?Usage: ./scripts/release.sh <version>}"
TAG="v${VERSION}"
BINARY_NAME="lazyrspec"
TARBALL="${BINARY_NAME}-${VERSION}-darwin-arm64.tar.gz"
FORMULA="Formula/lazyrspec.rb"

echo "==> Building ${BINARY_NAME} ${TAG}..."
bun build --compile ./src/index.ts --outfile "${BINARY_NAME}"

echo "==> Signing binary..."
strip "${BINARY_NAME}"
codesign --sign - --force "${BINARY_NAME}"

echo "==> Creating tarball..."
tar czf "${TARBALL}" "${BINARY_NAME}"

SHA256=$(shasum -a 256 "${TARBALL}" | awk '{print $1}')
echo "    SHA256: ${SHA256}"

RELEASE_URL="https://github.com/RobertoBarros/lazyrspec/releases/download/${TAG}/${TARBALL}"

echo "==> Updating Formula..."
sed -i '' "s|url \".*\"|url \"${RELEASE_URL}\"|" "${FORMULA}"
sed -i '' "s|sha256 \".*\"|sha256 \"${SHA256}\"|" "${FORMULA}"
sed -i '' "s|version \".*\"|version \"${VERSION}\"|" "${FORMULA}"

echo "==> Creating git tag ${TAG}..."
git add "${FORMULA}"
git commit -m "Release ${TAG}"
git tag -a "${TAG}" -m "Release ${TAG}"
git push origin master "${TAG}"

echo "==> Creating GitHub release..."
gh release create "${TAG}" "${TARBALL}" \
  --title "${TAG}" \
  --notes "Release ${TAG}"

echo "==> Updating homebrew-tap..."
TAP_DIR="$HOME/code/homebrew-tap"
cp "${FORMULA}" "${TAP_DIR}/Formula/lazyrspec.rb"
git -C "${TAP_DIR}" add Formula/lazyrspec.rb
git -C "${TAP_DIR}" commit -m "lazyrspec ${TAG}"
git -C "${TAP_DIR}" push origin master

echo "==> Cleaning up..."
rm -f "${BINARY_NAME}" "${TARBALL}" .*.bun-build

echo ""
echo "Done! ${TAG} released."
