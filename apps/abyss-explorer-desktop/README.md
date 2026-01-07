# Abyss Explorer Desktop

A Qt6-based cross-platform desktop application for the Demiurge blockchain ecosystem.

## Features

- 🌐 Full Web3 browser without iframe restrictions
- 🔐 Native AbyssID integration with secure key storage
- 💰 Built-in wallet for CGT and DRC-369 assets
- 🖥️ System tray for quick access
- 🔄 Auto-update system
- 🎨 Native UI with dark theme

## Requirements

- Qt 6.5 or later with WebEngine
- CMake 3.16 or later
- C++17 compatible compiler

## Building

### Prerequisites

**Ubuntu/Debian:**
```bash
sudo apt install qt6-base-dev qt6-webengine-dev qt6-webchannel-dev cmake build-essential
```

**macOS:**
```bash
brew install qt@6
```

**Windows:**
Download and install Qt from [qt.io](https://www.qt.io/download) with the WebEngine component.

### Build Steps

1. **Build the web content first:**
   ```bash
   cd ../abyssos-portal
   pnpm install
   pnpm build
   cp -r dist ../abyss-explorer-desktop/web/
   ```

2. **Configure and build:**
   ```bash
   cd apps/abyss-explorer-desktop
   cmake -B build -DCMAKE_PREFIX_PATH=/path/to/Qt/6.5.0/gcc_64
   cmake --build build --config Release
   ```

3. **Run:**
   ```bash
   ./build/AbyssExplorer
   ```

## Project Structure

```
abyss-explorer-desktop/
├── CMakeLists.txt          # CMake configuration
├── src/
│   ├── main.cpp            # Entry point
│   ├── MainWindow.*        # Main window
│   ├── BrowserView.*       # WebEngine view
│   ├── SystemTray.*        # System tray
│   ├── AbyssIDManager.*    # AbyssID integration
│   ├── WalletBridge.*      # Wallet bridge
│   ├── UpdateManager.*     # Auto-updates
│   └── resources/          # Icons and assets
├── web/                    # Bundled AbyssOS (from abyssos-portal build)
├── installer/              # Installer scripts
└── README.md
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+T | New Tab |
| Ctrl+W | Close Tab |
| Ctrl+R | Reload |
| Ctrl+Q | Quit |
| F11 | Toggle Fullscreen |
| F12 | Developer Tools |
| Alt+Left | Back |
| Alt+Right | Forward |
| Alt+Home | Home |

## Creating Installers

### Windows (MSI)
```bash
cd installer
./scripts/build-installer.ps1
```

### macOS (DMG)
```bash
cd installer
./scripts/build-installer.sh --macos
```

### Linux (AppImage)
```bash
cd installer
./scripts/build-installer.sh --linux
```

## License

Part of the DEMIURGE project. See main LICENSE file.

---

*Navigate the Abyss, natively.*
