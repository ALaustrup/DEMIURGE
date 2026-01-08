#!/usr/bin/env bash
# Create systemd service files on server
# Run this on the server

set -euo pipefail

echo "=== Creating Systemd Service Files ==="
echo ""

# Create systemd directory
mkdir -p /opt/demiurge/deploy/systemd

# Create demiurge-chain.service
cat > /opt/demiurge/deploy/systemd/demiurge-chain.service << 'EOF'
[Unit]
Description=Demiurge L1 Chain Node
After=network-online.target
Wants=network-online.target

[Service]
ExecStart=/opt/demiurge/bin/demiurge-chain
WorkingDirectory=/opt/demiurge/
Restart=always
RestartSec=5
User=root
LimitNOFILE=65535
Environment=RUST_LOG=info
StandardOutput=journal
StandardError=journal

# Security hardening
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ReadWritePaths=/opt/demiurge/.demiurge

[Install]
WantedBy=multi-user.target
EOF

# Create abyssid.service
cat > /opt/demiurge/deploy/systemd/abyssid.service << 'EOF'
[Unit]
Description=QorID Identity Backend
After=network.target

[Service]
ExecStart=/usr/bin/node /opt/demiurge/qorid-service/dist/index.js
WorkingDirectory=/opt/demiurge/qorid-service/
Restart=always
RestartSec=5
EnvironmentFile=/opt/demiurge/qorid-service/.env
User=root
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

# Create dns-service.service
cat > /opt/demiurge/deploy/systemd/dns-service.service << 'EOF'
[Unit]
Description=Demiurge DNS Service
After=network.target

[Service]
ExecStart=/usr/bin/node /opt/demiurge/dns-service/dist/index.js
WorkingDirectory=/opt/demiurge/dns-service/
Restart=always
RestartSec=5
EnvironmentFile=/opt/demiurge/dns-service/.env
User=root
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

# Create qor-gateway.service
cat > /opt/demiurge/deploy/systemd/qor-gateway.service << 'EOF'
[Unit]
Description=QOR Gateway (Indexer + GraphQL)
After=network.target

[Service]
ExecStart=/usr/bin/node /opt/demiurge/qor-gateway/dist/index.js
WorkingDirectory=/opt/demiurge/qor-gateway/
Restart=always
RestartSec=5
User=root
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

echo "✅ Service files created in /opt/demiurge/deploy/systemd/"
echo ""
echo "Now run:"
echo "  sudo cp /opt/demiurge/deploy/systemd/*.service /etc/systemd/system/"
echo "  sudo systemctl daemon-reload"
echo "  sudo systemctl enable demiurge-chain"
echo "  sudo systemctl start demiurge-chain"
