# CRAFT - Integrated Development Environment

> *Code. Build. Deploy.*

A professional code editor and IDE for the Abyss ecosystem, designed for developers building applications, smart contracts, and web projects.

---

## Table of Contents

1. [Overview](#overview)
2. [Core Features](#core-features)
3. [Language Support](#language-support)
4. [Editor Interface](#editor-interface)
5. [DRC-369 Integration](#drc-369-integration)
6. [Technical Architecture](#technical-architecture)
7. [Implementation Phases](#implementation-phases)
8. [Development Progress](#development-progress)

---

## Overview

CRAFT brings professional development tools to the Abyss ecosystem. Built on Monaco Editor (the same engine powering VS Code), it provides a familiar, powerful coding experience with unique blockchain integrations.

### Key Features

- **Monaco Editor**: VS Code's editing experience
- **Multi-Language Support**: Syntax highlighting for 50+ languages
- **Integrated Terminal**: Full shell access
- **Git Integration**: Version control built-in
- **DRC-369 Publishing**: Mint and publish code as NFTs
- **Smart Contract Tools**: Deploy to Demiurge chain
- **Project Templates**: Quick-start for common projects

---

## Core Features

### Editor Features
- Syntax highlighting (50+ languages)
- IntelliSense autocomplete
- Code folding
- Multi-cursor editing
- Bracket matching
- Minimap navigation
- Search and replace (regex)
- Code snippets
- Emmet support

### File Management
- File tree explorer
- Multi-tab editing
- Split view
- File search (fuzzy)
- Recent files
- Workspace management

### Terminal
- Integrated terminal
- Multiple terminal instances
- Shell selection (bash, PowerShell, etc.)
- Command history
- Output coloring

### Git Integration
- Stage/unstage changes
- Commit with message
- Push/pull
- Branch management
- Diff viewer
- Conflict resolution
- Git history

### DRC-369 Features
- Publish code as NFT
- Verify ownership
- License management
- Royalty configuration
- Project attribution

---

## Language Support

### Tier 1 (Full LSP Support)
| Language | Extensions | Features |
|----------|------------|----------|
| TypeScript | `.ts`, `.tsx` | Full IntelliSense, type checking |
| JavaScript | `.js`, `.jsx` | IntelliSense, ESLint integration |
| Rust | `.rs` | rust-analyzer integration |
| Python | `.py` | Pylance, type hints |
| Go | `.go` | gopls integration |

### Tier 2 (Syntax + Basic Support)
| Language | Extensions |
|----------|------------|
| HTML/CSS | `.html`, `.css`, `.scss` |
| JSON/YAML | `.json`, `.yaml`, `.yml` |
| Markdown | `.md`, `.mdx` |
| SQL | `.sql` |
| Solidity | `.sol` |
| TOML | `.toml` |

### Tier 3 (Syntax Highlighting)
C, C++, Java, PHP, Ruby, Shell, XML, and 30+ more languages

---

## Editor Interface

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CRAFT - my-project                                      ─  □  ✕            │
├─────────────────────────────────────────────────────────────────────────────┤
│  File  Edit  View  Run  Terminal  Git  DRC-369  Help                        │
├──────────────────┬──────────────────────────────────────┬──────────────────┤
│  📁 Explorer      │  main.rs × | lib.rs × | Cargo.toml  │  🔍 Search       │
│  ─────────────── │  ─────────────────────────────────── │  ─────────────── │
│  ▼ src/           │   1 │ fn main() {                   │                  │
│    ├─ main.rs ◀  │   2 │     println!("Hello!");       │  Results:        │
│    └─ lib.rs      │   3 │ }                             │  (none)          │
│  ▼ tests/         │   4 │                               │                  │
│    └─ test.rs     │   5 │ #[cfg(test)]                  │  🌿 Git          │
│  Cargo.toml       │   6 │ mod tests {                   │  ─────────────── │
│  README.md        │   7 │     #[test]                   │  main            │
│                   │   8 │     fn it_works() {           │  ↑ 3 commits     │
│  🔗 DRC-369       │   9 │         assert!(true);        │  ↓ 0 behind      │
│  ─────────────── │  10 │     }                         │                  │
│  Publish Project  │  11 │ }                             │  📋 Problems     │
│  Verify Code      │                                     │  ─────────────── │
│                   │                                     │  ⚠ 0 warnings   │
│                   │                                     │  ❌ 0 errors     │
├──────────────────┴──────────────────────────────────────┴──────────────────┤
│  Terminal                                                        [+] [×]    │
│  ─────────────────────────────────────────────────────────────────────────│
│  $ cargo build                                                              │
│     Compiling my-project v0.1.0                                            │
│      Finished dev [unoptimized + debuginfo] target(s) in 1.23s             │
│  $                                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## DRC-369 Integration

### Publish Code as NFT

```
┌─────────────────────────────────────────────────────────────────┐
│                  Publish to DRC-369                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Project: my-awesome-app                                         │
│                                                                  │
│  Title:    [My Awesome App                              ]        │
│  Version:  [1.0.0                                       ]        │
│                                                                  │
│  Description:                                                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ A revolutionary app that does amazing things...          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  License:  [MIT License ▾]                                       │
│                                                                  │
│  Files to include:                                               │
│  ☑ src/          ☑ Cargo.toml     ☐ tests/                      │
│  ☑ README.md     ☐ .gitignore     ☐ target/                     │
│                                                                  │
│  Royalty on resale: [5]%                                         │
│                                                                  │
│  Estimated cost: 0.5 CGT                                         │
│                                                                  │
│                    [Cancel]              [Publish]               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Technical Architecture

### Component Structure

```
src/components/desktop/apps/
├── CraftApp.tsx                   # Main application wrapper
├── craft/
│   ├── CraftEditor.tsx            # Monaco editor wrapper
│   ├── CraftFileTree.tsx          # File explorer
│   ├── CraftTabs.tsx              # Tab management
│   ├── CraftTerminal.tsx          # Integrated terminal
│   ├── CraftGitPanel.tsx          # Git integration
│   ├── CraftSearch.tsx            # Search panel
│   ├── CraftProblems.tsx          # Errors/warnings panel
│   ├── CraftDrc369.tsx            # DRC-369 publishing
│   ├── hooks/
│   │   ├── useCraftWorkspace.ts   # Workspace management
│   │   ├── useCraftGit.ts         # Git operations
│   │   └── useCraftTerminal.ts    # Terminal state
│   └── utils/
│       ├── languageConfigs.ts     # Language configurations
│       └── monacoSetup.ts         # Monaco initialization
```

---

## Implementation Phases

### Phase 1: Core Editor (2 weeks)
- [ ] Monaco Editor integration
- [ ] File tree explorer
- [ ] Tab management
- [ ] Basic syntax highlighting
- [ ] File save/load

### Phase 2: Terminal & Git (2 weeks)
- [ ] Integrated terminal
- [ ] Git status display
- [ ] Basic git operations
- [ ] Branch management

### Phase 3: Advanced Features (2 weeks)
- [ ] Search and replace
- [ ] Multi-cursor editing
- [ ] Code snippets
- [ ] Settings panel

### Phase 4: DRC-369 Integration (1 week)
- [ ] Publish workflow
- [ ] License selection
- [ ] Code verification

**Total Estimated Time: 7 weeks**

---

## Development Progress

### Current Status: 🟡 In Progress (Basic Implementation Exists)

| Phase | Status | Progress | Notes |
|-------|--------|----------|-------|
| Phase 1: Core Editor | 🟡 In Progress | 30% | Basic editor exists |
| Phase 2: Terminal & Git | 🔴 Not Started | 0% | - |
| Phase 3: Advanced Features | 🔴 Not Started | 0% | - |
| Phase 4: DRC-369 Integration | 🔴 Not Started | 0% | - |

---

*CRAFT - Forge your vision into reality.*
