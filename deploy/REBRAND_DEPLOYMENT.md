# 🚀 DEMIURGE QOR REBRAND - DEPLOYMENT GUIDE

**Target Server:** `51.210.209.112` (ubuntu@)  
**Branch:** `D5-rebrand-qor`  
**Status:** ✅ Ready for deployment

---

## ⚠️ **BREAKING CHANGES**

This rebrand introduces **breaking changes** that require a **full redeployment**:

1. **Directory Structure Changed**
   - `apps/abyssid-service` → `apps/qorid-service`
   - `apps/abyssos-portal` → `apps/qloud-os`
   - `indexer/abyss-gateway` → `indexer/qor-gateway`

2. **Service Names Changed**
   - `abyssid.service` → `qorid.service`
   - `abyss-gateway.service` → `qor-gateway.service`
   - `abyss-radio.service` → `qor-radio.service`

3. **API Endpoints Changed**
   - `/api/abyssid/*` → `/api/qorid/*`

4. **Module IDs Changed** (on-chain)
   - `abyssid_registry` → `qor_registry`

---

## 📋 **DEPLOYMENT STEPS**

### **Step 1: Backup Current State**

```bash
# SSH into server
ssh ubuntu@51.210.209.112

# Create backup directory
mkdir -p ~/backups/$(date +%Y%m%d-%H%M%S)
cd ~/backups/$(date +%Y%m%d-%H%M%S)

# Backup current services
sudo systemctl stop abyssid abyss-gateway abyss-radio demiurge
sudo cp -r /opt/demiurge ./demiurge-backup
sudo cp -r /home/ubuntu/DEMIURGE ./repo-backup

# Backup systemd services
sudo cp /etc/systemd/system/abyssid.service ./
sudo cp /etc/systemd/system/abyss-gateway.service ./
sudo cp /etc/systemd/system/abyss-radio.service ./

# Backup nginx configs
sudo cp /etc/nginx/sites-available/abyss-gateway ./
sudo cp /etc/nginx/sites-available/abyssos-portal ./

echo "✅ Backup complete at: $(pwd)"
```

---

### **Step 2: Update Repository**

```bash
# Pull latest changes
cd /home/ubuntu/DEMIURGE
git fetch origin
git checkout D5-rebrand-qor
git pull origin D5-rebrand-qor

# Verify checkout
git log --oneline -3
```

---

### **Step 3: Rebuild Blockchain**

```bash
cd /home/ubuntu/DEMIURGE/chain

# Clean old build
cargo clean

# Rebuild with new module names
cargo build --release

# Verify binary
./target/release/demiurge --version

# Update systemd service (already correct if using $HOME/DEMIURGE path)
sudo systemctl daemon-reload
```

---

### **Step 4: Deploy QOR ID Service**

```bash
cd /home/ubuntu/DEMIURGE/apps/qorid-service

# Install dependencies
pnpm install

# Build
pnpm build

# Create new systemd service
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

# Enable and start
sudo systemctl daemon-reload
sudo systemctl enable qorid
sudo systemctl start qorid
sudo systemctl status qorid
```

---

### **Step 5: Deploy QOR Gateway**

```bash
cd /home/ubuntu/DEMIURGE/indexer/qor-gateway

# Install dependencies
pnpm install

# Build (if needed)
pnpm build

# Create new systemd service
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

# Enable and start
sudo systemctl daemon-reload
sudo systemctl enable qor-gateway
sudo systemctl start qor-gateway
sudo systemctl status qor-gateway

# Update nginx config
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
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    listen [::]:80;
    server_name api.demiurge.cloud;
    return 301 https://$host$request_uri;
}
EOF

# Remove old symlink and create new one
sudo rm /etc/nginx/sites-enabled/abyss-gateway
sudo ln -s /etc/nginx/sites-available/qor-gateway /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

### **Step 6: Deploy QLOUD OS**

```bash
cd /home/ubuntu/DEMIURGE/apps/qloud-os

# Install dependencies
pnpm install

# Build for production
pnpm build

# Verify build
ls -lh dist/

# Update nginx config (already correct for demiurge.cloud)
# Nginx should already be serving from /home/ubuntu/DEMIURGE/apps/qloud-os/dist

# Update permissions
chmod 755 /home/ubuntu
chmod -R 755 /home/ubuntu/DEMIURGE/apps/qloud-os/dist

# Reload nginx
sudo systemctl reload nginx
```

---

### **Step 7: Clean Up Old Services**

```bash
# Stop old services
sudo systemctl stop abyssid abyss-gateway abyss-radio

