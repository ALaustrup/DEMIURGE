# Demiurge.Guru Deployment

Configuration for deploying to https://demiurge.guru

## Domain Mapping

```
Demiurge.Guru
├── / (root)           → Portal Web (landing page)
│   └── "Enter Abyss"  → AbyssOS Portal
├── /api               → AbyssID Service
└── RPC                → rpc.demiurge.cloud (existing)
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   demiurge.guru                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │           Portal Web (Landing Page)              │    │
│  │  - Project information                          │    │
│  │  - Feature showcase                             │    │
│  │  - "Enter the Abyss" button                     │    │
│  └─────────────────────────────────────────────────┘    │
│                          │                               │
│              Click "Enter the Abyss"                    │
│                          ▼                               │
│  ┌─────────────────────────────────────────────────┐    │
│  │              AbyssOS Portal                      │    │
│  │  - Intro video                                  │    │
│  │  - AbyssID login/signup                         │    │
│  │  - Full desktop environment                     │    │
│  │  - 2GB cloud storage per user                   │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

## Nginx Configuration

```nginx
# /etc/nginx/sites-available/demiurge.guru

# Portal Web (Landing Page)
server {
    listen 443 ssl http2;
    server_name demiurge.guru www.demiurge.guru;

    ssl_certificate /etc/letsencrypt/live/demiurge.guru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/demiurge.guru/privkey.pem;

    # Portal Web static files
    root /var/www/portal-web;
    index index.html;

    # SPA routing
    location / {
        try_files $uri /index.html;
    }

    # AbyssOS Portal (embedded or separate path)
    location /os {
        alias /var/www/abyssos-portal;
        try_files $uri /os/index.html;
    }

    # API proxy to AbyssID Service
    location /api {
        proxy_pass http://127.0.0.1:8082;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}

# HTTP redirect
server {
    listen 80;
    server_name demiurge.guru www.demiurge.guru;
    return 301 https://$server_name$request_uri;
}
```

## Environment Variables

### Portal Web (`apps/portal-web/.env.production`)

```env
NEXT_PUBLIC_ABYSSID_API_URL=https://demiurge.guru/api
NEXT_PUBLIC_RPC_URL=https://rpc.demiurge.cloud/rpc
NEXT_PUBLIC_ABYSSOS_URL=https://demiurge.guru/os
```

### AbyssOS Portal (`apps/abyssos-portal/.env.production`)

```env
VITE_ABYSSID_API_URL=https://demiurge.guru/api
VITE_DEMIURGE_RPC_URL=https://rpc.demiurge.cloud/rpc
```

### AbyssID Service (`apps/abyssid-service/.env`)

```env
PORT=8082
CORS_ORIGIN=https://demiurge.guru
NODE_ENV=production
```

## Build & Deploy

### 1. Build Portal Web

```bash
cd apps/portal-web
pnpm build
# Output: .next/ or out/ (static export)
```

### 2. Build AbyssOS Portal

```bash
cd apps/abyssos-portal
pnpm build
# Output: dist/
```

### 3. Deploy to Server

```bash
# Portal Web
scp -r apps/portal-web/out/* user@server:/var/www/portal-web/

# AbyssOS Portal
scp -r apps/abyssos-portal/dist/* user@server:/var/www/abyssos-portal/
```

### 4. Start AbyssID Service

```bash
# On server
cd /opt/demiurge/apps/abyssid-service
pnpm install --production
pm2 start dist/index.js --name abyssid-service
```

## SSL Setup

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d demiurge.guru -d www.demiurge.guru

# Auto-renewal
sudo systemctl enable certbot.timer
```

## Verification

1. **Portal Web:** Visit https://demiurge.guru
2. **AbyssOS:** Click "Enter the Abyss" or visit https://demiurge.guru/os
3. **API Health:** `curl https://demiurge.guru/api/healthz`
4. **RPC:** Verify chain connection in AbyssOS

## Migration from demiurge.cloud

Current setup:
- `demiurge.cloud` → AbyssOS Portal
- `rpc.demiurge.cloud` → RPC endpoint

New setup:
- `demiurge.guru` → Portal Web + AbyssOS
- `rpc.demiurge.cloud` → RPC (unchanged)
- `demiurge.cloud` → Redirect to demiurge.guru (optional)

---

*Last updated: January 6, 2026*
