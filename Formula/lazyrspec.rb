class Lazyrspec < Formula
  desc "A lazy TUI for running RSpec tests"
  homepage "https://github.com/RobertoBarros/lazyrspec"
  url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.5/lazyrspec-0.1.5-darwin-arm64.tar.gz"
  sha256 "757b96190d821df4477874f6dda542e61033c4c3db726b1957ed553cbed4f980"
  version "0.1.5"
  license "MIT"

  def install
    bin.install "lazyrspec"
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/lazyrspec --version", 2)
  end
end
