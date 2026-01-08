# Abyss Desktop Suite

A comprehensive multi-application desktop experience for the Demiurge ecosystem.

## Overview

The Abyss Desktop Suite transforms the desktop application from a single browser into a versatile productivity platform. Users can seamlessly switch between different application modes:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ABYSS DESKTOP SUITE                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │            │  │            │  │            │  │            │            │
│  │  ABYSS OS  │  │  EXPLORER  │  │   NEON     │  │   CRAFT    │            │
│  │   (Full)   │  │  (Browser) │  │  (Media)   │  │   (IDE)    │            │
│  │            │  │            │  │            │  │            │            │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘            │
│                                                                              │
│  ┌────────────┐                                                             │
│  │            │                                                             │
│  │   DOCS     │  + Future applications...                                   │
│  │  (Editor)  │                                                             │
│  │            │                                                             │
│  └────────────┘                                                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Application Modes

### 1. QOR OS (Full Desktop)
The complete QOR OS experience with all applications, taskbar, windows, and the full blockchain ecosystem.

**Features:**
- Complete desktop environment
- All QOR OS applications
- File management
- System settings
- Full QorID integration

### 2. QOR Explorer (Web Browser)
Standalone Web3 browser mode for focused web browsing.

**Features:**
- Multi-tab browsing
- Bookmarks & history
- EIP-1193 Web3 provider
- dApp permission management
- Customizable nav position

### 3. NEON (Media Center)
Full-featured media player and streaming platform.

**Features:**
- Local media playback (video, audio, images)
- Streaming integration
- DRC-369 media assets
- Playlists & library management
- Radio stations
- Visualizer modes

### 4. CRAFT (IDE)
Professional code editor and development environment.

**Features:**
- Multi-language syntax highlighting
- File tree explorer
- Integrated terminal
- Git integration
- DRC-369 project publishing
- Smart contract development

### 5. Abyss Docs (Document Editor)
Professional word processing and document creation.

**Features:**
- Rich text editing
- Multiple format support
- Cloud sync via QorID
- Collaboration features
- Export to PDF/DOCX/ODT

---

## Application Selector UI

### Launcher Design

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│                      ABYSS SUITE                            │
│                                                              │
│    ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐      │
│    │   🌊    │  │   🔍    │  │   🎵    │  │   ⚡    │      │
│    │         │  │         │  │         │  │         │      │
│    │ Abyss   │  │ Explorer│  │  NEON   │  │ CRAFT   │      │
│    │   OS    │  │         │  │         │  │         │      │
│    └─────────┘  └─────────┘  └─────────┘  └─────────┘      │
│                                                              │
│    ┌─────────┐                                               │
│    │   📝    │                                               │
│    │         │                                               │
│    │  Docs   │                                               │
│    │         │                                               │
│    └─────────┘                                               │
│                                                              │
│                    [ Launch ]                                │
│                                                              │
│    ☑ Remember my choice    ☑ Launch at startup              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Quick Switcher (⌘/Ctrl + Space)

```
┌───────────────────────────────────────┐
│  Switch Application                    │
├───────────────────────────────────────┤
│  🌊  QOR OS        ⌘1              │
│  🔍  Explorer        ⌘2              │
│  🎵  NEON           ⌘3              │
│  ⚡  CRAFT          ⌘4              │
│  📝  Docs           ⌘5              │
├───────────────────────────────────────┤
│  [Settings]  [Quit]                   │
└───────────────────────────────────────┘
```

---

## Architecture

### Qt Desktop Implementation

```cpp
// AppSuite.h
class AppSuite : public QMainWindow {
    Q_OBJECT

public:
    enum AppMode {
        QOR OS,
        Explorer,
        Neon,
        Craft,
        Docs
    };

    void switchToApp(AppMode mode);
    AppMode currentApp() const;

signals:
    void appSwitched(AppMode newApp);

private:
    QStackedWidget *m_appStack;
    AppLauncher *m_launcher;
    QuickSwitcher *m_quickSwitcher;
    
    // Individual app views
    QOR OSView *m_abyssOS;
    ExplorerView *m_explorer;
    NeonView *m_neon;
    CraftView *m_craft;
    DocsView *m_docs;
};
```

### State Persistence

Each application maintains its own state:

```json
{
  "lastApp": "explorer",
  "rememberChoice": true,
  "appStates": {
    "explorer": {
      "tabs": [...],
      "bookmarks": [...]
    },
    "neon": {
      "playlist": [...],
      "volume": 0.8
    },
    "craft": {
      "openFiles": [...],
      "workspace": "/path/to/project"
    },
    "docs": {
      "recentFiles": [...],
      "autoSave": true
    }
  }
}
```

---

## NEON Media Player Expansion

### Current Features (QOR OS)
- Basic audio playback
- Radio stations
- DRC-369 audio assets

### Expanded Features

#### Video Playback
```
Supported Formats:
├── Video: MP4, MKV, AVI, MOV, WebM, FLV, WMV
├── Audio: MP3, FLAC, WAV, OGG, AAC, M4A, OPUS
├── Images: JPEG, PNG, GIF, WebP, BMP, TIFF
└── Playlists: M3U, PLS, XSPF
```

