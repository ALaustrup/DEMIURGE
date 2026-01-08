#!/bin/bash
# DEMIURGE QOR Rebrand - Automated Deployment Script
# Run this on the server: ubuntu@51.210.209.112

set -e  # Exit on error

echo "=========================================="
echo "  DEMIURGE QOR REBRAND DEPLOYMENT"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
REPO_DIR="/home/ubuntu/DEMIURGE"
BACKUP_DIR="$HOME/backups/$(date +%Y%m%d-%H%M%S)"

echo -e "${YELLOW}⚠️  WARNING: This will deploy breaking changes${NC}"
echo "   - Service names will change"
echo "   - Directory structure will change"
echo "   - API endpoints will change"
echo ""
read -p "Continue with deployment? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Deployment cancelled."
    exit 0
fi

# Step 1: Backup
echo ""
echo -e "${GREEN}[1/9] Creating backup...${NC}"
mkdir -p "$BACKUP_DIR"
cd "$BACKUP_DIR"

echo "  - Stopping services..."
sudo systemctl stop abyssid abyss-gateway abyss-radio demiurge 2>/dev/null || true

echo "  - Backing up /opt/demiurge..."
if [ -d "/opt/demiurge" ]; then
    sudo cp -r /opt/demiurge ./demiurge-backup
fi

echo "  - Backing up repository..."
cp -r "$REPO_DIR" ./repo-backup

echo "  - Backing up systemd services..."
sudo cp /etc/systemd/system/abyssid.service ./ 2>/dev/null || true
sudo cp /etc/systemd/system/abyss-gateway.service ./ 2>/dev/null || true
sudo cp /etc/systemd/system/abyss-radio.service ./ 2>/dev/null || true

echo -e "${GREEN}✅ Backup complete: $BACKUP_DIR${NC}"

# Step 2: Update Repository
echo ""
echo -e "${GREEN}[2/9] Updating repository...${NC}"
cd "$REPO_DIR"
git fetch origin
git checkout D5-rebrand-qor
git pull origin D5-rebrand-qor
echo -e "${GREEN}✅ Repository updated${NC}"

# Step 3: Rebuild Chain
echo ""
echo -e "${GREEN}[3/9] Rebuilding blockchain...${NC}"
cd "$REPO_DIR/chain"
cargo clean
cargo build --release
echo -e "${GREEN}✅ Chain rebuilt${NC}"

# Step 4: Deploy QOR ID Service
echo ""
echo -e "${GREEN}[4/9] Deploying QOR ID Service...${NC}"
cd "$REPO_DIR/apps/qorid-service"
pnpm install
pnpm build || echo "No build step needed"

# Create systemd service
sudo tee /etc/systemd/system/qorid.service > /dev/null <<'EOF'
[Unit]
Description=QOR ID Service
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/DEMIURGE/apps/qorid-service
Environment=NODE_ENV=production
Environment=PORT=8082
ExecStart=/usr/bin/node --import tsx src/index.ts
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable qorid
echo -e "${GREEN}✅ QOR ID Service deployed${NC}"

# Step 5: Deploy QOR Gateway
echo ""
echo -e "${GREEN}[5/9] Deploying QOR Gateway...${NC}"
cd "$REPO_DIR/indexer/qor-gateway"
pnpm install

# Create systemd service
sudo tee /etc/systemd/system/qor-gateway.service > /dev/null <<'EOF'
[Unit]
Description=QOR Gateway GraphQL API
After=network.target demiurge.service

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/DEMIURGE/indexer/qor-gateway
Environment=NODE_ENV=production
Environment=PORT=4000
Environment=RPC_URL=http://localhost:8545
ExecStart=/usr/bin/node --import tsx src/index.ts
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable qor-gateway

# Update nginx
sudo tee /etc/nginx/sites-available/qor-gateway > /dev/null <<'EOF'
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.demiurge.cloud;

    ssl_certificate /etc/letsencrypt/live/api.demiurge.cloud/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.demiurge.cloud/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

server {
    listen 80;
    server_name api.demiurge.cloud;
    return 301 https://$host$request_uri;
}
EOF

sudo rm -f /etc/nginx/sites-enabled/abyss-gateway
sudo ln -sf /etc/nginx/sites-available/qor-gateway /etc/nginx/sites-enabled/
echo -e "${GREEN}✅ QOR Gateway deployed${NC}"

# Step 6: Deploy QLOUD OS
echo ""
echo -e "${GREEN}[6/9] Deploying QLOUD OS...${NC}"
cd "$REPO_DIR/apps/qloud-os"
pnpm install
pnpm build

chmod 755 /home/ubuntu
chmod -R 755 "$REPO_DIR/apps/qloud-os/dist"
echo -e "${GREEN}✅ QLOUD OS deployed${NC}"

# Step 7: Clean up old services
echo ""
echo -e "${GREEN}[7/9] Cleaning up old services...${NC}"
sudo systemctl disable abyssid 2>/dev/null || true
sudo systemctl disable abyss-gateway 2>/dev/null || true
sudo systemctl disable abyss-radio 2>/dev/null || true

sudo rm -f /etc/systemd/system/abyssid.service
sudo rm -f /etc/systemd/system/abyss-gateway.service
sudo rm -f /etc/systemd/system/abyss-radio.service

sudo rm -f /etc/nginx/sites-enabled/abyss-gateway
sudo rm -f /etc/nginx/sites-available/abyss-gateway
sudo rm -f /etc/nginx/sites-available/abyssos-portal

sudo systemctl daemon-reload
echo -e "${GREEN}✅ Old services cleaned up${NC}"

# Step 8: Start services
echo ""
echo -e "${GREEN}[8/9] Starting services...${NC}"
sudo systemctl start demiurge
sleep 5
sudo systemctl start qorid
sudo systemctl start qor-gateway

sudo nginx -t && sudo systemctl reload nginx
echo -e "${GREEN}✅ Services started${NC}"

# Step 9: Verification
echo ""
echo -e "${GREEN}[9/9] Verifying deployment...${NC}"
echo ""
echo "  Chain Status:"
sudo systemctl status demiurge --no-pager | head -5

echo ""
echo "  QOR ID Status:"
sudo systemctl status qorid --no-pager | head -5

echo ""
echo "  QOR Gateway Status:"
sudo systemctl status qor-gateway --no-pager | head -5

echo ""
echo "  Nginx Status:"
sudo systemctl status nginx --no-pager | head -5

echo ""
echo -e "${GREEN}=========================================="
echo "  DEPLOYMENT COMPLETE!"
echo "==========================================${NC}"
echo ""
echo "✅ Backup location: $BACKUP_DIR"
echo "✅ Branch: D5-rebrand-qor"
echo ""
echo "Test URLs:"
echo "  - QLOUD OS: https://demiurge.cloud"
echo "  - GraphQL:  https://api.demiurge.cloud/graphql"
echo "  - RPC:      https://rpc.demiurge.cloud/rpc"
echo ""
echo "Monitor logs:"
echo "  sudo journalctl -f -u demiurge -u qorid -u qor-gateway"
echo ""
