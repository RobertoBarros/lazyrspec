class Lazyrspec < Formula
  desc "A lazy TUI for running RSpec tests"
  homepage "https://github.com/RobertoBarros/lazyrspec"
  url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.8/lazyrspec-0.1.8-darwin-arm64.tar.gz"
  sha256 "457f5c029a2b1e16bf9b668d95097cb077071e0aa63814f7c141867774355fef"
  version "0.1.8"
  license "MIT"

  def install
    bin.install "lazyrspec"
  end

  test do
    assert_predicate bin/"lazyrspec", :executable?
  end
end
