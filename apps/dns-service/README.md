# Demiurge DNS Service

Backend DNS Intelligence Layer microservice for the Demiurge ecosystem.

## Features

- **Unified DNS Resolution Pipeline**: Chain → Cache → Unbound → Upstream
- **On-Chain DNS Records**: DRC-369 anchored DNS records
- **SQLite Cache**: TTL-based caching with automatic expiration
- **REST API**: Clean JSON-RPC style endpoints
- **TypeScript**: Fully typed with Zod validation

## Installation

```bash
cd apps/dns-service
pnpm install
```

## Configuration

Copy `.env.example` to `.env` and configure:

- `DNS_SERVICE_PORT`: Port to listen on (default: 8083)
- `DNS_DB_PATH`: SQLite database path (default: ./dns-cache.db)
- `DEMIURGE_RPC_URL`: Demiurge chain RPC endpoint
- `CORS_ORIGIN`: Allowed CORS origins

## Development

```bash
pnpm dev
```

## Build

```bash
pnpm build
```

## Production

```bash
pnpm start
```

## Systemd Service

Install the service file:

```bash
sudo cp demiurge-dns.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable demiurge-dns
sudo systemctl start demiurge-dns
```

## API Endpoints

- `GET /api/dns/lookup?domain=x&type=A` - Lookup DNS record
- `GET /api/dns/record?domain=x` - Get all records for domain
- `GET /api/dns/cache/:domain` - Get cache entry
- `POST /api/dns/cache/flush` - Clear cache
- `GET /api/dns/onchain/:domain` - Get on-chain DNS record
- `GET /api/dns/resolve-tld?name=x` - Resolve Demiurge TLD

## Nginx Configuration

Add to nginx config:

```nginx
location /api/dns/ {
    proxy_pass http://127.0.0.1:8083/api/dns/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

