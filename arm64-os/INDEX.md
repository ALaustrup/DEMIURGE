# DEMIURGE ARM64 OS - Documentation Index

Complete documentation for the DEMIURGE ARM64 Operating System for Raspberry Pi 5.

## 📚 Documentation Files

### Getting Started

| Document | Description | When to Use |
|----------|-------------|-------------|
| **[README.md](README.md)** | Overview and quick start | First time reading about the project |
| **[QUICKSTART.md](QUICKSTART.md)** | Fast setup guide | Want to get running quickly |
| **[INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)** | Detailed installation steps | Step-by-step installation help |

### Building

| Document | Description | When to Use |
|----------|-------------|-------------|
| **[BUILD_WINDOWS.md](BUILD_WINDOWS.md)** | Building on Windows/WSL | Building image on Windows |
| **[FLASH_IMAGE.md](FLASH_IMAGE.md)** | Flashing to SD card | Ready to flash the image |

### Reference

| Document | Description | When to Use |
|----------|-------------|-------------|
| **[ARCHITECTURE.md](ARCHITECTURE.md)** | Technical architecture | Understanding system design |
| **[DOCUMENTATION.md](DOCUMENTATION.md)** | Complete system reference | Need detailed information |
| **[FAQ.md](FAQ.md)** | Common questions | Troubleshooting or questions |

## 🚀 Quick Navigation

### I want to...

**...get started quickly:**
→ Read [QUICKSTART.md](QUICKSTART.md)

**...install the OS:**
→ Read [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)

**...build the image:**
→ Read [BUILD_WINDOWS.md](BUILD_WINDOWS.md) (Windows) or [README.md](README.md) (Linux)

**...flash to SD card:**
→ Read [FLASH_IMAGE.md](FLASH_IMAGE.md)

**...understand the architecture:**
→ Read [ARCHITECTURE.md](ARCHITECTURE.md)

**...configure services:**
→ Read [DOCUMENTATION.md](DOCUMENTATION.md) → Configuration section

**...troubleshoot issues:**
→ Read [FAQ.md](FAQ.md) or [DOCUMENTATION.md](DOCUMENTATION.md) → Troubleshooting

**...develop or customize:**
→ Read [DOCUMENTATION.md](DOCUMENTATION.md) → Development section

## 📖 Documentation Structure

```
arm64-os/
├── README.md              # Overview and quick start
├── INDEX.md               # This file - documentation index
├── QUICKSTART.md          # Fast setup guide
├── INSTALLATION_GUIDE.md  # Detailed installation
├── BUILD_WINDOWS.md       # Windows build instructions
├── FLASH_IMAGE.md         # SD card flashing guide
├── ARCHITECTURE.md        # Technical architecture
├── DOCUMENTATION.md       # Complete reference
└── FAQ.md                 # Frequently asked questions
```

## 🎯 Common Tasks

### First Time Setup

1. Read [README.md](README.md) for overview
2. Follow [QUICKSTART.md](QUICKSTART.md) for quick setup
3. Or [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md) for detailed steps

### Building the Image

- **Windows**: [BUILD_WINDOWS.md](BUILD_WINDOWS.md)
- **Linux/WSL**: [README.md](README.md) → Building section

### Flashing to SD Card

- [FLASH_IMAGE.md](FLASH_IMAGE.md) - Complete guide with Raspberry Pi Imager

### Configuration

- [DOCUMENTATION.md](DOCUMENTATION.md) → Configuration section
- Service configs: `/etc/demiurge/`
- Systemd services: `systemd/` directory

### Troubleshooting

- [FAQ.md](FAQ.md) - Common questions
- [DOCUMENTATION.md](DOCUMENTATION.md) → Troubleshooting section

### Development

- [DOCUMENTATION.md](DOCUMENTATION.md) → Development section
- [ARCHITECTURE.md](ARCHITECTURE.md) - System design

## 🔍 Finding Information

### By Topic

**Installation:**
- [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)
- [QUICKSTART.md](QUICKSTART.md)
- [FLASH_IMAGE.md](FLASH_IMAGE.md)

**Configuration:**
- [DOCUMENTATION.md](DOCUMENTATION.md) → Configuration
- [ARCHITECTURE.md](ARCHITECTURE.md) → Component Architecture

**Services:**
- [DOCUMENTATION.md](DOCUMENTATION.md) → Services
- [ARCHITECTURE.md](ARCHITECTURE.md) → Component Architecture

**Networking:**
- [DOCUMENTATION.md](DOCUMENTATION.md) → Networking
- [ARCHITECTURE.md](ARCHITECTURE.md) → Network Architecture

**Security:**
- [DOCUMENTATION.md](DOCUMENTATION.md) → Security
- [FAQ.md](FAQ.md) → Security questions

**Performance:**
- [DOCUMENTATION.md](DOCUMENTATION.md) → Performance
- [ARCHITECTURE.md](ARCHITECTURE.md) → Performance Optimizations

**Troubleshooting:**
- [FAQ.md](FAQ.md)
- [DOCUMENTATION.md](DOCUMENTATION.md) → Troubleshooting

## 📝 Documentation Standards

All documentation follows these conventions:

- **Code blocks**: Use appropriate syntax highlighting
- **Commands**: Show exact commands with expected output
- **Paths**: Use absolute paths where possible
- **Warnings**: Highlight important security/risk information
- **Examples**: Provide real, working examples

## 🤝 Contributing to Documentation

Found an error or want to improve documentation?

1. Edit the relevant `.md` file
2. Follow existing formatting
3. Test all commands/examples
4. Submit a pull request

## 📞 Support

- **Documentation Issues**: GitHub Issues
- **Technical Questions**: See [FAQ.md](FAQ.md)
- **Bug Reports**: GitHub Issues with logs

## 🔄 Documentation Updates

Documentation is updated with each release. Check the version history in each document for changes.

---

**Last Updated**: 2026-01-09  
**Version**: 1.0.0
