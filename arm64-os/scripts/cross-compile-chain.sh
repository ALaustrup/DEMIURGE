#!/usr/bin/env bash
# Cross-compile Demiurge Chain for ARM64 (Raspberry Pi 5)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
CHAIN_DIR="$PROJECT_ROOT/chain"
BUILD_DIR="$PROJECT_ROOT/arm64-os/build/chain-arm64"

echo "=========================================="
echo "  Cross-compiling Demiurge Chain (ARM64)"
echo "=========================================="

# Install cross-compilation toolchain
if ! command -v aarch64-linux-gnu-gcc &> /dev/null; then
    echo "Installing ARM64 cross-compilation toolchain..."
    sudo apt-get update
    sudo apt-get install -y gcc-aarch64-linux-gnu g++-aarch64-linux-gnu
fi

# Install Rust target
rustup target add aarch64-unknown-linux-gnu

# Install cross-compilation linker
mkdir -p ~/.cargo
cat >> ~/.cargo/config.toml <<EOF
[target.aarch64-unknown-linux-gnu]
linker = "aarch64-linux-gnu-gcc"
EOF

# Build for ARM64
cd "$CHAIN_DIR"
echo "Building chain for ARM64..."
cargo build --release --target aarch64-unknown-linux-gnu

# Copy binary
mkdir -p "$BUILD_DIR"
cp target/aarch64-unknown-linux-gnu/release/demiurge-chain "$BUILD_DIR/"

echo "=========================================="
echo "  Build complete!"
echo "  Binary: $BUILD_DIR/demiurge-chain"
echo "=========================================="
