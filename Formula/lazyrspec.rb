class Lazyrspec < Formula
  desc "A lazy TUI for running RSpec tests"
  homepage "https://github.com/RobertoBarros/lazyrspec"
  version "1.0.0"
  license "MIT"

  on_macos do
    on_arm do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v1.0.0/lazyrspec-1.0.0-darwin-arm64.tar.gz"
      sha256 "c7bb7b6486a1177b4d4f01f42f96f07a745319baf1f907b15b8b23529e63ce07"
    end

    on_intel do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v1.0.0/lazyrspec-1.0.0-darwin-x86_64.tar.gz"
      sha256 "efac8f6f106b2a87a303e118bdfb47df4f3d015a0b40561a94685971aa414966"
    end
  end

  on_linux do
    on_arm do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v1.0.0/lazyrspec-1.0.0-linux-arm64.tar.gz"
      sha256 "8163ac15159a26a578b8a7a9e4690f48d397eb0e1fe55ff1bbad7799a1960660"
    end

    on_intel do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v1.0.0/lazyrspec-1.0.0-linux-x86_64.tar.gz"
      sha256 "776c5aac697360440bed27b8a52c43c519ed33ec1b5298b21129c69ad9166cae"
    end
  end

  def install
    bin.install "lazyrspec"
  end

  test do
    assert_predicate bin/"lazyrspec", :executable?
  end
end
