# AbyssOS Portal

The full-screen desktop environment for DEMIURGE.

## Overview

AbyssOS is a web-based desktop environment that provides:
- Boot screen with intro video
- AbyssID authentication
- Window-based application system
- Chain integration

## Live URL

**Production:** https://demiurge.cloud

## Local Development

```bash
cd apps/abyssos-portal
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
- AbyssID login with username
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
VITE_ABYSSID_API_URL=https://demiurge.cloud/api
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
scp -r dist/* user@server:/var/www/abyssos-portal/
```

Configure nginx:
```nginx
server {
    listen 443 ssl;
    server_name demiurge.cloud;
    
    root /var/www/abyssos-portal;
    index index.html;
    
    location / {
        try_files $uri /index.html;
    }
}
```

---

See [apps/abyssos-portal/README.md](../../apps/abyssos-portal/README.md) for more details.
