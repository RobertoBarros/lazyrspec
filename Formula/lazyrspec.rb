class Lazyrspec < Formula
  desc "A lazy TUI for running RSpec tests"
  homepage "https://github.com/RobertoBarros/lazyrspec"
  url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.0/lazyrspec-0.1.0-darwin-arm64.tar.gz"
  sha256 "e5b1cf1105efe4dc220e0fbacc2014dfed190cd272e2211cdef66718e7015f00"
  version "0.1.0"
  license "MIT"

  def install
    bin.install "lazyrspec"
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/lazyrspec --version", 2)
  end
end