#### Library Management
```
┌─────────────────────────────────────────────────────────────┐
│  NEON Library                                    ≡  ⚙️  ✕  │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐                                           │
│  │ 🎵 Music     │  Recently Added                          │
│  │ 🎬 Videos    │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐        │
│  │ 📷 Photos    │  │     │ │     │ │     │ │     │        │
│  │ 🎨 DRC-369   │  │ ▶️  │ │ ▶️  │ │ ▶️  │ │ ▶️  │        │
│  │ 📻 Radio     │  └─────┘ └─────┘ └─────┘ └─────┘        │
│  │ 📋 Playlists │                                          │
│  └──────────────┘  Your Playlists                          │
│                    • Favorites (23)                        │
│                    • Workout Mix (15)                      │
│                    • Chill Vibes (42)                      │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┤
│  │ ▶️ ⏮️ ⏸️ ⏭️ 🔀 🔁    Now Playing: Track Name     2:34/4:21 │
│  │ ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬○▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬    🔊 ▬▬▬▬▬▬○▬▬ │
│  └─────────────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────────┘
```

#### Video Player Mode
```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│                                                              │
│                      ┌─────────────┐                        │
│                      │             │                        │
│                      │    VIDEO    │                        │
│                      │   CONTENT   │                        │
│                      │             │                        │
│                      └─────────────┘                        │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  ▶️  ▬▬▬▬▬▬▬▬▬▬▬○▬▬▬▬▬▬▬▬▬▬▬▬  1:23:45 / 2:15:00  🔊 ⛶ │
└─────────────────────────────────────────────────────────────┘
```

#### Streaming Integration
- YouTube playback (via youtube-dl/yt-dlp)
- IPFS media streaming
- DRC-369 media marketplace
- Live streams

---

## CRAFT IDE Expansion

### Current Features (QOR OS)
- Basic code editor
- Syntax highlighting
- File browser

### Expanded Features

#### Full IDE Layout
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CRAFT IDE                                              ─  □  ✕            │
├─────────────────────────────────────────────────────────────────────────────┤
│  File  Edit  View  Run  Terminal  Git  Help                                │
├──────────────────┬──────────────────────────────────────┬──────────────────┤
│  📁 Explorer      │  main.rs × | lib.rs × | Cargo.toml  │  🔍 Search       │
│  ├── src/         │  ─────────────────────────────────  │                  │
│  │   ├── main.rs  │  1  fn main() {                     │  Found 3 results │
│  │   └── lib.rs   │  2      println!("Hello, Abyss!");  │  main.rs:12      │
│  ├── Cargo.toml   │  3  }                               │  lib.rs:45       │
│  └── README.md    │  4                                  │  test.rs:78      │
│                   │  5  #[cfg(test)]                    │                  │
│  🔗 DRC-369       │  6  mod tests {                     │  📋 Problems     │
│  ├── Publish      │  7      #[test]                     │  ⚠ 2 warnings   │
│  └── Verify       │  8      fn it_works() {             │  ❌ 0 errors     │
│                   │  9          assert_eq!(2+2, 4);     │                  │
│  🌿 Git           │  10     }                           │  🔧 Output       │
│  └── main         │  11 }                               │  Compiled ok     │
│      ├── ↑3 ↓1    │                                     │                  │
├──────────────────┴──────────────────────────────────────┴──────────────────┤
│  Terminal                                                                   │
│  $ cargo build                                                              │
│  Compiling abyss-app v0.1.0                                                │
│  Finished dev [unoptimized + debuginfo] target(s) in 2.34s                 │
│  $                                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Language Support
```
Languages:
├── Systems: Rust, C, C++, Go
├── Web: TypeScript, JavaScript, HTML, CSS, SCSS
├── Scripts: Python, Ruby, Lua, Shell
├── Smart Contracts: Solidity, Move, Ink!
├── Config: JSON, YAML, TOML, XML
└── Documentation: Markdown, RST
```

