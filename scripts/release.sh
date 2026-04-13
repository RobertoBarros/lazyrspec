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

RELEASE_URL="https://github.com/RobertoBarros/lazyrspec/releases/download/${TAG}/${TARBALL}"
FORMULA="Formula/lazyrspec.rb"

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

echo "==> Cleaning up..."
rm -f "${BINARY_NAME}" "${TARBALL}" .*.bun-build

echo ""
echo "Done! ${TAG} released and Formula updated."
