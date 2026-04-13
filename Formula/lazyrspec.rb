class Lazyrspec < Formula
  desc "A lazy TUI for running RSpec tests"
  homepage "https://github.com/RobertoBarros/lazyrspec"
  url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.6/lazyrspec-0.1.6-darwin-arm64.tar.gz"
  sha256 "fd00a09e227210400523ae881403a0fc480e06d611b5c7e729485f2cdb97b3ab"
  version "0.1.6"
  license "MIT"

  def install
    bin.install "lazyrspec"
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/lazyrspec --version", 2)
  end
end
