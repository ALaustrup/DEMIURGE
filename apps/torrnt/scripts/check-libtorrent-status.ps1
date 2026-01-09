# Check libtorrent installation status

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  libtorrent Installation Status" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if libtorrent is installed
$libtorrentHeader = "$env:USERPROFILE\vcpkg\installed\x64-windows\include\libtorrent\session.hpp"
$libtorrentLib = "$env:USERPROFILE\vcpkg\installed\x64-windows\lib\torrent-rasterbar.lib"

if (Test-Path $libtorrentHeader -and Test-Path $libtorrentLib) {
    Write-Host "[OK] libtorrent is installed!" -ForegroundColor Green
    Write-Host "  Headers: $libtorrentHeader" -ForegroundColor Cyan
    Write-Host "  Library: $libtorrentLib" -ForegroundColor Cyan
    Write-Host "`nYou can now rebuild TORRNT with full torrenting support." -ForegroundColor Green
} else {
    Write-Host "[WARN] libtorrent not yet installed" -ForegroundColor Yellow
    
    # Check installation log
    $logFile = "$env:TEMP\vcpkg-libtorrent-install.log"
    if (Test-Path $logFile) {
        Write-Host "`nInstallation in progress. Last 10 lines of log:" -ForegroundColor Cyan
        Get-Content $logFile -Tail 10
        Write-Host "`nFull log: $logFile" -ForegroundColor Gray
    } else {
        Write-Host "`nTo install libtorrent, run:" -ForegroundColor Yellow
        Write-Host "  cd `$env:USERPROFILE\vcpkg" -ForegroundColor White
        Write-Host "  .\vcpkg.exe install libtorrent:x64-windows" -ForegroundColor White
    }
}

# Check vcpkg list
Write-Host "`nInstalled packages:" -ForegroundColor Cyan
cd $env:USERPROFILE\vcpkg
.\vcpkg.exe list | Select-String "libtorrent|boost|openssl" | Select-Object -First 10
