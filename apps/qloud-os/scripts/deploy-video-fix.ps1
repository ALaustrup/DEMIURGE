# Deploy video fix to demiurge.cloud server
# This updates Nginx config and ensures video is available

$ErrorActionPreference = "Stop"

$ServerIp = "51.210.209.112"
$ServerUser = "ubuntu"
$DeployPath = "/var/www/qloud-os"

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "  Deploying Video Fix to demiurge.cloud" -ForegroundColor Cyan
Write-Host "==========================================`n" -ForegroundColor Cyan

# Step 1: Update Nginx config
Write-Host "[1/3] Updating Nginx configuration..." -ForegroundColor Blue
$nginxConfig = "apps\qloud-os\nginx-demiurge.cloud-https.conf"
if (Test-Path $nginxConfig) {
    scp $nginxConfig "${ServerUser}@${ServerIp}:/tmp/nginx-demiurge.cloud-https.conf"
    
    ssh "${ServerUser}@${ServerIp}" @"
sudo cp /tmp/nginx-demiurge.cloud-https.conf /etc/nginx/sites-available/demiurge.cloud
sudo nginx -t
sudo systemctl reload nginx
echo '✅ Nginx config updated'
"@
    Write-Host "✅ Nginx config updated" -ForegroundColor Green
} else {
    Write-Host "⚠️  Nginx config not found" -ForegroundColor Yellow
}

# Step 2: Check if video exists on server
Write-Host "`n[2/3] Checking video on server..." -ForegroundColor Blue
$videoCheck = ssh "${ServerUser}@${ServerIp}" "test -f ${DeployPath}/video/intro.mp4 && echo 'EXISTS' || echo 'MISSING'"
if ($videoCheck -eq "EXISTS") {
    Write-Host "✅ Video exists on server" -ForegroundColor Green
} else {
    Write-Host "⚠️  Video missing on server" -ForegroundColor Yellow
}

# Step 3: Copy video if needed
Write-Host "`n[3/3] Copying video file..." -ForegroundColor Blue
$localVideo = "apps\qloud-os\public\video\intro.mp4"
if (Test-Path $localVideo) {
    # Ensure video directory exists on server
    ssh "${ServerUser}@${ServerIp}" "mkdir -p ${DeployPath}/video"
    
    # Copy video
    scp $localVideo "${ServerUser}@${ServerIp}:${DeployPath}/video/intro.mp4"
    Write-Host "✅ Video copied to server" -ForegroundColor Green
} else {
    Write-Host "⚠️  Video file not found at: $localVideo" -ForegroundColor Yellow
    Write-Host "   Please ensure video is in public/video/intro.mp4" -ForegroundColor Yellow
}

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "  Deployment complete!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "`nVideo should now be accessible at:" -ForegroundColor Yellow
Write-Host "  https://demiurge.cloud/video/intro.mp4" -ForegroundColor White
Write-Host "`nTest with:" -ForegroundColor Yellow
Write-Host "  curl -I https://demiurge.cloud/video/intro.mp4" -ForegroundColor White
