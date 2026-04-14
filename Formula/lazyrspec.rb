class Lazyrspec < Formula
  desc "A lazy TUI for running RSpec tests"
  homepage "https://github.com/RobertoBarros/lazyrspec"
  version "0.1.20"
  license "MIT"

  on_arm do
    url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.20/lazyrspec-0.1.20-darwin-arm64.tar.gz"
    sha256 "f73a26a6b5440f043e2709b37081a93fbe5ba937f847d737ed04453c94708fc5"
  end

  on_intel do
    url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.20/lazyrspec-0.1.20-darwin-x86_64.tar.gz"
    sha256 "eb3fa3ae5ebdfd99489c48da2889fbfd774235a2e119c411db55b3d4a0987ebf"
  end

  def install
    bin.install "lazyrspec"
  end

  test do
    assert_predicate bin/"lazyrspec", :executable?
  end
end
