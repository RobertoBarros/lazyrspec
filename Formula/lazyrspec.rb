class Lazyrspec < Formula
  desc "A lazy TUI for running RSpec tests"
  homepage "https://github.com/RobertoBarros/lazyrspec"
  version "0.1.21"
  license "MIT"

  on_arm do
    url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.21/lazyrspec-0.1.21-darwin-arm64.tar.gz"
    sha256 "913b781bda81617488d1e2a284f5810e000d8478c0ec570a732c1953ad351416"
  end

  on_intel do
    url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.21/lazyrspec-0.1.21-darwin-x86_64.tar.gz"
    sha256 "f3aa6f7962b51ff4db7d11bbff5c4b6d85bbb92259d59fe1c8fb1471c98cec99"
  end

  def install
    bin.install "lazyrspec"
  end

  test do
    assert_predicate bin/"lazyrspec", :executable?
  end
end
