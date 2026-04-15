class Lazyrspec < Formula
  desc "A lazy TUI for running RSpec tests"
  homepage "https://github.com/RobertoBarros/lazyrspec"
  version "0.1.33"
  license "MIT"

  on_macos do
    on_arm do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.33/lazyrspec-0.1.33-darwin-arm64.tar.gz"
      sha256 "3527c7d93d238780cbd254871f50efe1da8b719ff044fcf3de4a90840bad1877"
    end

    on_intel do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.33/lazyrspec-0.1.33-darwin-x86_64.tar.gz"
      sha256 "9cd4e5793a591a3c3689fa5d0644ebaae1d9503bd81f68a6caac66edb5de03e7"
    end
  end

  on_linux do
    on_arm do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.33/lazyrspec-0.1.33-linux-arm64.tar.gz"
      sha256 "eee696b2276ad119916024c96319273c2899999c12d079f8d5546e7835b3aa6c"
    end

    on_intel do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.33/lazyrspec-0.1.33-linux-x86_64.tar.gz"
      sha256 "b44055ee4252fb97d06b7a3675a3fbf7f8ace1ae72476989069e01829da13dd9"
    end
  end

  def install
    bin.install "lazyrspec"
    on_macos do
      system "codesign", "--sign", "-", "--force", "--no-strict", bin/"lazyrspec"
    end
  end

  test do
    assert_predicate bin/"lazyrspec", :executable?
  end
end
