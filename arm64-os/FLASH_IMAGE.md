# Flashing DEMIURGE ARM64 OS Image

## Using Raspberry Pi Imager (Recommended)

Raspberry Pi Imager is the easiest and safest way to flash the DEMIURGE ARM64 OS image to your SD card.

### Step 1: Download Raspberry Pi Imager

1. Download from: https://www.raspberrypi.com/software/
2. Install on Windows, macOS, or Linux
3. Launch the application

### Step 2: Prepare SD Card

1. **Insert SD card** into your computer (via card reader)
2. **Backup any important data** (the card will be erased)
3. **Minimum size**: 64GB recommended (32GB minimum)
4. **Speed**: Class 10 or better (UHS-I/UHS-II)

### Step 3: Flash the Image

#### Option A: Use Custom Image (After Build Completes)

1. **Open Raspberry Pi Imager**
2. Click **"Choose OS"**
3. Scroll down and select **"Use custom image"**
4. Navigate to: `C:\Repos\DEMIURGE\arm64-os\build\`
5. Select: `demiurge-arm64-YYYYMMDD.img`
6. Click **"Choose Storage"**
7. Select your SD card
8. Click **"Write"** (the gear icon)
9. **Optional**: Click the gear icon to configure:
   - **Hostname**: `demiurge-pi` (or your choice)
   - **Enable SSH**: ✅ (with password authentication)
   - **Username**: `demiurge`
   - **Password**: Set a secure password
   - **WiFi**: Configure if desired
   - **Locale settings**: Set timezone, keyboard layout
10. Click **"Save"**
11. Click **"Write"** to start flashing
12. Wait for completion (5-15 minutes depending on SD card speed)

#### Option B: Use Pre-built Image (When Available)

1. Download the pre-built image from releases
2. Follow Option A steps above

### Step 4: Verify Flash

After flashing completes:

1. **Eject SD card safely**
2. **Re-insert** to verify it's readable
3. You should see a `boot` partition (FAT32)

### Step 5: Boot Raspberry Pi 5

1. **Insert SD card** into Raspberry Pi 5
2. **Connect Ethernet cable** (for initial setup)
3. **Connect HDMI** (optional, for display)
4. **Connect keyboard/mouse** (optional, for desktop)
5. **Power on** Raspberry Pi 5
6. **Wait 2-3 minutes** for first boot

### Step 6: First Boot Configuration

#### Via SSH (Recommended)

1. Find the Pi's IP address:
   ```bash
   # On Windows (PowerShell)
   arp -a | findstr "raspberrypi"
   
   # Or check your router's DHCP client list
   ```

2. SSH into the Pi:
   ```powershell
   ssh demiurge@raspberrypi.local
   # Or: ssh demiurge@<IP-ADDRESS>
   # Password: (the one you set, or 'demiurge' if not changed)
   ```

3. Change default password:
   ```bash
   passwd
   ```

#### Via Web Interface

1. Open browser: `http://raspberrypi.local`
2. Or use IP: `http://<IP-ADDRESS>`
3. You should see the Demiurge Portal

## Alternative: Command Line (Advanced)

### On Windows (WSL)

```bash
# In WSL
cd /mnt/c/Repos/DEMIURGE/arm64-os/build

# Find your SD card device (be careful!)
lsblk
# Look for device like /dev/sdb or /dev/sdc

# Flash (replace sdX with your device)
sudo dd if=demiurge-arm64-*.img of=/dev/sdX bs=4M status=progress

# Sync and eject
sync
sudo eject /dev/sdX
```

### On Linux/macOS

```bash
# Find SD card
diskutil list  # macOS
lsblk          # Linux

# Flash (replace /dev/rdiskX with your device)
sudo dd if=demiurge-arm64-*.img of=/dev/rdiskX bs=4M status=progress

# Sync
sync
```

## Troubleshooting

### Image Not Found

- **Build still running**: Wait for build to complete
- **Wrong path**: Check `C:\Repos\DEMIURGE\arm64-os\build\`
- **File extension**: Look for `.img` files

### SD Card Not Detected

- Try different USB port/card reader
- Check SD card is properly inserted
- Try different SD card
- Some card readers have compatibility issues

### Flash Fails

- **Verify image integrity**: Re-download or rebuild
- **Try different SD card**: Some cards are incompatible
- **Use different tool**: Try `dd` or `balenaEtcher`
- **Check disk space**: Ensure enough free space

### Pi Won't Boot

1. **Check power supply**: Needs 5V 5A (official supply recommended)
2. **Check SD card**: Try different card
3. **Check connections**: HDMI, Ethernet
4. **Check LED**: Should blink during boot
5. **Try different image**: Verify image is for Pi 5 (ARM64)

### Can't Connect via SSH

1. **Wait longer**: First boot takes 2-3 minutes
2. **Check Ethernet**: Must be connected for SSH
3. **Find IP address**: Check router DHCP list
4. **Try mDNS**: `raspberrypi.local` or `demiurge-pi.local`
5. **Check firewall**: Disable Windows firewall temporarily

### Services Not Running

```bash
# SSH into Pi
ssh demiurge@raspberrypi.local

# Check service status
sudo systemctl status demiurge-chain
sudo systemctl status demiurge-indexer

# View logs
sudo journalctl -u demiurge-chain -n 50
sudo journalctl -u demiurge-indexer -n 50

# Restart services
sudo systemctl restart demiurge-chain
sudo systemctl restart demiurge-indexer
```

## Post-Installation

### 1. Secure the System

```bash
# Change password
passwd

# Set up SSH keys (recommended)
ssh-copy-id demiurge@raspberrypi.local

# Disable password authentication (after keys work)
sudo nano /etc/ssh/sshd_config
# Set: PasswordAuthentication no
sudo systemctl restart ssh
```

### 2. Configure Mining (Optional)

```bash
# Edit chain config
sudo nano /etc/demiurge/chain.toml

# Enable mining
mining_enabled = true
mining_threads = 4  # Use all cores on Pi 5
```

### 3. Set Up Wallet

Access via web interface:
- Portal: `http://raspberrypi.local`
- Create QOR ID
- Generate wallet
- Fund with CGT

### 4. Performance Tuning

```bash
# Overclock (optional, in /boot/config.txt)
sudo nano /boot/config.txt
# Add: arm_freq=2400
# Add: over_voltage=6

# Use SSD (recommended)
# Connect USB 3.0 SSD
# Move chain data: sudo mv /var/lib/demiurge/chain /mnt/ssd/chain
# Update config: data_dir = "/mnt/ssd/chain"
```

## Support

- **Documentation**: See `arm64-os/README.md`
- **Architecture**: See `arm64-os/ARCHITECTURE.md`
- **Issues**: GitHub Issues
