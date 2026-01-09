#!/usr/bin/env bash
# TORRNT - libtorrent Installation Script for Linux/macOS

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}  TORRNT - libtorrent Installation${NC}"
echo -e "${CYAN}========================================${NC}\n"

# Detect OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
else
    echo -e "${RED}Unsupported OS: $OSTYPE${NC}"
    exit 1
fi

echo -e "${CYAN}Detected OS: $OS${NC}\n"

# Linux installation
if [ "$OS" == "linux" ]; then
    echo -e "${CYAN}Installing libtorrent-rasterbar-dev...${NC}"
    
    if command -v apt-get &> /dev/null; then
        sudo apt-get update
        sudo apt-get install -y libtorrent-rasterbar-dev
    elif command -v yum &> /dev/null; then
        sudo yum install -y libtorrent-rasterbar-devel
    elif command -v pacman &> /dev/null; then
        sudo pacman -S --noconfirm libtorrent-rasterbar
    elif command -v dnf &> /dev/null; then
        sudo dnf install -y libtorrent-rasterbar-devel
    else
        echo -e "${RED}Unsupported package manager. Please install libtorrent-rasterbar-dev manually.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓ libtorrent-rasterbar-dev installed${NC}"

# macOS installation
elif [ "$OS" == "macos" ]; then
    echo -e "${CYAN}Installing libtorrent-rasterbar via Homebrew...${NC}"
    
    if ! command -v brew &> /dev/null; then
        echo -e "${RED}Homebrew not found. Please install Homebrew first:${NC}"
        echo -e "${YELLOW}  /bin/bash -c `"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)`"${NC}"
        exit 1
    fi
    
    brew install libtorrent-rasterbar
    
    echo -e "${GREEN}✓ libtorrent-rasterbar installed${NC}"
fi

echo -e "\n${GREEN}Installation complete!${NC}"
echo -e "${YELLOW}You can now build TORRNT:${NC}"
echo -e "  cd apps/torrnt"
echo -e "  mkdir build && cd build"
echo -e "  cmake .. -DCMAKE_PREFIX_PATH=~/Qt/6.10.1/gcc_64"
echo -e "  cmake --build . --config Release"
