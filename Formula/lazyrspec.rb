class Lazyrspec < Formula
  desc "A lazy TUI for running RSpec tests"
  homepage "https://github.com/RobertoBarros/lazyrspec"
  version "0.1.29"
  license "MIT"

  on_macos do
    on_arm do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.29/lazyrspec-0.1.29-darwin-arm64.tar.gz"
      sha256 "340522a4314c888bd6390fb08507aafbe0d5e5213800d308ed0f1269c78f2526"
    end

    on_intel do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.29/lazyrspec-0.1.29-darwin-x86_64.tar.gz"
      sha256 "af036bf9b4fb562efa77c941ed5431c8bc6e81b0f5ca3a0e188a71e46a7cb89c"
    end
  end

  on_linux do
    on_arm do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.29/lazyrspec-0.1.29-linux-arm64.tar.gz"
      sha256 "0e54e34497f94ff6c1b1ef8619a99a4e0accd1b550ca9309d8af8257eec121c1"
    end

    on_intel do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.29/lazyrspec-0.1.29-linux-x86_64.tar.gz"
      sha256 "eae4d5a8188f2bf3ecab36e5f9fa36e590b96a348a0c7ee41bf03574bed51bbc"
    end
  end

  def install
    bin.install "lazyrspec"
  end

  test do
    assert_predicate bin/"lazyrspec", :executable?
  end
end
