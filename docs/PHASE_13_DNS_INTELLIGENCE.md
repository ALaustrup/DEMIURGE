# Phase 13: Demiurge DNS Intelligence Layer

## Overview

Phase 13 introduces a complete DNS subsystem spanning backend service, frontend console, WASM runtime integration, grid protocol extensions, and on-chain DNS anchoring via DRC-369.

## Architecture

### 1. Backend DNS Service (`apps/dns-service/`)

**Location**: `apps/dns-service/`

**Components**:
- **Resolver Pipeline**: Chain → Cache → Unbound → Upstream
- **SQLite Cache**: TTL-based caching with automatic expiration
- **Chain Lookup**: Queries DRC-369 DNS records from Demiurge chain
- **REST API**: Express server with Zod validation

**Endpoints**:
- `GET /api/dns/lookup?domain=x&type=A` - DNS lookup with trace support
- `GET /api/dns/record?domain=x` - Get all records for domain
- `GET /api/dns/cache/:domain` - Get cache entry
- `POST /api/dns/cache/flush` - Clear cache
- `GET /api/dns/onchain/:domain` - Get on-chain DNS record
- `GET /api/dns/resolve-tld?name=x` - Resolve Demiurge-native TLD

**Database**: SQLite with `dns_cache` and `chain_dns_records` tables

### 2. AbyssOS DNS Console App

**Location**: `apps/abyssos-portal/src/components/desktop/apps/AbyssDNSApp.tsx`

**Features**:
- Domain lookup with record type selection (A, AAAA, CNAME, TXT, NS)
- Results display with source indicator (chain, cache, unbound, upstream, grid)
- TTL and expiration information
- Trace mode showing resolver path and durations
- Cache inspector with clear cache functionality
- Chain Records tab for on-chain DNS assets
- Grid Resolution toggle for peer-based DNS queries
- AbyssOS glass/neon styling with smooth animations

### 3. WASM Runtime DNS API

**Location**: `apps/abyssos-portal/src/services/runtime/abi/dns.ts`

**Methods**:
- `dns.lookup(domain, type?)` - Lookup DNS record
- `dns.resolveAll(domain)` - Resolve all record types
- `dns.getChainRecord(domain)` - Get on-chain DNS record
- `dns.clearCache()` - Clear DNS cache

**Integration**: Extended `WASMABI` interface and `wasmVM.ts` with DNS ABI bindings

### 4. Grid Protocol DNS Extension

**Location**: `apps/abyssos-portal/src/services/grid/dns/`

**Components**:
- **gridDnsResolver.ts**: Broadcasts DNS queries to peers
- **gridDnsHandler.ts**: Responds to DNS_QUERY messages
- **gridDnsTypes.ts**: Type definitions for grid DNS messages

**Message Types**:
- `DNS_QUERY` - Query DNS record from peer
- `DNS_RESPONSE` - Response with DNS records
- `DNS_CHAIN_RECORD` - On-chain DNS record announcement
- `DNS_MERKLE_PROOF` - Merkle proof for chain-anchored DNS

### 5. DRC-369 On-Chain DNS Anchoring

**Location**: `apps/abyssos-portal/src/services/drc369/dnsRecord.ts`

**Schema Extension**:
- Added `"dns-record"` to `DRC369ContentType`
- Extended `attributes` to support DNS record structure:
  ```typescript
  {
    domain: string;
    records: {
      a?: string[];
      aaaa?: string[];
      cname?: string[];
      txt?: string[];
      ns?: string[];
    };
  }
  ```

**Helper Functions**:
- `publishDnsRecord()` - Publish DNS record as DRC-369 asset
- `isDnsRecord()` - Check if asset is DNS record
- `extractDnsRecords()` - Extract DNS records from asset

### 6. Shared Utilities

**Location**: `apps/abyssos-portal/src/utils/dns/`

**Modules**:
- **normalizeDomain.ts**: Domain normalization and validation
- **validateRecord.ts**: DNS record validation
- **cacheHelpers.ts**: Cache expiration and TTL helpers
- **tldHelpers.ts**: TLD categorization and Demiurge-native TLD detection

## Deployment

### Backend Service

1. **Install dependencies**:
   ```bash
   cd apps/dns-service
   pnpm install
   ```

2. **Build**:
   ```bash
   pnpm build
   ```

3. **Systemd service**:
   ```bash
   sudo cp apps/dns-service/demiurge-dns.service /etc/systemd/system/
   sudo systemctl daemon-reload
   sudo systemctl enable demiurge-dns
   sudo systemctl start demiurge-dns
   ```

4. **Nginx configuration**:
   Add to `nginx-demiurge.cloud-https.conf`:
   ```nginx
   location /api/dns/ {
       proxy_pass http://127.0.0.1:8083/api/dns/;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
   }
   ```

### Frontend

The DNS Console app is automatically available in AbyssOS via the Dock (🌐 DNS icon).

## Integration Points

- **Chain Client**: Extended with DNS lookup capabilities
- **Grid Protocol**: DNS message types added to `GridMessageType`
- **WASM Runtime**: DNS ABI integrated into `WASMABI` interface
- **DRC-369**: DNS record type added to content types
- **Desktop Store**: `dnsConsole` app registered

## Testing

### Backend

```bash
cd apps/dns-service
pnpm dev
# Test: curl http://localhost:8083/api/dns/lookup?domain=example.com&type=A
```

### Frontend

1. Open AbyssOS
2. Click DNS icon in Dock
3. Enter domain (e.g., `example.com`)
4. Select record type
5. Click "Lookup"
6. View results with source indicator

## Future Enhancements

- Unbound integration for local DNS resolver
- Merkle proofs for chain-anchored DNS records
- DNS over HTTPS (DoH) support
- DNS over WebSocket for real-time updates
- Demiurge-native TLD resolution (`.demiurge`)
- DNS record signing and verification

## Files Created/Modified

### Backend
- `apps/dns-service/` (complete service)
- `apps/dns-service/demiurge-dns.service` (systemd unit)

### Frontend
- `apps/abyssos-portal/src/components/desktop/apps/AbyssDNSApp.tsx`
- `apps/abyssos-portal/src/services/dns/dnsClient.ts`
- `apps/abyssos-portal/src/services/runtime/abi/dns.ts`
- `apps/abyssos-portal/src/services/grid/dns/` (grid DNS modules)
- `apps/abyssos-portal/src/services/drc369/dnsRecord.ts`
- `apps/abyssos-portal/src/utils/dns/` (utility modules)

### Modified
- `apps/abyssos-portal/src/services/runtime/wasmVM.ts` (DNS ABI)
- `apps/abyssos-portal/src/services/abyssvm/executor.ts` (DNS ABI)
- `apps/abyssos-portal/src/services/abyssvm/types.ts` (DNS ABI)
- `apps/abyssos-portal/src/services/drc369/schema.ts` (DNS content type)
- `apps/abyssos-portal/src/services/grid/types.ts` (DNS message types)
- `apps/abyssos-portal/src/state/desktopStore.ts` (DNS app registration)
- `apps/abyssos-portal/src/routes/Desktop.tsx` (DNS app routing)
- `apps/abyssos-portal/nginx-demiurge.cloud-https.conf` (DNS proxy)

## Status

✅ **Phase 13 Complete**

All components implemented and integrated. Build passes with only minor unused import warnings in unrelated files.

