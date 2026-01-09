#!/usr/bin/env bash
# Build Qt applications for ARM64 (Raspberry Pi 5)
# This should be run on the Pi itself or in a chroot/container

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

echo "=========================================="
echo "  Building Qt Applications (ARM64)"
echo "=========================================="

# Check Qt installation
if ! command -v qmake6 &> /dev/null && ! command -v qmake &> /dev/null; then
    echo "Qt not found. Installing Qt 6..."
    sudo apt-get update
    sudo apt-get install -y \
        qt6-base-dev \
        qt6-declarative-dev \
        qt6-quick-dev \
        qt6-tools-dev \
        cmake \
        build-essential
fi

QMAKE=$(command -v qmake6 || command -v qmake)
echo "Using Qt: $QMAKE"

# Build each Qt application
APPS=("genesis-launcher" "qor-desktop" "torrnt")

for APP in "${APPS[@]}"; do
    APP_DIR="$PROJECT_ROOT/apps/$APP"
    if [ ! -d "$APP_DIR" ]; then
        echo "Skipping $APP (not found)"
        continue
    fi
    
    echo "Building $APP..."
    cd "$APP_DIR"
    
    # Create build directory
    mkdir -p build-arm64
    cd build-arm64
    
    # Configure with CMake
    cmake .. \
        -DCMAKE_BUILD_TYPE=Release \
        -DCMAKE_PREFIX_PATH=$(dirname $(dirname $QMAKE))
    
    # Build
    cmake --build . --config Release -j$(nproc)
    
    echo "$APP built successfully"
done

echo "=========================================="
echo "  All Qt applications built!"
echo "=========================================="
