class Lazyrspec < Formula
  desc "A lazy TUI for running RSpec tests"
  homepage "https://github.com/RobertoBarros/lazyrspec"
  version "0.1.19"
  license "MIT"

  on_arm do
    url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.19/lazyrspec-0.1.19-darwin-arm64.tar.gz"
    sha256 "57bc55ff13a2b3b0f01e0c0874074329b258042929fdb8e364da59ed09f963e2"
  end

  on_intel do
    url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.19/lazyrspec-0.1.19-darwin-x86_64.tar.gz"
    sha256 "7426ccb5b163239012e5c82469a336efaa7678c6073a129779f10bad4f8a00a1"
  end

  def install
    bin.install "lazyrspec"
  end

  test do
    assert_predicate bin/"lazyrspec", :executable?
  end
end
