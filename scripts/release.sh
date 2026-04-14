#!/bin/bash
set -euo pipefail

# Usage: ./scripts/release.sh <version>
# Example: ./scripts/release.sh 0.2.0
#
# 1. Pushes tag → triggers CI (build, sign, GitHub Release, Formula update)
# 2. Waits for CI to finish
# 3. Pulls updated Formula and pushes to homebrew-tap

VERSION="${1:?Usage: ./scripts/release.sh <version>}"
TAG="v${VERSION}"
TAP_DIR="$HOME/code/homebrew-tap"

echo "==> Pushing tag ${TAG}..."
git tag -a "${TAG}" -m "Release ${TAG}"
git push origin "${TAG}"

echo "==> Waiting for CI release workflow to complete..."
sleep 5
RUN_ID=$(gh run list --repo RobertoBarros/lazyrspec --workflow=release.yml --limit=1 --json databaseId --jq '.[0].databaseId')
gh run watch --repo RobertoBarros/lazyrspec "${RUN_ID}"

RUN_STATUS=$(gh run view --repo RobertoBarros/lazyrspec "${RUN_ID}" --json conclusion --jq '.conclusion')
if [ "${RUN_STATUS}" != "success" ]; then
  echo "CI failed (${RUN_STATUS}). Aborting tap update."
  exit 1
fi

echo "==> Pulling updated Formula from master..."
git pull origin master

echo "==> Updating homebrew-tap..."
cp "${PWD}/Formula/lazyrspec.rb" "${TAP_DIR}/Formula/lazyrspec.rb"
git -C "${TAP_DIR}" add Formula/lazyrspec.rb
git -C "${TAP_DIR}" commit -m "lazyrspec ${TAG}"
git -C "${TAP_DIR}" push origin master

echo ""
echo "Done! ${TAG} released."
