# QLOUD OS

The full-screen desktop environment for DEMIURGE.

## Overview

QOR OS is a web-based desktop environment that provides:
- Boot screen with intro video
- QorID authentication
- Window-based application system
- Chain integration

## Live URL

**Production:** https://demiurge.cloud

## Local Development

```bash
cd apps/qloud-os
pnpm install
pnpm dev
```

Opens at `http://localhost:5173`

## Features

### Boot Sequence
1. Intro video plays
2. "Skip Intro" available
3. Transitions to login screen

### Authentication
- QorID login with username
- Seed phrase recovery
- New account registration

### Desktop Environment
- Circular dock launcher
- Draggable/resizable windows
- Multiple apps

### Built-in Apps
- **Chain Ops** - Network status
- **AbyssWallet** - CGT balance, transfers
- **Block Explorer** - Browse blocks
- **DRC369 Studio** - NFT creation
- **AbyssDNS** - DNS console
- **World Atlas** - Browse worlds

## Configuration

### Environment Variables

```env
VITE_DEMIURGE_RPC_URL=https://rpc.demiurge.cloud/rpc
VITE_QORID_API_URL=https://demiurge.cloud/api
```

### Tech Stack
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Zustand

## Building for Production

```bash
pnpm build
```

Output: `dist/` directory

## Deployment

Copy `dist/` to web server:
```bash
scp -r dist/* user@server:/var/www/qloud-os/
```

Configure nginx:
```nginx
server {
    listen 443 ssl;
    server_name demiurge.cloud;
    
    root /var/www/qloud-os;
    index index.html;
    
    location / {
        try_files $uri /index.html;
    }
}
```

---

See [apps/qloud-os/README.md](../../apps/qloud-os/README.md) for more details.
