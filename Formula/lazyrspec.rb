class Lazyrspec < Formula
  desc "A lazy TUI for running RSpec tests"
  homepage "https://github.com/RobertoBarros/lazyrspec"
  version "0.1.9"
  license "MIT"

  on_arm do
    url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.9/lazyrspec-0.1.9-darwin-arm64.tar.gz"
    sha256 "12ebceb49280c978d3b13b3cd1a74fb54fcc7bf6f0cc2af622c5503c947f0858"
  end

  on_intel do
    url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.9/lazyrspec-0.1.9-darwin-x86_64.tar.gz"
    sha256 ""
  end

  def install
    bin.install "lazyrspec"
  end

  test do
    assert_predicate bin/"lazyrspec", :executable?
  end
end
