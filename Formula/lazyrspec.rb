class Lazyrspec < Formula
  desc "A lazy TUI for running RSpec tests"
  homepage "https://github.com/RobertoBarros/lazyrspec"
  url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.4/lazyrspec-0.1.4-darwin-arm64.tar.gz"
  sha256 "febc5d340ef244ea6a45d641c0f2156ef3f6fa734ba934b5df24ded48bca81ed"
  version "0.1.4"
  license "MIT"

  def install
    bin.install "lazyrspec"
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/lazyrspec --version", 2)
  end
end
