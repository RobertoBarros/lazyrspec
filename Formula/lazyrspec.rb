class Lazyrspec < Formula
  desc "A lazy TUI for running RSpec tests"
  homepage "https://github.com/RobertoBarros/lazyrspec"
  url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.2/lazyrspec-0.1.2-darwin-arm64.tar.gz"
  sha256 "2e3e03871c59f5a99a9babbb6167183a266d3c0d92cf35d7afe85e4562f8f7ae"
  version "0.1.2"
  license "MIT"

  def install
    bin.install "lazyrspec"
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/lazyrspec --version", 2)
  end
end
