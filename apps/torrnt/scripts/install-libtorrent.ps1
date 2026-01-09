# TORRNT - libtorrent Installation Script for Windows
# This script helps install libtorrent-rasterbar via vcpkg

param(
    [string]$VcpkgPath = "",
    [switch]$InstallVcpkg = $false
)

$ErrorActionPreference = "Stop"

function Write-Step { param($msg) Write-Host "`n▶ $msg" -ForegroundColor Cyan }
function Write-Success { param($msg) Write-Host "[OK] $msg" -ForegroundColor Green }
function Write-ErrorMsg { param($msg) Write-Host "[ERROR] $msg" -ForegroundColor Red }
function Write-Warning { param($msg) Write-Host "[WARN] $msg" -ForegroundColor Yellow }

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  TORRNT - libtorrent Installation" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if vcpkg is already installed
if ([string]::IsNullOrEmpty($VcpkgPath)) {
    $vcpkgExe = Get-Command vcpkg -ErrorAction SilentlyContinue
    if ($vcpkgExe) {
        $VcpkgPath = Split-Path (Split-Path $vcpkgExe.Source -Parent) -Parent
        Write-Success "Found vcpkg at: $VcpkgPath"
    }
}

# Install vcpkg if needed
if ([string]::IsNullOrEmpty($VcpkgPath) -or $InstallVcpkg) {
    if ($InstallVcpkg -or (Read-Host "vcpkg not found. Install vcpkg? (y/n)") -eq "y") {
        Write-Step "Installing vcpkg..."
        
        $vcpkgDir = "$env:USERPROFILE\vcpkg"
        if (-not (Test-Path $vcpkgDir)) {
            Write-Step "Cloning vcpkg repository..."
            git clone https://github.com/Microsoft/vcpkg.git $vcpkgDir
            if ($LASTEXITCODE -ne 0) {
                Write-ErrorMsg "Failed to clone vcpkg repository"
                exit 1
            }
        }
        
        Write-Step "Bootstrapping vcpkg..."
        Push-Location $vcpkgDir
        .\bootstrap-vcpkg.bat
        if ($LASTEXITCODE -ne 0) {
            Write-ErrorMsg "Failed to bootstrap vcpkg"
            Pop-Location
            exit 1
        }
        Pop-Location
        
        $VcpkgPath = $vcpkgDir
        Write-Success "vcpkg installed at: $VcpkgDir"
        
        # Add to PATH for current session
        $env:PATH = "$VcpkgPath;$env:PATH"
    } else {
        Write-ErrorMsg "vcpkg is required. Please install it manually or run with -InstallVcpkg"
        exit 1
    }
}

# Verify vcpkg
$vcpkgExe = Join-Path $VcpkgPath "vcpkg.exe"
if (-not (Test-Path $vcpkgExe)) {
    Write-ErrorMsg "vcpkg.exe not found at: $vcpkgExe"
    exit 1
}

Write-Step "Installing libtorrent:x64-windows..."
Push-Location $VcpkgPath
& $vcpkgExe install libtorrent:x64-windows
if ($LASTEXITCODE -ne 0) {
    Write-ErrorMsg "Failed to install libtorrent"
    Pop-Location
    exit 1
}
Pop-Location

Write-Success "libtorrent installed successfully!"
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. When building TORRNT, set CMAKE_TOOLCHAIN_FILE to: $VcpkgPath\scripts\buildsystems\vcpkg.cmake" -ForegroundColor White
Write-Host "2. Or set VCPKG_ROOT environment variable to: $VcpkgPath" -ForegroundColor White
Write-Host "`nExample CMake command:" -ForegroundColor Yellow
Write-Host "cmake .. -G `"Visual Studio 17 2022`" -A x64 `" -ForegroundColor White
Write-Host "  -DCMAKE_PREFIX_PATH=`"C:\Qt\6.10.1\msvc2022_64`" `" -ForegroundColor White
Write-Host "  -DCMAKE_TOOLCHAIN_FILE=`"$VcpkgPath\scripts\buildsystems\vcpkg.cmake`"" -ForegroundColor White
