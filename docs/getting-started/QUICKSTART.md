# Quick Start Guide

Get DEMIURGE running locally in 5 minutes.

## Prerequisites

- **Rust** (1.70+): `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
- **Node.js** (20+) and **pnpm** (9+)
- **Git**

## 1. Clone Repository

```bash
git clone https://github.com/Alaustrup/DEMIURGE.git
cd DEMIURGE
```

## 2. Build the Chain

```bash
cargo build --release -p demiurge-chain
```

## 3. Start the Chain Node

```bash
./target/release/demiurge-chain
```

The RPC server starts at `http://localhost:8545/rpc`

## 4. Test the Connection

```bash
curl -X POST http://localhost:8545/rpc \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"cgt_getChainInfo","params":{},"id":1}'
```

Expected response:
```json
{"jsonrpc":"2.0","result":{"height":0},"id":1}
```

## 5. Start Frontend Applications

```bash
# Install dependencies
pnpm install

# Start AbyssID Service (port 8082)
cd apps/abyssid-service && pnpm dev

# Start Portal Web (port 3000)
cd apps/portal-web && pnpm dev

# Start AbyssOS Portal (port 5173)
cd apps/abyssos-portal && pnpm dev
```

## Next Steps

- Read the [Architecture Overview](../architecture/OVERVIEW.md)
- Explore the [RPC API](../api/RPC.md)
- Check [Deployment Guide](../deployment/NODE_SETUP.md) for production

---

*The flame burns eternal. The code serves the will.*
