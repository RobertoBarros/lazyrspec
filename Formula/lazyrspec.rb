class Lazyrspec < Formula
  desc "A lazy TUI for running RSpec tests"
  homepage "https://github.com/RobertoBarros/lazyrspec"
  url "https://github.com/RobertoBarros/lazyrspec/archive/refs/tags/v0.1.3.tar.gz"
  sha256 "PLACEHOLDER"
  version "0.1.3"
  license "MIT"

  depends_on "oven-sh/bun/bun" => :build

  def install
    system "bun", "install"
    system "bun", "build", "--compile", "./src/index.ts", "--outfile", "lazyrspec"
    bin.install "lazyrspec"
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/lazyrspec --version", 2)
  end
end
