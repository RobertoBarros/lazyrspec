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
