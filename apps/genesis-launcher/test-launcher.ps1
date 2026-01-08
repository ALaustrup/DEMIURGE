# Safe launcher test script - prevents Cursor crashes
# This launches the executable without capturing output

$exePath = ".\build-installer\Release\GenesisLauncher.exe"

if (Test-Path $exePath) {
    Write-Host "Launching GenesisLauncher..." -ForegroundColor Green
    Write-Host "Window should appear shortly..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To stop: Close the launcher window or press Ctrl+C here" -ForegroundColor Cyan
    
    # Launch without capturing output to prevent Cursor crashes
    Start-Process -FilePath $exePath -WorkingDirectory (Split-Path $exePath -Parent)
    
    Write-Host ""
    Write-Host "Launcher started! Check your screen for the window." -ForegroundColor Green
} else {
    Write-Host "ERROR: Executable not found at: $exePath" -ForegroundColor Red
    Write-Host "Please build the launcher first." -ForegroundColor Yellow
}
