# Abyss Explorer - Web3 Browser

> *Navigate. Connect. Discover.*

A full-featured Web2+Web3 browser integrated with AbyssID and the Demiurge blockchain ecosystem.

---

## Table of Contents

1. [Overview](#overview)
2. [Core Features](#core-features)
3. [Web3 Integration](#web3-integration)
4. [User Interface](#user-interface)
5. [Technical Architecture](#technical-architecture)
6. [Implementation Phases](#implementation-phases)
7. [Development Progress](#development-progress)

---

## Overview

Abyss Explorer is more than a browser—it's your gateway to the decentralized web. With native AbyssID integration, EIP-1193 compliant Web3 provider, and seamless Demiurge blockchain connectivity, it bridges traditional web browsing with the new world of Web3.

### Key Features

- **Multi-Tab Browsing**: Full-featured tab management
- **Customizable Navigation**: Position nav bar top/bottom/left/right
- **EIP-1193 Provider**: Compatible with all Ethereum dApps
- **AbyssID Integration**: One-click authentication
- **DRC-369 Detection**: Automatic recognition of DRC-369 content
- **Bookmarks & History**: Full browsing history with sync
- **Privacy Focused**: No tracking, your data stays yours

---

## Core Features

### Browser Features
- Multi-tab interface with tab management
- Back/forward navigation with history
- Address bar with autocomplete
- Search engine integration (DuckDuckGo, Google, Brave)
- Bookmarks with folders
- Browsing history with search
- Customizable home page
- Internal pages (abyss://home, abyss://settings, abyss://history)

### Navigation Bar
- **Positions**: Top, bottom, left, or right
- **Compact Mode**: Icon-only display
- **Customizable**: Drag-and-drop arrangement

### Web3 Features
- EIP-1193 compliant `window.ethereum` provider
- `window.abyss` extended API
- DRC-369 asset detection
- dApp permission modal
- Transaction signing
- Message signing

---

## Web3 Integration

### EIP-1193 Provider

Abyss Explorer injects a full EIP-1193 compliant provider:

```javascript
// Standard Ethereum methods work
const accounts = await window.ethereum.request({ 
  method: 'eth_requestAccounts' 
});

// Signing messages
const signature = await window.ethereum.request({
  method: 'personal_sign',
  params: [message, account]
});

// Chain info
const chainId = await window.ethereum.request({ 
  method: 'eth_chainId' 
});
```

### Abyss Extended API

```javascript
// AbyssID identity
const address = await window.abyss.getAddress();

// DRC-369 assets
const assets = await window.abyss.drc369.list();

// Chain status
const status = await window.abyss.getChainStatus();
```

### Permission System

When a dApp requests permissions, users see:

```
┌─────────────────────────────────────────────────────────────────┐
│                     Connection Request                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   🌐 example-dapp.com wants to connect                          │
│                                                                  │
│   Requested permissions:                                         │
│   ☑ 👤 View Accounts (low risk)                                 │
│   ☑ ✍️ Sign Messages (medium risk)                              │
│   ☐ 💸 Send Transactions (high risk)                            │
│                                                                  │
│   ☐ Remember this choice                                         │
│                                                                  │
│              [Reject]                [Connect]                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## User Interface

### Browser Layout (Top Nav)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Tab 1 × | Tab 2 × | Tab 3 × | +                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│  ← → ↻ 🏠 | 🔒 https://example.com                    | Web3 | ⭐ | ⚙️     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                                                                              │
│                           WEB CONTENT                                        │
│                                                                              │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│  @username | ⬢ #12345                                                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Browser Layout (Left Nav - Vertical)

```
┌────────┬────────────────────────────────────────────────────────────────────┐
│  ← →   │                                                                    │
│  ↻ 🏠  │                                                                    │
│────────│                                                                    │
│  🔒    │                                                                    │
│ [URL]  │                      WEB CONTENT                                   │
│────────│                                                                    │
│ Tab 1◀│                                                                    │
│ Tab 2  │                                                                    │
│ Tab 3  │                                                                    │
│  + New │                                                                    │
│────────│                                                                    │
│  📚 ⚙️ │                                                                    │
└────────┴────────────────────────────────────────────────────────────────────┘
```

### Home Page (abyss://home)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│                              🌊                                              │
│                        Abyss Explorer                                        │
│              Navigate the Demiurge Network with Web3                        │
│                                                                              │
│         ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐                     │
│         │ OpenSea│  │Uniswap │  │Etherscan│ │DefiLlama│                    │
│         └────────┘  └────────┘  └────────┘  └────────┘                     │
│                                                                              │
│                    ● Connected     ⬢ Block #12345                           │
│                                                                              │
│         Recent Bookmarks:                                                    │
│         • My DeFi Dashboard                                                  │
│         • NFT Collection                                                     │
│                                                                              │
│         💡 Tip: Press ⚙️ to customize nav bar position                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Technical Architecture

### Component Structure

```
src/components/desktop/apps/
├── AbyssExplorerApp.tsx           # Main browser application
├── explorer/
│   ├── ExplorerNavBar.tsx         # Unified navigation bar
│   ├── ExplorerTabBar.tsx         # Tab management
│   ├── ExplorerNavigation.tsx     # Navigation controls
│   ├── ExplorerBookmarks.tsx      # Bookmarks panel
│   ├── PermissionModal.tsx        # dApp permission requests
│   └── index.ts                   # Exports
├── services/
│   ├── browser/
│   │   └── browserStore.ts        # Zustand store for browser state
│   └── web3Bridge/
│       ├── abyssBridge.ts         # PostMessage bridge
│       ├── web3Injector.ts        # Injection script
│       └── eip1193Provider.ts     # EIP-1193 implementation
```

### State Management

```typescript
interface BrowserState {
  tabs: BrowserTab[];
  activeTabId: string | null;
  history: HistoryEntry[];
  bookmarks: Bookmark[];
  bookmarkFolders: BookmarkFolder[];
  homePage: string;
  searchEngine: 'duckduckgo' | 'google' | 'brave';
  navPosition: 'top' | 'bottom' | 'left' | 'right';
  compactMode: boolean;
}
```

---

## Implementation Phases

### Phase 1: Core Browser ✅
- [x] Multi-tab management
- [x] Navigation (back/forward/refresh/home)
- [x] Address bar with URL handling
- [x] Search engine integration
- [x] Internal pages

### Phase 2: Customization ✅
- [x] Customizable nav position (top/bottom/left/right)
- [x] Compact mode
- [x] Settings persistence
- [x] Theme support

### Phase 3: Bookmarks & History ✅
- [x] Bookmark management
- [x] Bookmark folders
- [x] Browsing history
- [x] History search
- [x] Autocomplete suggestions

### Phase 4: Web3 Integration ✅
- [x] EIP-1193 provider injection
- [x] window.abyss API
- [x] Permission modal
- [x] Web3 detection
- [x] DRC-369 detection

### Phase 5: Polish (In Progress)
- [ ] Tab drag-and-drop reordering
- [ ] Right-click context menus
- [ ] Download manager
- [ ] Print support

**Status: ~90% Complete**

---

## Development Progress

### Current Status: 🟢 Mostly Complete

| Phase | Status | Progress | Notes |
|-------|--------|----------|-------|
| Phase 1: Core Browser | 🟢 Complete | 100% | All features working |
| Phase 2: Customization | 🟢 Complete | 100% | Nav positioning done |
| Phase 3: Bookmarks & History | 🟢 Complete | 100% | Full implementation |
| Phase 4: Web3 Integration | 🟢 Complete | 100% | EIP-1193 + Abyss API |
| Phase 5: Polish | 🟡 In Progress | 50% | Minor features remaining |

---

## Desktop Version

The Qt-based desktop version of Abyss Explorer provides:

- **Native Performance**: QtWebEngine for fast rendering
- **No iframe Restrictions**: Full access to all websites
- **System Integration**: Tray icon, notifications
- **Keyboard Shortcuts**: Full keyboard navigation
- **Auto-Updates**: Built-in update system

See [Abyss Desktop Suite](./ABYSS_DESKTOP_SUITE.md) for desktop app details.

---

*Abyss Explorer - Your window to Web3.*
