# DEMIURGE Documentation

> The flame burns eternal. The code serves the will.

Welcome to the official documentation for **DEMIURGE**, a sovereign Layer 1 blockchain ecosystem for creators.

## Quick Links

| Section | Description |
|---------|-------------|
| [Getting Started](getting-started/QUICKSTART.md) | 5-minute setup guide |
| [Architecture](architecture/OVERVIEW.md) | System design and components |
| [API Reference](api/RPC.md) | JSON-RPC API documentation |
| [Tokenomics](tokenomics/CGT.md) | Creator God Token specification |
| [Deployment](deployment/NODE_SETUP.md) | Production deployment guide |
| [Applications](applications/ABYSSOS.md) | Frontend applications |

## Live Services

- **AbyssOS Portal**: https://demiurge.cloud
- **RPC Endpoint**: https://rpc.demiurge.cloud/rpc
- **Target Domain**: https://demiurge.guru (planned)

## Core Components

### Demiurge Chain
The Layer 1 blockchain built in Rust with custom Forge Proof-of-Work consensus.

### Runtime Modules (9 total)
- `bank_cgt` - Creator God Token operations
- `abyssid_registry` - On-chain identity system
- `nft_dgen` - D-GEN NFT standard
- `fabric_manager` - P2P asset management
- `abyss_registry` - Marketplace
- `developer_registry` - Developer profiles
- `dev_capsules` - Development environments
- `recursion_registry` - Game worlds
- `work_claim` - Mining rewards

### Applications
- **AbyssOS Portal** - Full desktop environment
- **Portal Web** - Information landing page
- **AbyssID Service** - Identity and authentication API
- **DNS Service** - Chain-aware DNS resolution

## Documentation Structure

```
docs/
├── README.md              # This file
├── getting-started/       # Quick start guides
├── architecture/          # System architecture
├── api/                   # API references
├── tokenomics/            # Token economics
├── deployment/            # Deployment guides
├── applications/          # App documentation
└── archive/               # Historical documentation
```

## Support

- Check the [Architecture Overview](architecture/OVERVIEW.md) for system design
- See [Deployment Guide](deployment/NODE_SETUP.md) for production setup
- Historical milestone docs are in [archive/](archive/)

---

*Last updated: January 6, 2026*
