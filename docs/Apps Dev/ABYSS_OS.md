# AbyssOS - Desktop Environment

> *Your Digital Realm.*

The complete desktop environment for the Demiurge blockchain ecosystem.

---

## Table of Contents

1. [Overview](#overview)
2. [Core Components](#core-components)
3. [Built-in Applications](#built-in-applications)
4. [Window Management](#window-management)
5. [System Services](#system-services)
6. [Technical Architecture](#technical-architecture)
7. [Development Progress](#development-progress)

---

## Overview

AbyssOS is a web-based desktop environment that provides a complete operating system experience within a browser. It serves as the primary interface for the Demiurge blockchain ecosystem, integrating identity, wallet, file management, and application hosting.

### Key Features

- **Window Manager**: Drag, resize, minimize, maximize windows
- **Status Bar**: System info, notifications, quick actions
- **Application Launcher**: Start menu and app search
- **File System**: Virtual file system with cloud sync
- **AbyssID Integration**: Sovereign identity throughout
- **Blockchain Services**: CGT wallet, staking, DRC-369

---

## Core Components

### Status Bar
- Current time and date
- Network status (Demiurge chain)
- AbyssID indicator
- Notification center
- Quick settings

### Window Manager
- Multiple window support
- Window snapping
- Z-ordering
- Minimize to taskbar
- Maximize/restore
- Close with confirmation

### Application Launcher
- Application grid
- Search functionality
- Categories
- Recent apps
- Favorites

### Taskbar
- Running applications
- Window preview on hover
- Click to focus/minimize

---

## Built-in Applications

### System Apps

| App | Description | Status |
|-----|-------------|--------|
| **Chain Ops** | Blockchain operations | 🟢 Complete |
| **Miner** | CGT mining interface | 🟢 Complete |
| **Wallet** | CGT & asset management | 🟢 Complete |
| **Block Explorer** | Chain explorer | 🟢 Complete |
| **System Monitor** | Resource monitoring | 🟢 Complete |

### Productivity Apps

| App | Description | Status |
|-----|-------------|--------|
| **Abyss Explorer** | Web3 browser | 🟢 Complete |
| **WRYT** | Document editor | 🔴 Planning |
| **CRAFT** | Code editor/IDE | 🟡 In Progress |
| **Abyss Calc** | Calculator | 🟢 Complete |

### Media Apps

| App | Description | Status |
|-----|-------------|--------|
| **NEON Player** | Audio player | 🟡 In Progress |
| **NEON Radio** | Radio stations | 🟢 Complete |

### Creative Apps

| App | Description | Status |
|-----|-------------|--------|
| **DRC-369 Studio** | NFT creation | 🟢 Complete |
| **AWE Atlas** | World building | 🟡 In Progress |
| **AWE Console** | AWE management | 🟡 In Progress |

### Communication Apps

| App | Description | Status |
|-----|-------------|--------|
| **Archon AI** | AI assistant | 🟢 Complete |
| **VYB Social** | Social platform | 🟡 In Progress |

### Developer Apps

| App | Description | Status |
|-----|-------------|--------|
| **Abyss Shell** | Terminal | 🟢 Complete |
| **Abyss Runtime** | App runtime | 🟢 Complete |
| **Genesis Console** | Admin tools | 🟢 Complete |

---

## Window Management

### Window Structure

```
┌─────────────────────────────────────────────────────────────┐
│  App Title                                    ─  □  ✕      │  ← Title bar
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                                                             │
│                     APPLICATION                             │
│                      CONTENT                                │
│                                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Behaviors
- **Drag**: Click and drag title bar
- **Resize**: Drag window edges
- **Minimize**: Click `─` or click taskbar
- **Maximize**: Click `□` or double-click title bar
- **Close**: Click `✕`
- **Snap**: Drag to screen edges

---

## System Services

### AbyssID Service
- Login/logout
- Session management
- Key storage
- Signature requests

### Wallet Service
- Balance queries
- Transaction signing
- Staking management
- Asset tracking

### File Service
- Virtual file system
- Cloud sync
- File operations
- Type associations

### Notification Service
- System notifications
- App notifications
- Permission requests
- Status updates

---

## Technical Architecture

### Component Structure

```
src/
├── routes/
│   └── Desktop.tsx              # Main desktop route
├── components/
│   ├── desktop/
│   │   ├── StatusBar.tsx        # Top status bar
│   │   ├── WindowFrame.tsx      # Window wrapper
│   │   ├── AppStoreMenu.tsx     # App launcher
│   │   └── apps/                # All applications
│   └── layout/
│       └── FullscreenContainer.tsx
├── state/
│   └── desktopStore.ts          # Desktop state
├── hooks/
│   ├── useAbyssID.ts            # Identity hook
│   ├── useChainStatus.ts        # Chain status
│   └── useDesktop.ts            # Desktop utilities
└── services/
    ├── identity/                # AbyssID service
    ├── wallet/                  # Wallet service
    └── vfs/                     # Virtual file system
```

### State Management

```typescript
interface DesktopState {
  // Windows
  openWindows: WindowState[];
  focusedWindowId: string | null;
  
  // Apps
  installedApps: AppDefinition[];
  pinnedApps: string[];
  recentApps: string[];
  
  // UI
  showLauncher: boolean;
  showNotifications: boolean;
  wallpaper: string;
  theme: 'dark' | 'light';
  
  // Actions
  openApp: (appId: string) => void;
  closeWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  maximizeWindow: (windowId: string) => void;
}
```

---

## Development Progress

### Current Status: 🟢 Active Development

| Component | Status | Progress | Notes |
|-----------|--------|----------|-------|
| Window Manager | 🟢 Complete | 100% | Full functionality |
| Status Bar | 🟢 Complete | 100% | All features working |
| App Launcher | 🟢 Complete | 100% | Search, categories |
| Taskbar | 🟢 Complete | 100% | Window preview |
| File Manager | 🟡 In Progress | 60% | Basic operations |
| Notifications | 🟡 In Progress | 70% | Display working |
| Settings | 🟡 In Progress | 50% | Basic settings |

### Overall: ~75% Complete

---

## Future Enhancements

- [ ] Multiple desktops/workspaces
- [ ] Window tiling (i3-style)
- [ ] Keyboard shortcuts system
- [ ] Drag and drop between apps
- [ ] Global search (Spotlight-style)
- [ ] Widget system
- [ ] Custom themes

---

*AbyssOS - Where your digital life begins.*
