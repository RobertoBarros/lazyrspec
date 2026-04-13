class Lazyrspec < Formula
  desc "A lazy TUI for running RSpec tests"
  homepage "https://github.com/RobertoBarros/lazyrspec"
  url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.7/lazyrspec-0.1.7-darwin-arm64.tar.gz"
  sha256 "2c442457d3ebff9a626dbf25dfff4511e38d99752b89915155e94c3c5b8a27f2"
  version "0.1.7"
  license "MIT"

  def install
    bin.install "lazyrspec"
  end

  test do
    assert_predicate bin/"lazyrspec", :executable?
  end
end
