class Lazyrspec < Formula
  desc "A lazy TUI for running RSpec tests"
  homepage "https://github.com/RobertoBarros/lazyrspec"
  version "0.1.34"
  license "MIT"

  on_macos do
    on_arm do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.34/lazyrspec-0.1.34-darwin-arm64.tar.gz"
      sha256 "b212727fd5ff450ce30b4690cf8b26415900d0e34a77624eb86fd466b21033a1"
    end

    on_intel do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.34/lazyrspec-0.1.34-darwin-x86_64.tar.gz"
      sha256 "bb717a6a6ae57b408218cfe5faf95d814b2ab6fb018d06eb8dfe8481094ad423"
    end
  end

  on_linux do
    on_arm do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.34/lazyrspec-0.1.34-linux-arm64.tar.gz"
      sha256 "8d29385f472ea6d7850ab77568a19468fce5d5be1cdec96d8a11727c5004522d"
    end

    on_intel do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.34/lazyrspec-0.1.34-linux-x86_64.tar.gz"
      sha256 "e56c8cc0cd108e9c9f5db99e3bc1379c52ffeaed800cab51c799692ae98a1f41"
    end
  end

  def install
    bin.install "lazyrspec"
  end

  test do
    assert_predicate bin/"lazyrspec", :executable?
  end
end
