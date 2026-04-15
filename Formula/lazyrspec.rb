class Lazyrspec < Formula
  desc "A lazy TUI for running RSpec tests"
  homepage "https://github.com/RobertoBarros/lazyrspec"
  version "0.1.30"
  license "MIT"

  on_macos do
    on_arm do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.30/lazyrspec-0.1.30-darwin-arm64.tar.gz"
      sha256 "6063eb03fa7eebd875f9f4d6c0131d524df3a26ce56a057e47102ddf4ce68db6"
    end

    on_intel do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.30/lazyrspec-0.1.30-darwin-x86_64.tar.gz"
      sha256 "e55c943b22e906ab53574959d25ff73deb9d7bc689f9e31ef140102b21761ef0"
    end
  end

  on_linux do
    on_arm do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.30/lazyrspec-0.1.30-linux-arm64.tar.gz"
      sha256 "f88e85aba780553a4410c696568ea70b0a0fa76b062384e74cd548d3d359b017"
    end

    on_intel do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.30/lazyrspec-0.1.30-linux-x86_64.tar.gz"
      sha256 "926b30bab6c75d08005aa9cf67f48d8226b8e08f68e059c853ab7212033cc4bf"
    end
  end

  def install
    bin.install "lazyrspec"
  end

  test do
    assert_predicate bin/"lazyrspec", :executable?
  end
end
