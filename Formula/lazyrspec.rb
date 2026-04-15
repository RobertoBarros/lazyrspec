class Lazyrspec < Formula
  desc "A lazy TUI for running RSpec tests"
  homepage "https://github.com/RobertoBarros/lazyrspec"
  version "0.1.26"
  license "MIT"

  bottle :unneeded

  on_macos do
    on_arm do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.26/lazyrspec-0.1.26-darwin-arm64.tar.gz"
      sha256 "6f1cbe3376590053e47c2d793450428f860c323d318607c84674e61e0ac30624"
    end

    on_intel do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.26/lazyrspec-0.1.26-darwin-x86_64.tar.gz"
      sha256 "67b6b8b6f66820bb767d7ae99c47a141da1802ea5b33ae5d4dc7f6f946afeee4"
    end
  end

  on_linux do
    on_arm do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.26/lazyrspec-0.1.26-linux-arm64.tar.gz"
      sha256 "b63bdc22e3ff3bc36430382d847b16dde045d3592a3d7f7a1c2ea47c69f72073"
    end

    on_intel do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.26/lazyrspec-0.1.26-linux-x86_64.tar.gz"
      sha256 "1d162d05e545f9d72e4c94be04010bed8afe923629f276582e65fdca86ae4e6e"
    end
  end

  def install
    bin.install "lazyrspec"
  end

  test do
    assert_predicate bin/"lazyrspec", :executable?
  end
end
