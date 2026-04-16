# lazyrspec

TUI for running and browsing RSpec test results.

## Install dependencies

```bash
bun install
```

## Run

```bash
bun start
```

With a specific spec path:

```bash
bun start spec/calculator_spec.rb
```

With watch mode:

```bash
bun --watch src/index.ts
```

## Test

```bash
bun test
```

## Build binary

```bash
bun run build
sudo mv lazyrspec /usr/local/bin/
```

## Release

```bash
bash scripts/release.sh <version>
# Example: bash scripts/release.sh 1.0.0
```

This script:
1. Creates and pushes an annotated tag `v<version>`
2. CI builds signed binaries for darwin-arm64, darwin-x86_64, linux-x86_64, linux-arm64
3. CI creates a GitHub Release with tarballs and updates `Formula/lazyrspec.rb` on master
4. Script pulls the updated formula and pushes it to the Homebrew tap