#### Features
- **Monaco Editor** (VS Code's editor)
- **LSP Support** (Language Server Protocol)
- **Git Integration** (commit, push, pull, diff)
- **Integrated Terminal** (with shell)
- **DRC-369 Publishing** (mint code as NFTs)
- **Smart Contract Tooling** (compile, deploy, test)
- **Project Templates** (web app, service, contract)
- **Extensions System** (plugins)

---

## Abyss Docs - Word Processor

### Overview
A professional document editor for writers, content creators, and business users.

### UI Design
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Abyss Docs                                             ─  □  ✕            │
├─────────────────────────────────────────────────────────────────────────────┤
│  File  Edit  View  Insert  Format  Tools  Help                             │
│  ─────────────────────────────────────────────────────────────────────────│
│  [B] [I] [U] [S̲] | 🔤 Heading ▾ | ≡ | ≣ | ≣ | ≣ | 🎨 | 📎 | 💬           │
├────────────────┬────────────────────────────────────────┬──────────────────┤
│  📄 Outline    │                                        │  📊 Info         │
│                │     ┌─────────────────────────┐        │                  │
│  1. Chapter 1  │     │                         │        │  Words: 1,234    │
│    1.1 Section │     │    Document Title       │        │  Characters: 6,789│
│    1.2 Section │     │    ═══════════════     │        │  Pages: 5        │
│  2. Chapter 2  │     │                         │        │  Reading: 6 min  │
│    2.1 Section │     │  Lorem ipsum dolor sit  │        │                  │
│  3. Chapter 3  │     │  amet, consectetur      │        │  💾 Saved        │
│                │     │  adipiscing elit...     │        │  Last: 2 min ago │
│  📑 Styles     │     │                         │        │                  │
│  • Normal      │     │  [Image placeholder]    │        │  📤 Export       │
│  • Heading 1   │     │                         │        │  • PDF           │
│  • Heading 2   │     │  > Blockquote text      │        │  • DOCX          │
│  • Quote       │     │                         │        │  • ODT           │
│                │     └─────────────────────────┘        │  • HTML          │
│                │                                        │  • Markdown      │
├────────────────┴────────────────────────────────────────┴──────────────────┤
│  Page 3 of 5  |  100%  |  ✓ Spell Check  |  Ln 45, Col 12                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Core Features

#### Rich Text Editing
- **Formatting**: Bold, italic, underline, strikethrough
- **Headings**: H1-H6 with outline navigation
- **Lists**: Bulleted, numbered, checklists
- **Tables**: Insert, resize, style tables
- **Images**: Insert, crop, resize images
- **Links**: Hyperlinks, cross-references
- **Comments**: Inline comments and annotations

#### Document Formats
```
Import/Export Support:
├── Rich Text: DOCX, ODT, RTF
├── Plain Text: TXT, MD (Markdown)
├── Web: HTML, EPUB
├── Print: PDF
└── Abyss: .adoc (native with DRC-369 metadata)
```

#### Cloud Features
- **Auto-save** to QorID storage
- **Version History** (blockchain-anchored)
- **Collaboration** (real-time editing)
- **Sharing** (public/private links)
- **DRC-369 Publishing** (mint documents as NFTs)

#### Writing Tools
- **Spell Check** (multi-language)
- **Grammar Check** (AI-powered)
- **Word Count** (real-time)
- **Reading Time** estimation
- **Focus Mode** (distraction-free)
- **Templates** (resume, letter, report)

### Technical Stack
```
Frontend:
├── Editor: TipTap (ProseMirror-based)
├── UI: React + Tailwind
├── State: Zustand
└── Export: docx, html-to-pdf

Backend (for collaboration):
├── WebSocket: Real-time sync
├── CRDT: Conflict resolution
└── Storage: QorID + IPFS
```

---

## Implementation Plan

### Phase 1: Application Selector (1 week)
- [ ] Create AppLauncher component
- [ ] Implement QuickSwitcher (Cmd/Ctrl+Space)
- [ ] Add app mode persistence
- [ ] Update Qt MainWindow for multi-app

### Phase 2: NEON Expansion (2 weeks)
- [ ] Add video playback (libmpv/VLC)
- [ ] Implement library scanner
- [ ] Create playlist management
- [ ] Add streaming support
- [ ] Visualizer modes

### Phase 3: CRAFT Expansion (2 weeks)
- [ ] Integrate Monaco Editor
- [ ] Add file tree explorer
- [ ] Implement integrated terminal
- [ ] Add Git integration
- [ ] DRC-369 publishing workflow

### Phase 4: Abyss Docs (3 weeks)
- [ ] Integrate TipTap editor
- [ ] Implement format toolbar
- [ ] Add export functionality
- [ ] Create document templates
- [ ] Cloud sync & versioning

### Phase 5: Integration (1 week)
- [ ] Cross-app file handling
- [ ] Unified settings
- [ ] Keyboard shortcuts
- [ ] Polish & testing

**Total Estimated Time: 9 weeks**

---

## File Associations

```
Application    Extensions
─────────────────────────────────────
QOR OS       .abyss (workspace)
Explorer       .html, .url
NEON           .mp3, .mp4, .mkv, .flac, .wav, .ogg, .avi, .mov
CRAFT          .rs, .ts, .js, .py, .go, .c, .cpp, .sol
Docs           .adoc, .docx, .odt, .rtf, .txt, .md
```

---

## Accessibility

All applications are available to all users regardless of premium tier:

| Application | Free | Archon | Genesis |
|------------|------|--------|---------|
| QOR OS | ✅ | ✅ | ✅ |
| Explorer | ✅ | ✅ | ✅ |
| NEON | ✅ | ✅ | ✅ |
| CRAFT | ✅ | ✅ | ✅ |
| Docs | ✅ | ✅ | ✅ |
| Cloud Sync | Limited | Extended | Unlimited |
| Collaboration | ❌ | ✅ | ✅ |
| AI Features | ❌ | ❌ | ✅ |

---

*Abyss Desktop Suite - One platform, infinite possibilities.*
