# DEMIURGE ARM64 OS Architecture

## Overview

The DEMIURGE ARM64 Operating System is a custom Linux distribution based on Raspberry Pi OS (Debian) that includes the complete Demiurge Blockchain ecosystem pre-installed and configured.

## Base System

- **OS**: Raspberry Pi OS Lite (64-bit)
- **Kernel**: Linux 6.x (ARM64)
- **Init System**: systemd
- **Package Manager**: apt (Debian)

## Component Architecture

### 1. Demiurge Chain (`/opt/demiurge/chain`)

**Language**: Rust  
**Build**: Cross-compiled for ARM64  
**Binary**: `demiurge-chain`  
**Service**: `demiurge-chain.service`

**Features**:
- Native ARM64 binary (optimized for Pi 5)
- RocksDB storage (SSD recommended for performance)
- JSON-RPC server on port 8545
- Forge PoW mining (uses all CPU cores)

**Storage**:
- Chain data: `/var/lib/demiurge/chain`
- Config: `/etc/demiurge/chain.toml`
- Logs: `/var/log/demiurge/chain.log`

### 2. Indexer (`/opt/demiurge/indexer`)

**Language**: TypeScript/Node.js  
**Runtime**: Node.js 20+ (ARM64)  
**Service**: `demiurge-indexer.service`

**Features**:
- GraphQL API on port 4000
- Real-time block indexing
- Database: SQLite (can upgrade to PostgreSQL)

**Storage**:
- Index data: `/var/lib/demiurge/indexer`
- Config: `/etc/demiurge/indexer.json`

### 3. Web Applications

#### Portal Web (`/opt/demiurge/apps/portal-web`)
- **Framework**: Next.js 15+
- **Port**: 3000
- **Service**: `demiurge-portal.service`
- **Reverse Proxy**: Nginx

#### QLOUD OS (`/opt/demiurge/apps/qloud-os`)
- **Framework**: Vite + React
- **Port**: 5173
- **Service**: `demiurge-qloud.service`
- **Reverse Proxy**: Nginx

### 4. Desktop Applications

#### QOR Desktop (`/opt/demiurge/apps/qor-desktop`)
- **Framework**: Qt 6.10+ (ARM64)
- **Display**: X11 or Wayland
- **Service**: `demiurge-qor-desktop.service` (optional, can run as user)

#### Genesis Launcher (`/opt/demiurge/apps/genesis-launcher`)
- **Framework**: Qt 6.10+ (ARM64)
- **Purpose**: Application launcher and updater

#### TORRNT (`/opt/demiurge/apps/torrnt`)
- **Framework**: Qt 6.10+ (ARM64)
- **Dependencies**: libtorrent-rasterbar (ARM64)

### 5. Services

#### QorID Service (`/opt/demiurge/apps/qorid-service`)
- **Language**: TypeScript/Node.js
- **Port**: 8082
- **Service**: `demiurge-qorid.service`

#### DNS Service (`/opt/demiurge/apps/dns-service`)
- **Language**: TypeScript/Node.js
- **Port**: 53 (requires root)
- **Service**: `demiurge-dns.service`

## File System Layout

```
/
├── opt/
│   └── demiurge/
│       ├── chain/              # Chain binary and runtime
│       ├── indexer/            # Indexer application
│       ├── apps/               # All applications
│       │   ├── portal-web/
│       │   ├── qloud-os/
│       │   ├── qor-desktop/
│       │   ├── genesis-launcher/
│       │   ├── torrnt/
│       │   ├── qorid-service/
│       │   └── dns-service/
│       └── scripts/            # Utility scripts
├── etc/
│   ├── demiurge/               # Configuration files
│   │   ├── chain.toml
│   │   ├── indexer.json
│   │   └── services.json
│   └── systemd/system/         # Systemd services
│       ├── demiurge-chain.service
│       ├── demiurge-indexer.service
│       └── ...
├── var/
│   ├── lib/demiurge/           # Data directories
│   │   ├── chain/              # Chain database
│   │   ├── indexer/            # Indexer database
│   │   └── wallets/            # Wallet storage
│   └── log/demiurge/           # Log files
└── home/
    └── demiurge/                # User home directory
        ├── .demiurge/           # User config
        └── Desktop/             # Desktop files
```

## Network Architecture

```
Internet
   │
   ├─── Nginx (Port 80/443)
   │    ├─── Portal Web (demiurge.guru)
   │    ├─── QLOUD OS (demiurge.cloud)
   │    └─── GraphQL API (api.demiurge.cloud)
   │
   ├─── Chain RPC (Port 8545)
   │    └─── JSON-RPC 2.0 API
   │
   └─── DNS Service (Port 53)
        └─── Blockchain DNS resolver
```

## Process Management

All services run under systemd with:
- Auto-restart on failure
- Log rotation
- Resource limits
- Dependency management

## Resource Requirements

### Minimum (Light Node)
- **RAM**: 4GB
- **Storage**: 32GB (microSD)
- **CPU**: All 4 cores
- **Network**: 10 Mbps

### Recommended (Full Node + Mining)
- **RAM**: 8GB
- **Storage**: 64GB+ (SSD via USB 3.0 recommended)
- **CPU**: All 4 cores (overclocked)
- **Network**: 100 Mbps

### Optimal (Validator Node)
- **RAM**: 8GB
- **Storage**: 128GB+ SSD
- **CPU**: Overclocked to 2.4GHz+
- **Network**: 1 Gbps
- **Power**: 5V 5A supply

## Boot Process

1. **BIOS/UEFI**: Raspberry Pi firmware
2. **Bootloader**: Raspberry Pi bootloader
3. **Kernel**: Linux 6.x ARM64
4. **Init**: systemd
5. **Services**: All Demiurge services start automatically
6. **Desktop**: X11/Wayland (if display connected)

## Security Model

- **User**: `demiurge` (non-root for most operations)
- **Services**: Run as dedicated users where possible
- **Firewall**: UFW configured
- **SSH**: Key-based authentication recommended
- **Updates**: Automatic security updates enabled

## Performance Optimizations

### For Mining
- CPU governor set to `performance`
- Disable unnecessary services
- Overclock CPU/GPU
- Use SSD for chain storage

### For Desktop
- Enable hardware acceleration
- Optimize Qt rendering
- Use Wayland for better performance

### For Full Node
- Increase RocksDB cache
- Optimize network buffers
- Use faster storage (SSD)

## Monitoring

- **System**: `htop`, `systemctl status`
- **Chain**: RPC calls, log files
- **Services**: `journalctl -u service-name`
- **Network**: `iftop`, `netstat`

## Backup & Recovery

- **Chain Data**: `/var/lib/demiurge/chain` (backup regularly)
- **Wallets**: Encrypted backups in `/var/lib/demiurge/wallets`
- **Config**: All configs in `/etc/demiurge/`

## Future Enhancements

- [ ] Docker containerization option
- [ ] Kubernetes support for clustering
- [ ] Hardware wallet integration
- [ ] LCD display support (for status)
- [ ] GPIO integration (for custom hardware)
- [ ] Camera integration (for QR code scanning)
