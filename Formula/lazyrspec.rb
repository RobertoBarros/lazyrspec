class Lazyrspec < Formula
  desc "A lazy TUI for running RSpec tests"
  homepage "https://github.com/RobertoBarros/lazyrspec"
  version "0.1.36"
  license "MIT"

  on_macos do
    on_arm do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.36/lazyrspec-0.1.36-darwin-arm64.tar.gz"
      sha256 "e27e83ad1893b663e3951d7b462ee8711c322ea1b61cfb52833ca5f63c66fd8f"
    end

    on_intel do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.36/lazyrspec-0.1.36-darwin-x86_64.tar.gz"
      sha256 "65062e510b3bd167b452c90fccb21e41b5c5d5080a5c1d07429176eacd7009e0"
    end
  end

  on_linux do
    on_arm do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.36/lazyrspec-0.1.36-linux-arm64.tar.gz"
      sha256 "4494587e299be3197129f099930cac418d9fcb9dcc64bf8dca75290296aa8025"
    end

    on_intel do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.36/lazyrspec-0.1.36-linux-x86_64.tar.gz"
      sha256 "a8e3dcfe6ad6c931f6cd8cab7ae8ef2130cf617e4b58c9e6058cfc16322237d7"
    end
  end

  def install
    bin.install "lazyrspec"
  end

  test do
    assert_predicate bin/"lazyrspec", :executable?
  end
end
