# Node Deployment Guide

Deploy a DEMIURGE chain node on Ubuntu 24.04.

## Prerequisites

- Ubuntu 24.04 LTS server
- Root or sudo access
- 2GB+ RAM, 20GB+ storage

## Quick Deploy

### 1. Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install build tools
sudo apt install -y build-essential pkg-config libssl-dev git curl

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
```

### 2. Clone Repository

```bash
sudo mkdir -p /opt/demiurge
sudo git clone https://github.com/Alaustrup/DEMIURGE.git /opt/demiurge
cd /opt/demiurge
```

### 3. Build Chain

```bash
cargo build --release -p demiurge-chain
```

### 4. Create Service

```bash
sudo tee /etc/systemd/system/demiurge-chain.service > /dev/null <<EOF
[Unit]
Description=Demiurge Chain Node
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/demiurge
ExecStart=/opt/demiurge/target/release/demiurge-chain
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
```

### 5. Start Service

```bash
sudo systemctl daemon-reload
sudo systemctl enable demiurge-chain
sudo systemctl start demiurge-chain
```

### 6. Verify

```bash
# Check status
sudo systemctl status demiurge-chain

# Test RPC
curl -X POST http://localhost:8545/rpc \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"cgt_getChainInfo","params":{},"id":1}'
```

## Configuration

### Paths
- **Binary:** `/opt/demiurge/target/release/demiurge-chain`
- **Database:** `/opt/demiurge/.demiurge/data`
- **Config:** `/opt/demiurge/chain/configs/`

### RPC Binding
Default: `0.0.0.0:8545`

Edit `chain/configs/node.toml` to change.

## Nginx Reverse Proxy (HTTPS)

```nginx
server {
    listen 443 ssl;
    server_name rpc.demiurge.cloud;

    ssl_certificate /etc/letsencrypt/live/rpc.demiurge.cloud/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/rpc.demiurge.cloud/privkey.pem;

    location /rpc {
        proxy_pass http://127.0.0.1:8545/rpc;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        
        # CORS
        add_header Access-Control-Allow-Origin "https://demiurge.cloud";
        add_header Access-Control-Allow-Methods "POST, OPTIONS";
        add_header Access-Control-Allow-Headers "Content-Type";
    }
}
```

## Troubleshooting

### Service won't start
```bash
sudo journalctl -u demiurge-chain -n 50
```

### Port already in use
```bash
sudo netstat -tlnp | grep 8545
```

### Permission issues
```bash
sudo chown -R root:root /opt/demiurge
```

## Current Production

- **Server:** 51.210.209.112
- **RPC:** https://rpc.demiurge.cloud/rpc
- **QOR OS:** https://demiurge.cloud

---

See [deploy/](../../deploy/) for additional scripts.
