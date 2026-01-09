# DEMIURGE ARM64 Operating System

**Custom operating system for Raspberry Pi 5 running the complete Demiurge Blockchain ecosystem**

This project creates a complete, installable operating system image for Raspberry Pi 5 that includes:
- Demiurge Chain node (ARM64 native)
- All web applications (portal-web, qloud-os)
- Desktop applications (QOR Desktop, Genesis Launcher)
- All services (QorID Service, DNS Service, Indexer)
- System services and auto-startup
- Genesis theme and branding

## Architecture

```
┌─────────────────────────────────────────────────┐
│         DEMIURGE ARM64 OS (Raspberry Pi 5)      │
├─────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐            │
│  │  Chain Node  │  │   Indexer    │            │
│  │  (Rust)      │  │  (Node.js)   │            │
│  └──────────────┘  └──────────────┘            │
│  ┌──────────────┐  ┌──────────────┐            │
│  │ QorID Service│  │ DNS Service  │            │
│  │  (Node.js)    │  │  (Node.js)   │            │
│  └──────────────┘  └──────────────┘            │
│  ┌──────────────┐  ┌──────────────┐            │
│  │ Portal Web   │  │  QLOUD OS    │            │
│  │  (Next.js)   │  │  (Vite)      │            │
│  └──────────────┘  └──────────────┘            │
│  ┌──────────────┐  ┌──────────────┐            │
│  │ QOR Desktop  │  │   TORRNT     │            │
│  │  (Qt/QML)    │  │  (Qt/QML)    │            │
│  └──────────────┘  └──────────────┘            │
└─────────────────────────────────────────────────┘
```

## Prerequisites

### Host Machine (for building)
- Ubuntu 22.04+ or Debian 12+ (or WSL2 on Windows)
- Docker (for image building)
- QEMU (for ARM64 emulation)
- 50GB+ free disk space
- Internet connection

### Target Hardware
- **Raspberry Pi 5** (8GB RAM recommended)
- **64GB+ microSD card** (Class 10 or better)
- Power supply (5V 5A recommended)
- Ethernet connection (for initial setup)

## Quick Start

### 1. Build the OS Image

```bash
cd arm64-os
./scripts/build-image.sh
```

This will:
- Download Raspberry Pi OS Lite (ARM64)
- Install all dependencies
- Cross-compile Rust chain for ARM64
- Build all Node.js applications
- Build Qt applications for ARM64
- Create systemd services
- Generate bootable image

### 2. Flash to SD Card

```bash
# On Linux/macOS
sudo ./scripts/flash-image.sh /dev/sdX  # Replace X with your SD card

# On Windows (using Raspberry Pi Imager or similar)
# Use the generated demiurge-arm64.img file
```

### 3. Boot Raspberry Pi

1. Insert SD card into Raspberry Pi 5
2. Connect Ethernet cable
3. Power on
4. Wait 2-3 minutes for first boot
5. Access via:
   - **Web UI**: http://raspberrypi.local (or IP address)
   - **SSH**: `ssh demiurge@raspberrypi.local` (password: `demiurge`)
   - **Desktop**: If HDMI connected, full QOR Desktop environment

## Components

### Core Services

| Service | Port | Description |
|---------|------|-------------|
| Chain Node | 8545 | JSON-RPC API |
| Indexer | 4000 | GraphQL Gateway |
| QorID Service | 8082 | Identity & Auth |
| DNS Service | 53 | Blockchain DNS |
| Portal Web | 3000 | Landing page |
| QLOUD OS | 5173 | Web desktop |

### Desktop Applications

- **QOR Desktop** - Full desktop environment
- **Genesis Launcher** - Application launcher
- **TORRNT** - Torrenting client

## Building Individual Components

### Cross-compile Chain (ARM64)

```bash
cd arm64-os/scripts
./cross-compile-chain.sh
```

### Build Qt Applications (ARM64)

```bash
cd arm64-os/scripts
./build-qt-apps.sh
```

### Build Node.js Applications

```bash
cd arm64-os/scripts
./build-node-apps.sh
```

## Customization

### Change Default Password

Edit `arm64-os/image/customize.sh` and modify the password setup.

### Modify Services

Edit systemd service files in `arm64-os/systemd/`

### Change Network Configuration

Edit `arm64-os/image/network-config` for static IP or custom network settings.

## Development

### Test in QEMU

```bash
./scripts/test-qemu.sh
```

This runs the image in QEMU for testing without physical hardware.

### Debugging

SSH into the Pi and check logs:

```bash
# Chain logs
journalctl -u demiurge-chain -f

# All services
journalctl -u demiurge-* -f

# System logs
dmesg | tail
```

## Performance

### Recommended Settings

- **CPU Governor**: `performance` (for mining)
- **GPU Memory**: 128MB (sufficient for desktop)
- **Overclock**: Optional (Pi 5 can handle 2.4GHz+)

### Resource Usage

- **Idle**: ~500MB RAM, 5% CPU
- **Full Node**: ~2GB RAM, 20-40% CPU
- **Mining**: 80-100% CPU (all cores)

## Troubleshooting

### Image Won't Boot

1. Verify SD card is properly formatted
2. Check power supply (needs 5V 5A)
3. Try different SD card (some cards incompatible)

### Services Not Starting

1. Check systemd status: `systemctl status demiurge-chain`
2. Check logs: `journalctl -u demiurge-chain`
3. Verify dependencies installed

### Network Issues

1. Check Ethernet connection
2. Verify network-config settings
3. Check DHCP server availability

## Security

### First Boot

- Default user: `demiurge`
- Default password: `demiurge` (CHANGE IMMEDIATELY)
- SSH enabled by default
- Firewall configured (UFW)

### Hardening

Run after first boot:

```bash
sudo ./scripts/harden-system.sh
```

This will:
- Change default password
- Configure firewall
- Set up SSH keys
- Enable automatic updates
- Configure fail2ban

## License

Part of the Demiurge Blockchain ecosystem.
