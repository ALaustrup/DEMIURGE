# Quick Start Guide - DEMIURGE ARM64 OS

## Option 1: Pre-built Image (Recommended)

1. **Download the image** (when available)
2. **Flash to SD card** using Raspberry Pi Imager or `dd`
3. **Boot Raspberry Pi 5**
4. **Done!** All services start automatically

## Option 2: Build Image Yourself

### On Linux/WSL

```bash
cd arm64-os
./scripts/build-image.sh
```

### On Windows

Use WSL2 or a Linux VM:

```bash
# In WSL2
cd /mnt/c/Repos/DEMIURGE/arm64-os
./scripts/build-image.sh
```

## Option 3: Build on Raspberry Pi

If you already have Raspberry Pi OS installed:

```bash
# Clone repository
git clone https://github.com/ALaustrup/DEMIURGE.git
cd DEMIURGE/arm64-os

# Run build script
./scripts/build-on-pi.sh
```

## First Boot

1. **Insert SD card** into Raspberry Pi 5
2. **Connect Ethernet** (WiFi can be configured later)
3. **Power on**
4. **Wait 2-3 minutes** for first boot
5. **Access via**:
   - Web: `http://raspberrypi.local` or `http://<IP-ADDRESS>`
   - SSH: `ssh demiurge@raspberrypi.local` (password: `demiurge`)

## Change Default Password

**IMPORTANT**: Change the default password immediately!

```bash
ssh demiurge@raspberrypi.local
passwd
```

## Verify Services

```bash
# Check all services
systemctl status demiurge-*

# View logs
journalctl -u demiurge-chain -f
journalctl -u demiurge-indexer -f
```

## Access Web Interfaces

- **Portal**: http://raspberrypi.local
- **QLOUD OS**: http://raspberrypi.local/qloud
- **GraphQL**: http://raspberrypi.local/graphql

## Next Steps

1. **Configure mining** (if desired)
2. **Set up wallet**
3. **Create QOR ID**
4. **Start using Demiurge!**

## Troubleshooting

### Can't connect via SSH

1. Check Ethernet connection
2. Find IP address: `arp -a | grep raspberrypi`
3. Try: `ssh demiurge@<IP-ADDRESS>`

### Services not running

```bash
# Check status
sudo systemctl status demiurge-chain

# View logs
sudo journalctl -u demiurge-chain -n 50

# Restart service
sudo systemctl restart demiurge-chain
```

### Low performance

- Use SSD via USB 3.0 (much faster than microSD)
- Overclock CPU (edit `/boot/config.txt`)
- Increase GPU memory split if not using desktop

## Support

- **Documentation**: See `arm64-os/README.md`
- **Architecture**: See `arm64-os/ARCHITECTURE.md`
- **Issues**: GitHub Issues
