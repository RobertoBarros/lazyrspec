class Lazyrspec < Formula
  desc "A lazy TUI for running RSpec tests"
  homepage "https://github.com/RobertoBarros/lazyrspec"
  version "0.1.35"
  license "MIT"

  on_macos do
    on_arm do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.35/lazyrspec-0.1.35-darwin-arm64.tar.gz"
      sha256 "446fe8bf3a53e8772de04de8cf33b785326e9b25279c3ac9e5d832123dcef2a8"
    end

    on_intel do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.35/lazyrspec-0.1.35-darwin-x86_64.tar.gz"
      sha256 "339017516face5b30544a941f59fef66fc78e6ce1a09d72ea68b72fd5281a89d"
    end
  end

  on_linux do
    on_arm do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.35/lazyrspec-0.1.35-linux-arm64.tar.gz"
      sha256 "20be6e59b5c8ab10cb8d200a21ce63f1a505fc47cf36584781001b40d8d8bd2e"
    end

    on_intel do
      url "https://github.com/RobertoBarros/lazyrspec/releases/download/v0.1.35/lazyrspec-0.1.35-linux-x86_64.tar.gz"
      sha256 "7c6c45e05675cc41943bcbaa28d5024e928b74718414bcb518e4a9c8439927a3"
    end
  end

  def install
    bin.install "lazyrspec"
  end

  test do
    assert_predicate bin/"lazyrspec", :executable?
  end
end
