#!/usr/bin/env bash
# Image customization script
# Runs inside chroot during image building

set -euo pipefail

echo "Customizing DEMIURGE ARM64 OS image..."

# Set hostname
echo "demiurge-pi" > /etc/hostname
hostnamectl set-hostname demiurge-pi

# Configure network (enable SSH on first boot)
cat > /etc/rc.local <<'EOF'
#!/bin/sh -e
# Enable SSH on first boot
if [ ! -f /boot/ssh ]; then
    touch /boot/ssh
    systemctl enable ssh
    systemctl start ssh
fi
exit 0
EOF
chmod +x /etc/rc.local

# Configure auto-login (optional, for kiosk mode)
# Uncomment if you want auto-login to desktop
# mkdir -p /etc/systemd/system/getty@tty1.service.d
# cat > /etc/systemd/system/getty@tty1.service.d/autologin.conf <<'EOF'
# [Service]
# ExecStart=
# ExecStart=-/sbin/agetty --autologin demiurge --noclear %I $TERM
# EOF

# Set up firewall
apt-get install -y ufw
ufw --force enable
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow 8545/tcp  # Chain RPC
ufw allow 4000/tcp  # GraphQL
ufw allow 8082/tcp  # QorID Service

# Configure Nginx
cat > /etc/nginx/sites-available/demiurge <<'EOF'
server {
    listen 80;
    server_name _;

    # Portal Web
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # QLOUD OS
    location /qloud {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # GraphQL API
    location /graphql {
        proxy_pass http://localhost:4000/graphql;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
EOF
ln -sf /etc/nginx/sites-available/demiurge /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Enable services
systemctl enable nginx
systemctl enable ssh

# Set up automatic updates
apt-get install -y unattended-upgrades
cat > /etc/apt/apt.conf.d/50unattended-upgrades <<'EOF'
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}-security";
    "${distro_id}ESMApps:${distro_codename}-apps-security";
    "${distro_id}ESM:${distro_codename}-infra-security";
};
Unattended-Upgrade::AutoFixInterruptedDpkg "true";
Unattended-Upgrade::MinimalSteps "true";
Unattended-Upgrade::Remove-Unused-Kernel-Packages "true";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
Unattended-Upgrade::Automatic-Reboot "false";
EOF

echo "Image customization complete!"
