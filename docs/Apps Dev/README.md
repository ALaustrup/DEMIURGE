# Abyss Applications Development

> Development documentation for all Abyss ecosystem applications.

---

## Overview

This directory contains comprehensive documentation for all applications currently in development for the Abyss ecosystem. Each application is designed to work seamlessly within AbyssOS while also being available as standalone applications in the desktop suite.

---

## Application Index

### Core Applications

| App | Status | Description | Documentation |
|-----|--------|-------------|---------------|
| **AbyssOS** | 🟢 Active | Full desktop environment | [Overview](./ABYSS_OS.md) |
| **Abyss Explorer** | 🟢 Active | Web3 browser | [ABYSS_EXPLORER.md](./ABYSS_EXPLORER.md) |
| **NEON** | 🟡 In Progress | Media player | [NEON.md](./NEON.md) |
| **CRAFT** | 🟡 In Progress | IDE | [CRAFT.md](./CRAFT.md) |
| **WRYT** | 🔴 Planning | Document editor | [WRYT.md](./WRYT.md) |

### Desktop Suite

| Component | Status | Description | Documentation |
|-----------|--------|-------------|---------------|
| **Desktop App** | 🟡 In Progress | Qt-based launcher | [ABYSS_DESKTOP_SUITE.md](./ABYSS_DESKTOP_SUITE.md) |
| **App Launcher** | 🟢 Complete | Application selector | (Included in Desktop Suite) |
| **Quick Switcher** | 🟢 Complete | Cmd+Space switching | (Included in Desktop Suite) |

---

## Status Legend

| Icon | Status | Description |
|------|--------|-------------|
| 🟢 | Active/Complete | Feature-complete and actively maintained |
| 🟡 | In Progress | Under active development |
| 🔴 | Planning | Documented but not yet started |
| ⚪ | On Hold | Development paused |
| 🔵 | Testing | In testing phase |

---

## Application Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ABYSS ECOSYSTEM                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─ Desktop Suite (Qt) ──────────────────────────────────────────────────┐  │
│  │                                                                        │  │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐          │  │
│  │  │  Abyss    │  │  Abyss    │  │           │  │           │          │  │
│  │  │    OS     │  │ Explorer  │  │   NEON    │  │  CRAFT    │          │  │
│  │  │ (Full DE) │  │ (Browser) │  │  (Media)  │  │   (IDE)   │          │  │
│  │  └───────────┘  └───────────┘  └───────────┘  └───────────┘          │  │
│  │                                                                        │  │
│  │  ┌───────────┐                                                        │  │
│  │  │           │  + Future applications...                              │  │
│  │  │   WRYT    │                                                        │  │
│  │  │  (Editor) │                                                        │  │
│  │  └───────────┘                                                        │  │
│  │                                                                        │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌─ Shared Services ─────────────────────────────────────────────────────┐  │
│  │  • AbyssID Authentication                                              │  │
│  │  • Demiurge RPC Connection                                            │  │
│  │  • DRC-369 Asset Management                                           │  │
│  │  • File System (Abyss Files)                                          │  │
│  │  • Cloud Sync                                                         │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Development Guidelines

### Adding a New Application

1. **Create Documentation First**
   - Add a new `.md` file in this directory
   - Follow the template structure from existing apps
   - Include phases and progress tracking

2. **Create Component Structure**
   ```
   src/components/desktop/apps/
   ├── [AppName]App.tsx           # Main wrapper
   └── [appname]/
       ├── [Component].tsx        # Sub-components
       ├── hooks/                  # Custom hooks
       ├── utils/                  # Utilities
       └── types/                  # TypeScript types
   ```

3. **Register in Desktop**
   ```typescript
   // src/routes/Desktop.tsx
   import { [AppName]App } from '../components/desktop/apps/[AppName]App';
   
   const appComponents = {
     // ...existing
     [appId]: [AppName]App,
   };
   ```

4. **Update This Index**
   - Add entry to Application Index table
   - Update architecture diagram if needed

### Code Style

- Use TypeScript for all new code
- Follow existing patterns in the codebase
- Use Zustand for state management
- Use Tailwind CSS for styling
- Document complex logic with comments

### Testing

- Write unit tests for utilities
- Manual testing for UI components
- Cross-browser testing for web apps
- Qt testing for desktop features

---

## Quick Links

### Development Resources
- [Main Repository](https://github.com/ALaustrup/DEMIURGE)
- [AbyssOS Portal](../../apps/abyssos-portal/)
- [Desktop App](../../apps/abyss-explorer-desktop/)

### API Documentation
- [Demiurge RPC](../api/RPC.md)
- [DRC-369 Standard](../../sdk/schema/drc369.json)
- [AbyssID](../../sdk/schema/abyssid.json)

### Deployment
- [Node Setup](../deployment/NODE_SETUP.md)
- [RPC Troubleshooting](../deployment/RPC_TROUBLESHOOTING.md)

---

## Progress Overview

### Overall Completion

```
Applications Progress:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AbyssOS       ██████████████████████████████░░░░░░░░░  75%
Explorer      ████████████████████████████████████░░░  90%
NEON          ██████████████░░░░░░░░░░░░░░░░░░░░░░░░░  35%
CRAFT         ██████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  25%
WRYT          ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   0%

Desktop Suite ██████████████████░░░░░░░░░░░░░░░░░░░░░  45%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Overall: ~45%
```

---

## Contributing

When working on application development:

1. Check existing documentation first
2. Update progress tracking when completing phases
3. Document any architectural decisions
4. Keep this index updated

---

*Building the future of decentralized applications.*
