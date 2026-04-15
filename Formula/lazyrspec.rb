class Lazyrspec < Formula
  desc "A lazy TUI for running RSpec tests"
  homepage "https://github.com/RobertoBarros/lazyrspec"
  version "0.1.28"
  license "MIT"

  bottle :unneeded

  on_macos do
    on_arm do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.28/lazyrspec-0.1.28-darwin-arm64.tar.gz"
      sha256 "7325b191482171794b974fc8b3da7dbdbfad80b5b238398ccd5a553fb52691b7"
    end

    on_intel do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.28/lazyrspec-0.1.28-darwin-x86_64.tar.gz"
      sha256 "a7d23377a78a7533dd95610b4e378db375535fc2950bf25968675f851284bcf1"
    end
  end

  on_linux do
    on_arm do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.28/lazyrspec-0.1.28-linux-arm64.tar.gz"
      sha256 "8ccd08d102ce3c6fbef7ff833eb599e2ecb63eb27a5c6d2c0952968398b824ee"
    end

    on_intel do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.28/lazyrspec-0.1.28-linux-x86_64.tar.gz"
      sha256 "f0c22b7715aaa95ebae061f1682a7083bf0bb0ad890b55b2f241714725e7d85f"
    end
  end

  def install
    bin.install "lazyrspec"
  end

  test do
    assert_predicate bin/"lazyrspec", :executable?
  end
end
