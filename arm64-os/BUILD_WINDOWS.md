# Building DEMIURGE ARM64 OS on Windows

## Prerequisites

### 1. Install WSL2

```powershell
# Run as Administrator
wsl --install
```

After installation, **restart your computer**.

### 2. Install Docker Desktop for Windows

1. Download from: https://www.docker.com/products/docker-desktop
2. Install and enable WSL2 integration
3. Restart Docker Desktop

### 3. Install QEMU in WSL

Open WSL and run:

```bash
sudo apt-get update
sudo apt-get install -y qemu-user-static binfmt-support
```

## Building the Image

### Option 1: Using PowerShell Wrapper (Recommended)

```powershell
cd C:\Repos\DEMIURGE\arm64-os
.\scripts\build-image.ps1
```

This will:
- Check prerequisites
- Launch the build in WSL
- Handle path conversions automatically

### Option 2: Direct WSL Command

Open WSL and run:

```bash
cd /mnt/c/Repos/DEMIURGE/arm64-os
./scripts/build-image.sh
```

## Build Process

The build will:

1. **Download Raspberry Pi OS** (~500MB)
   - Downloads from official Raspberry Pi website
   - Extracts the image file

2. **Mount and Customize Image**
   - Mounts the image using loop devices
   - Sets up chroot environment
   - Installs all dependencies

3. **Install Dependencies**
   - Rust toolchain
   - Node.js and pnpm
   - Qt 6 (ARM64)
   - libtorrent
   - All system packages

4. **Build Components**
   - Cross-compile Rust chain
   - Build Node.js applications
   - Build Qt applications

5. **Configure System**
   - Set up systemd services
   - Configure networking
   - Set up firewall
   - Configure Nginx

6. **Create Final Image**
   - Unmount partitions
   - Create final bootable image

## Build Time

- **First build**: 1-2 hours (downloads + compilation)
- **Subsequent builds**: 30-60 minutes (if dependencies cached)

## Disk Space

- **Build directory**: ~10GB
- **Final image**: ~2-4GB (compressed)

## Troubleshooting

### WSL Not Found

```powershell
# Check WSL installation
wsl --list --verbose

# If not installed
wsl --install
```

### Docker Not Available in WSL

1. Open Docker Desktop
2. Go to Settings → Resources → WSL Integration
3. Enable integration with your WSL distro
4. Restart Docker Desktop

### Permission Denied

Some operations require sudo. The script will prompt for your WSL password.

### Out of Disk Space

```powershell
# Check WSL disk usage
wsl df -h

# Clean WSL disk
wsl --shutdown
# Then use Disk Cleanup or WSL disk management
```

### Build Fails

Check the error output. Common issues:

- **Network timeout**: Retry the build
- **Missing dependencies**: Script should install automatically
- **Disk space**: Free up space in WSL

## Alternative: Build on Raspberry Pi

If building on Windows is problematic, you can build directly on the Raspberry Pi:

```bash
# On Raspberry Pi
git clone https://github.com/ALaustrup/DEMIURGE.git
cd DEMIURGE/arm64-os
./scripts/build-on-pi.sh
```

This takes longer but avoids cross-compilation issues.

## Next Steps

After build completes:

1. **Flash to SD Card**
   - Use Raspberry Pi Imager (Windows)
   - Or: `wsl sudo dd if=build/demiurge-arm64-*.img of=/dev/sdX bs=4M status=progress`

2. **Boot Raspberry Pi 5**
   - Insert SD card
   - Power on
   - Wait 2-3 minutes

3. **Access**
   - Web: `http://raspberrypi.local`
   - SSH: `ssh demiurge@raspberrypi.local`
