#!/bin/bash
# Full Ecosystem Deployment Script for Demiurge Blockchain
# Server: 51.210.209.112
# User: root

set -e

SERVER="root@51.210.209.112"
REPO_DIR="/opt/demiurge"

echo "=== PHASE B: SYNC ARTIFACTS TO PRODUCTION SERVER ==="

# PHASE OMEGA: Ensure only dist/ artifacts are deployed
# 1. Upload QLOUD OS (only dist/ directory)
echo "Uploading QLOUD OS (dist/ only)..."
if [ ! -d "apps/qloud-os/dist" ]; then
  echo "ERROR: apps/qloud-os/dist/ not found. Run 'pnpm build' first."
  exit 1
fi
rsync -avz --delete apps/qloud-os/dist/ $SERVER:/var/www/qloud-os/

# 2. Upload QorID backend (only dist/ directory)
echo "Uploading QorID backend (dist/ only)..."
if [ ! -d "apps/qorid-service/dist" ]; then
  echo "ERROR: apps/qorid-service/dist/ not found. Run 'pnpm build' first."
  exit 1
fi
ssh $SERVER "mkdir -p $REPO_DIR/qorid-service"
rsync -avz --delete apps/qorid-service/dist/ $SERVER:$REPO_DIR/qorid-service/
if [ -f apps/qorid-service/.env.production ]; then
  rsync -avz apps/qorid-service/.env.production $SERVER:$REPO_DIR/qorid-service/.env
fi

# 3. Upload DNS Service (only dist/ directory)
echo "Uploading DNS Service (dist/ only)..."
if [ ! -d "apps/dns-service/dist" ]; then
  echo "ERROR: apps/dns-service/dist/ not found. Run 'pnpm build' first."
  exit 1
fi
ssh $SERVER "mkdir -p $REPO_DIR/dns-service"
rsync -avz --delete apps/dns-service/dist/ $SERVER:$REPO_DIR/dns-service/
if [ -f apps/dns-service/.env.production ]; then
  rsync -avz apps/dns-service/.env.production $SERVER:$REPO_DIR/dns-service/.env
fi

# 4. Upload QOR Gateway / Indexer (only dist/ directory)
echo "Uploading QOR Gateway (dist/ only)..."
if [ ! -d "indexer/qor-gateway/dist" ]; then
  echo "ERROR: indexer/qor-gateway/dist/ not found. Run 'pnpm build' first."
  exit 1
fi
ssh $SERVER "mkdir -p $REPO_DIR/qor-gateway"
rsync -avz --delete indexer/qor-gateway/dist/ $SERVER:$REPO_DIR/qor-gateway/

# 5. Upload Demiurge Chain Node (release binary only)
echo "Uploading Demiurge Chain Node (release binary only)..."
if [ ! -f "chain/target/release/demiurge-chain" ]; then
  echo "ERROR: chain/target/release/demiurge-chain not found. Run 'cargo build --release' first."
  exit 1
fi
ssh $SERVER "mkdir -p $REPO_DIR/bin $REPO_DIR/config"
rsync -avz chain/target/release/demiurge-chain $SERVER:$REPO_DIR/bin/demiurge-chain
rsync -avz chain/configs/*.toml $SERVER:$REPO_DIR/config/

echo "=== PHASE C: CREATE/UPDATE SYSTEMD SERVICES ==="

# Upload systemd service files
scp deploy/systemd/*.service $SERVER:/tmp/
ssh $SERVER "sudo mv /tmp/*.service /etc/systemd/system/"

echo "=== PHASE D: NGINX CONFIGURATION ==="

# Upload nginx config
scp deploy/nginx/demiurge.cloud.conf $SERVER:/tmp/demiurge.cloud.conf
ssh $SERVER "sudo mv /tmp/demiurge.cloud.conf /etc/nginx/sites-available/demiurge.cloud"
ssh $SERVER "sudo ln -sf /etc/nginx/sites-available/demiurge.cloud /etc/nginx/sites-enabled/demiurge.cloud"
ssh $SERVER "sudo nginx -t && sudo systemctl reload nginx"

echo "=== PHASE E: ENABLE & START ALL SERVICES ==="

ssh $SERVER "sudo systemctl daemon-reload"
ssh $SERVER "sudo systemctl enable demiurge-chain abyssid dns-service qor-gateway"
ssh $SERVER "sudo systemctl restart demiurge-chain abyssid dns-service qor-gateway"

echo "=== PHASE F: POST-DEPLOYMENT VALIDATION ==="

echo "Checking services status..."
ssh $SERVER "sudo systemctl status demiurge-chain --no-pager | head -5"
ssh $SERVER "sudo systemctl status abyssid --no-pager | head -5"
ssh $SERVER "sudo systemctl status dns-service --no-pager | head -5"
ssh $SERVER "sudo systemctl status qor-gateway --no-pager | head -5"

echo ""
echo "=== Deployment Complete ==="
echo "Services should be running. Test endpoints:"
echo "  - RPC: https://rpc.demiurge.cloud/rpc"
echo "  - QorID: https://id.demiurge.cloud/api/qorid/me"
echo "  - DNS: https://dns.demiurge.cloud/api/dns/lookup?domain=demiurge.cloud"
echo "  - Gateway: https://gateway.demiurge.cloud/graphql"
echo "  - QOR OS: https://demiurge.cloud"

