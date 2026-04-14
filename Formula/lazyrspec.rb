class Lazyrspec < Formula
  desc "A lazy TUI for running RSpec tests"
  homepage "https://github.com/RobertoBarros/lazyrspec"
  version "0.1.18"
  license "MIT"

  on_arm do
    url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.18/lazyrspec-0.1.18-darwin-arm64.tar.gz"
    sha256 "d37d5ea4c5fc4b63db436e6a1343632ff975fd59a8446f7bc6d88deb220c950c"
  end

  on_intel do
    url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.18/lazyrspec-0.1.18-darwin-x86_64.tar.gz"
    sha256 "cffdce3f16a84cf44f30780d139d7cb80478a31fb5ab49c60b244b0fd9eab14a"
  end

  def install
    bin.install "lazyrspec"
  end

  test do
    assert_predicate bin/"lazyrspec", :executable?
  end
end
