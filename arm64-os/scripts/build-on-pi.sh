#!/usr/bin/env bash
# Build Demiurge components directly on Raspberry Pi 5
# Use this if you prefer to build on the device itself

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

echo "=========================================="
echo "  Building Demiurge on Raspberry Pi 5"
echo "=========================================="

# Update system
echo "[1/6] Updating system..."
sudo apt-get update
sudo apt-get upgrade -y

# Install dependencies
echo "[2/6] Installing dependencies..."
sudo apt-get install -y \
    build-essential \
    curl \
    git \
    pkg-config \
    libssl-dev \
    cmake \
    nodejs \
    npm \
    python3 \
    python3-pip \
    qt6-base-dev \
    qt6-declarative-dev \
    qt6-quick-dev \
    qt6-tools-dev \
    libtorrent-rasterbar-dev

# Install Rust
echo "[3/6] Installing Rust..."
if ! command -v rustc &> /dev/null; then
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source "$HOME/.cargo/env"
fi

# Install pnpm
echo "[4/6] Installing pnpm..."
sudo npm install -g pnpm@9.15.0

# Build Chain
echo "[5/6] Building Demiurge Chain..."
cd "$PROJECT_ROOT/chain"
cargo build --release
sudo cp target/release/demiurge-chain /opt/demiurge/chain/
sudo chmod +x /opt/demiurge/chain/demiurge-chain

# Build Node.js applications
echo "[6/6] Building Node.js applications..."
cd "$PROJECT_ROOT"
pnpm install
pnpm build

# Copy applications
sudo mkdir -p /opt/demiurge/apps
sudo cp -r apps/portal-web /opt/demiurge/apps/
sudo cp -r apps/qloud-os /opt/demiurge/apps/
sudo cp -r apps/qorid-service /opt/demiurge/apps/
sudo cp -r apps/dns-service /opt/demiurge/apps/
sudo cp -r indexer /opt/demiurge/

# Install systemd services
echo "Installing systemd services..."
sudo cp "$PROJECT_ROOT/arm64-os/systemd"/*.service /etc/systemd/system/
sudo systemctl daemon-reload

echo "=========================================="
echo "  Build complete!"
echo "  Start services with: sudo systemctl start demiurge-chain"
echo "=========================================="
