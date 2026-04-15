class Lazyrspec < Formula
  desc "A lazy TUI for running RSpec tests"
  homepage "https://github.com/RobertoBarros/lazyrspec"
  version "0.1.24"
  license "MIT"

  bottle :unneeded

  on_macos do
    on_arm do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.24/lazyrspec-0.1.24-darwin-arm64.tar.gz"
      sha256 "e04909ff40eccbbbb9260c0600ddb1483277676b85dc188c2079f38a39a372fa"
    end

    on_intel do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.24/lazyrspec-0.1.24-darwin-x86_64.tar.gz"
      sha256 "4950a44ac80c0f429b30b4b97c59b83f9f79f92d73e627c67ace0fc788d21438"
    end
  end

  on_linux do
    on_arm do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.24/lazyrspec-0.1.24-linux-arm64.tar.gz"
      sha256 "edc1a1ac7d66b928bff92e881a047597e2bb88ce39c9dbcb6f906715cdf811d0"
    end

    on_intel do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.24/lazyrspec-0.1.24-linux-x86_64.tar.gz"
      sha256 "a1ce60958a6a72e2eed178a3bdf8745d848422cd352c42c260f48a63870cf77e"
    end
  end

  def install
    bin.install "lazyrspec"
  end

  test do
    assert_predicate bin/"lazyrspec", :executable?
  end
end
