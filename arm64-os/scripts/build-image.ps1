# PowerShell wrapper to build DEMIURGE ARM64 OS image
# This script launches the bash build script in WSL

$ErrorActionPreference = "Stop"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  DEMIURGE ARM64 OS Image Builder" -ForegroundColor Cyan
Write-Host "  Raspberry Pi 5" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if WSL is available
$wslAvailable = Get-Command wsl -ErrorAction SilentlyContinue

if (-not $wslAvailable) {
    Write-Host "[ERROR] WSL is not installed or not in PATH" -ForegroundColor Red
    Write-Host "`nPlease install WSL2:" -ForegroundColor Yellow
    Write-Host "  1. Run: wsl --install" -ForegroundColor White
    Write-Host "  2. Restart your computer" -ForegroundColor White
    Write-Host "  3. Run this script again" -ForegroundColor White
    exit 1
}

# Get the Windows path and convert to WSL path
$currentPath = (Get-Location).Path
$wslPath = $currentPath -replace '^([A-Z]):', '/mnt/$1' -replace '\\', '/'
$wslPath = $wslPath.ToLower()

Write-Host "[INFO] Building in WSL..." -ForegroundColor Cyan
Write-Host "WSL Path: $wslPath`n" -ForegroundColor Gray

# Check prerequisites in WSL
Write-Host "[1/6] Checking prerequisites in WSL..." -ForegroundColor Cyan
$prereqCheck = wsl bash -c "command -v docker >/dev/null 2>&1 && command -v qemu-aarch64-static >/dev/null 2>&1 && echo 'OK' || echo 'MISSING'"

if ($prereqCheck -eq "MISSING") {
    Write-Host "[WARN] Some prerequisites are missing in WSL" -ForegroundColor Yellow
    Write-Host "The build script will attempt to install them automatically." -ForegroundColor Yellow
    Write-Host "You may be prompted for your WSL password.`n" -ForegroundColor Yellow
}

# Warn about time and space
Write-Host "[INFO] Build Information:" -ForegroundColor Cyan
Write-Host "  - Estimated time: 1-2 hours" -ForegroundColor White
Write-Host "  - Disk space needed: ~10GB" -ForegroundColor White
Write-Host "  - Downloads: ~500MB (Raspberry Pi OS)" -ForegroundColor White
Write-Host "`nThis will download and build a complete OS image." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to cancel, or any key to continue..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Run the build script in WSL
Write-Host "`n[2/6] Starting build process in WSL...`n" -ForegroundColor Cyan

wsl bash -c "cd '$wslPath' && chmod +x scripts/build-image.sh && ./scripts/build-image.sh"

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n[OK] Build completed successfully!" -ForegroundColor Green
    Write-Host "`nImage location: $currentPath\build\demiurge-arm64-*.img" -ForegroundColor Cyan
    Write-Host "`nNext steps:" -ForegroundColor Yellow
    Write-Host "  1. Flash image to SD card using Raspberry Pi Imager" -ForegroundColor White
    Write-Host "  2. Or use: wsl sudo dd if=build/demiurge-arm64-*.img of=/dev/sdX bs=4M status=progress" -ForegroundColor White
} else {
    Write-Host "`n[ERROR] Build failed. Check the output above for details." -ForegroundColor Red
    exit 1
}
