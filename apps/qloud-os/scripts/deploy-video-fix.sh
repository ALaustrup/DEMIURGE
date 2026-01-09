#!/usr/bin/env bash
# Deploy video fix to demiurge.cloud server
# This updates Nginx config and ensures video is available

set -euo pipefail

SERVER_IP="51.210.209.112"
SERVER_USER="ubuntu"
DEPLOY_PATH="/var/www/qloud-os"

echo "=========================================="
echo "  Deploying Video Fix to demiurge.cloud"
echo "=========================================="

# Step 1: Update Nginx config
echo "[1/3] Updating Nginx configuration..."
scp apps/qloud-os/nginx-demiurge.cloud-https.conf "${SERVER_USER}@${SERVER_IP}:/tmp/nginx-demiurge.cloud-https.conf"

ssh "${SERVER_USER}@${SERVER_IP}" <<'ENDSSH'
sudo cp /tmp/nginx-demiurge.cloud-https.conf /etc/nginx/sites-available/demiurge.cloud
sudo nginx -t
sudo systemctl reload nginx
echo "✅ Nginx config updated"
ENDSSH

# Step 2: Ensure video exists on server
echo "[2/3] Ensuring video file exists on server..."
ssh "${SERVER_USER}@${SERVER_IP}" "test -f ${DEPLOY_PATH}/video/intro.mp4 && echo '✅ Video exists' || echo '⚠️  Video missing - will copy'"

# Step 3: Copy video if needed
echo "[3/3] Copying video file..."
if [ -f "apps/qloud-os/public/video/intro.mp4" ]; then
    scp apps/qloud-os/public/video/intro.mp4 "${SERVER_USER}@${SERVER_IP}:${DEPLOY_PATH}/video/intro.mp4"
    echo "✅ Video copied to server"
else
    echo "⚠️  Video file not found locally"
fi

echo ""
echo "=========================================="
echo "  Deployment complete!"
echo "=========================================="
echo "Video should now be accessible at:"
echo "  https://demiurge.cloud/video/intro.mp4"
echo ""
echo "Test: curl -I https://demiurge.cloud/video/intro.mp4"
