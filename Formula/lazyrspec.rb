class Lazyrspec < Formula
  desc "A lazy TUI for running RSpec tests"
  homepage "https://github.com/RobertoBarros/lazyrspec"
  version "0.1.22"
  license "MIT"

  on_macos do
    on_arm do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.22/lazyrspec-0.1.22-darwin-arm64.tar.gz"
      sha256 "58923a79003b1c83ed9bcb7f08b5c438ee0b4f0c878e63db1d530e4fa2cb57ff"
    end

    on_intel do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.22/lazyrspec-0.1.22-darwin-x86_64.tar.gz"
      sha256 "6bbe9249bd1d75a0a6d7a146dff448a2e0c3ecbccf4c77a1a9c3a673b974fe38"
    end
  end

  on_linux do
    on_arm do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.22/lazyrspec-0.1.22-linux-arm64.tar.gz"
      sha256 "a11b847a8046bf04f3a367fe73c803562fece844e1f1336f9a364b923dc5ef4b"
    end

    on_intel do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.22/lazyrspec-0.1.22-linux-x86_64.tar.gz"
      sha256 "d324abcda970864df148fb23ad1164c2f2fa55cf552320ddf55c3dc3cea6f029"
    end
  end

  def install
    bin.install "lazyrspec"
  end

  test do
    assert_predicate bin/"lazyrspec", :executable?
  end
end
