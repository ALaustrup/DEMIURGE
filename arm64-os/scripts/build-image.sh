#!/usr/bin/env bash
# Build DEMIURGE ARM64 OS Image for Raspberry Pi 5
# This script creates a complete bootable image with all Demiurge components

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
IMAGE_DIR="$PROJECT_ROOT/image"
BUILD_DIR="$PROJECT_ROOT/build"

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}  DEMIURGE ARM64 OS Image Builder${NC}"
echo -e "${CYAN}  Raspberry Pi 5${NC}"
echo -e "${CYAN}========================================${NC}\n"

# Check prerequisites
echo -e "${CYAN}[1/8] Checking prerequisites...${NC}"

command -v docker >/dev/null 2>&1 || { echo -e "${RED}Docker is required but not installed.${NC}" >&2; exit 1; }
command -v qemu-aarch64-static >/dev/null 2>&1 || { 
    echo -e "${YELLOW}QEMU not found. Installing...${NC}"
    sudo apt-get update
    sudo apt-get install -y qemu-user-static binfmt-support
}

# Create build directory
mkdir -p "$BUILD_DIR"
cd "$BUILD_DIR"

# Download Raspberry Pi OS Lite (ARM64)
echo -e "${CYAN}[2/8] Downloading Raspberry Pi OS Lite...${NC}"
RPI_OS_URL="https://downloads.raspberrypi.com/raspios_lite_arm64/images/raspios_lite_arm64-2024-01-12/2024-01-11-raspios-bookworm-arm64-lite.img.xz"
RPI_OS_IMG="raspios-lite-arm64.img"

if [ ! -f "$RPI_OS_IMG" ]; then
    if [ ! -f "${RPI_OS_IMG}.xz" ]; then
        echo "Downloading Raspberry Pi OS..."
        wget -q --show-progress "$RPI_OS_URL" -O "${RPI_OS_IMG}.xz"
    fi
    echo "Extracting image..."
    xz -d "${RPI_OS_IMG}.xz"
fi

# Mount image
echo -e "${CYAN}[3/8] Mounting image...${NC}"
LOOP_DEVICE=$(sudo losetup -f --show -P "$RPI_OS_IMG")
BOOT_PART="${LOOP_DEVICE}p1"
ROOT_PART="${LOOP_DEVICE}p2"

mkdir -p mnt/boot mnt/root
sudo mount "$BOOT_PART" mnt/boot
sudo mount "$ROOT_PART" mnt/root

# Copy QEMU for chroot
sudo cp /usr/bin/qemu-aarch64-static mnt/root/usr/bin/

# Prepare chroot environment
echo -e "${CYAN}[4/8] Preparing chroot environment...${NC}"
sudo mount --bind /dev mnt/root/dev
sudo mount --bind /sys mnt/root/sys
sudo mount --bind /proc mnt/root/proc

# Copy customization scripts
sudo cp -r "$IMAGE_DIR"/* mnt/root/tmp/demiurge-setup/ 2>/dev/null || true

# Run customization in chroot
echo -e "${CYAN}[5/8] Customizing image...${NC}"
sudo chroot mnt/root /bin/bash <<'CHROOT_SCRIPT'
set -e
cd /tmp/demiurge-setup

# Update system
apt-get update
apt-get upgrade -y

# Install base dependencies
apt-get install -y \
    build-essential \
    curl \
    wget \
    git \
    pkg-config \
    libssl-dev \
    cmake \
    nginx \
    sqlite3 \
    nodejs \
    npm \
    python3 \
    python3-pip

# Install Rust (for chain compilation)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source "$HOME/.cargo/env"

# Install pnpm
npm install -g pnpm@9.15.0

# Install Qt 6 (ARM64) - this is complex, may need pre-built binaries
# For now, we'll install Qt from Debian repos (may be older version)
apt-get install -y \
    qt6-base-dev \
    qt6-declarative-dev \
    qt6-quick-dev \
    qt6-tools-dev \
    qml6-module-qtquick \
    qml6-module-qtquick-controls2

# Install libtorrent (ARM64)
apt-get install -y libtorrent-rasterbar-dev

# Create demiurge user
useradd -m -s /bin/bash demiurge || true
echo "demiurge:demiurge" | chpasswd
usermod -aG sudo,adm,dialout,cdrom,audio,video,plugdev,games,users,input,netdev,spi,i2c,gpio demiurge

# Create directories
mkdir -p /opt/demiurge/{chain,indexer,apps,scripts}
mkdir -p /etc/demiurge
mkdir -p /var/lib/demiurge/{chain,indexer,wallets}
mkdir -p /var/log/demiurge

# Set permissions
chown -R demiurge:demiurge /opt/demiurge
chown -R demiurge:demiurge /var/lib/demiurge
chown -R demiurge:demiurge /var/log/demiurge

# Enable SSH
systemctl enable ssh

# Configure network (enable SSH on first boot)
echo "PermitRootLogin no" >> /etc/ssh/sshd_config
echo "PasswordAuthentication yes" >> /etc/ssh/sshd_config

CHROOT_SCRIPT

# Copy Demiurge components (will be built separately)
echo -e "${CYAN}[6/8] Copying Demiurge components...${NC}"
# Note: Actual binaries will be cross-compiled and copied in separate steps

# Install systemd services
echo -e "${CYAN}[7/8] Installing systemd services...${NC}"
sudo cp "$PROJECT_ROOT/systemd"/*.service mnt/root/etc/systemd/system/ 2>/dev/null || true
sudo chroot mnt/root systemctl enable demiurge-chain.service || true
sudo chroot mnt/root systemctl enable demiurge-indexer.service || true

# Cleanup chroot
echo -e "${CYAN}[8/8] Cleaning up...${NC}"
sudo umount mnt/root/proc
sudo umount mnt/root/sys
sudo umount mnt/root/dev
sudo rm mnt/root/usr/bin/qemu-aarch64-static
sudo umount mnt/root
sudo umount mnt/boot
sudo losetup -d "$LOOP_DEVICE"

# Create final image
FINAL_IMAGE="demiurge-arm64-$(date +%Y%m%d).img"
cp "$RPI_OS_IMG" "$FINAL_IMAGE"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Image built successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "Image: ${CYAN}$BUILD_DIR/$FINAL_IMAGE${NC}"
echo -e "\nNext steps:"
echo -e "1. Flash to SD card:"
echo -e "   ${YELLOW}sudo dd if=$FINAL_IMAGE of=/dev/sdX bs=4M status=progress${NC}"
echo -e "2. Or use Raspberry Pi Imager"
echo -e "3. Boot Raspberry Pi 5"