# Disable old services
sudo systemctl disable abyssid abyss-gateway abyss-radio

# Remove old service files
sudo rm /etc/systemd/system/abyssid.service
sudo rm /etc/systemd/system/abyss-gateway.service
sudo rm /etc/systemd/system/abyss-radio.service

# Remove old nginx configs
sudo rm /etc/nginx/sites-enabled/abyss-gateway
sudo rm /etc/nginx/sites-enabled/abyssos-portal
sudo rm /etc/nginx/sites-available/abyss-gateway
sudo rm /etc/nginx/sites-available/abyssos-portal

# Reload systemd
sudo systemctl daemon-reload
```

---

### **Step 8: Verify Deployment**

```bash
# Check all services
echo "=== Service Status ==="
sudo systemctl status demiurge --no-pager
sudo systemctl status qorid --no-pager
sudo systemctl status qor-gateway --no-pager

# Check nginx
echo ""
echo "=== Nginx Status ==="
sudo nginx -t
sudo systemctl status nginx --no-pager

# Test RPC endpoint
echo ""
echo "=== RPC Test ==="
curl -X POST https://rpc.demiurge.cloud/rpc \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"chain_getStatus","params":[],"id":1}'

# Test GraphQL endpoint
echo ""
echo "=== GraphQL Test ==="
curl https://api.demiurge.cloud/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __typename }"}'

# Test QLOUD OS
echo ""
echo "=== QLOUD OS Test ==="
curl -I https://demiurge.cloud

# Check logs
echo ""
echo "=== Recent Logs ==="
sudo journalctl -u qorid -n 20 --no-pager
sudo journalctl -u qor-gateway -n 20 --no-pager
```

---

### **Step 9: Restart Chain (if needed)**

```bash
# Only if you need to restart the chain with new module IDs
sudo systemctl restart demiurge

# Wait for it to start
sleep 10

# Check status
sudo systemctl status demiurge
sudo journalctl -u demiurge -n 50 --no-pager
```

---

## 🔍 **Post-Deployment Verification**

### **Frontend Tests**
1. ✅ Visit https://demiurge.cloud
2. ✅ Should see "QLOUD OS" branding
3. ✅ Login should say "Sign in with your QOR ID"
4. ✅ All Genesis theme colors applied

### **API Tests**
1. ✅ GraphQL: https://api.demiurge.cloud/graphql
2. ✅ RPC: https://rpc.demiurge.cloud/rpc

### **Chain Tests**
```bash
# Test QOR ID module
curl -X POST https://rpc.demiurge.cloud/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "qorid_get",
    "params": {"address": "0x0000000000000000000000000000000000000000000000000000000000000000"},
    "id": 1
  }'
```

---

## 🔄 **Rollback Plan**

If something goes wrong:

```bash
# Restore from backup
cd ~/backups/<timestamp>

# Stop new services
sudo systemctl stop qorid qor-gateway

# Restore old services
sudo cp abyssid.service /etc/systemd/system/
sudo cp abyss-gateway.service /etc/systemd/system/
sudo systemctl daemon-reload

# Restore code
cd /home/ubuntu/DEMIURGE
git checkout D4
git pull origin D4

# Rebuild
cd chain && cargo build --release
cd ../apps/abyssid-service && pnpm install && pnpm build
cd ../indexer/abyss-gateway && pnpm install

# Restart old services
sudo systemctl start abyssid abyss-gateway demiurge
```

---

## 📊 **Monitoring**

```bash
# Watch all logs in real-time
sudo journalctl -f -u demiurge -u qorid -u qor-gateway -u nginx

# Check resource usage
htop

# Monitor chain
watch 'curl -s -X POST http://localhost:8545/rpc -H "Content-Type: application/json" -d "{\"jsonrpc\":\"2.0\",\"method\":\"chain_getStatus\",\"params\":[],\"id\":1}" | jq'
```

---

## ✅ **Success Criteria**

- [ ] Chain running with `qor_registry` module
- [ ] QOR ID Service responding on port 8082
- [ ] QOR Gateway responding on port 4000
- [ ] QLOUD OS loading at https://demiurge.cloud
- [ ] All SSL certificates valid
- [ ] No errors in logs
- [ ] RPC endpoint responding
- [ ] GraphQL endpoint responding

---

**Deployment prepared by:** DEMIURGE AI Assistant  
**Date:** January 8, 2026  
**Branch:** D5-rebrand-qor  
**Breaking Changes:** Yes - Full redeployment required
