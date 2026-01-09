#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Create a simple self-extracting installer using PowerShell
    
.DESCRIPTION
    Creates a PowerShell-based installer that extracts and installs DEMIURGE QOR
    without requiring Qt Installer Framework.
#>

param(
    [string]$Version = "1.0.0"
)

$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$DataDir = Join-Path $ProjectRoot "installer\packages\com.demiurge.qor\data"
$InstallerName = "DEMIURGE-QOR-$Version-Setup.ps1"
$InstallerPath = Join-Path $ProjectRoot $InstallerName

Write-Host "Creating simple installer..." -ForegroundColor Cyan

# Create installer script
$installerScript = @"
# DEMIURGE QOR Installer v$Version
# Self-extracting installer

`$ErrorActionPreference = "Stop"

Write-Host "DEMIURGE QOR Installer v$Version" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Check admin rights
`$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not `$isAdmin) {
    Write-Host "This installer requires administrator privileges." -ForegroundColor Yellow
    Write-Host "Please run PowerShell as Administrator." -ForegroundColor Yellow
    pause
    exit 1
}

# Installation directory
`$installDir = "C:\Program Files\Demiurge\QOR"
Write-Host "Installing to: `$installDir" -ForegroundColor Cyan

# Create directory
if (-not (Test-Path `$installDir)) {
    New-Item -ItemType Directory -Path `$installDir -Force | Out-Null
}

# Extract embedded files (base64 encoded)
# Note: In a real implementation, files would be embedded here
Write-Host "`nCopying files..." -ForegroundColor Yellow

# For now, copy from source
`$sourceDir = "$DataDir"
if (Test-Path `$sourceDir) {
    Copy-Item -Path "`$sourceDir\*" -Destination `$installDir -Recurse -Force
    Write-Host "[OK] Files copied" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Source files not found" -ForegroundColor Red
    exit 1
}

# Create shortcuts
Write-Host "`nCreating shortcuts..." -ForegroundColor Yellow

`$WshShell = New-Object -ComObject WScript.Shell
`$exePath = Join-Path `$installDir "GenesisLauncher.exe"

# Start Menu shortcut
`$startMenu = [Environment]::GetFolderPath("Programs")
`$startMenuDir = Join-Path `$startMenu "DEMIURGE"
if (-not (Test-Path `$startMenuDir)) {
    New-Item -ItemType Directory -Path `$startMenuDir -Force | Out-Null
}
`$shortcut = `$WshShell.CreateShortcut((Join-Path `$startMenuDir "DEMIURGE QOR.lnk"))
`$shortcut.TargetPath = `$exePath
`$shortcut.WorkingDirectory = `$installDir
`$shortcut.Description = "Launch DEMIURGE QOR"
`$shortcut.Save()
Write-Host "[OK] Start Menu shortcut created" -ForegroundColor Green

# Desktop shortcut
`$desktop = [Environment]::GetFolderPath("Desktop")
`$desktopShortcut = `$WshShell.CreateShortcut((Join-Path `$desktop "DEMIURGE QOR.lnk"))
`$desktopShortcut.TargetPath = `$exePath
`$desktopShortcut.WorkingDirectory = `$installDir
`$desktopShortcut.Description = "Launch DEMIURGE QOR"
`$desktopShortcut.Save()
Write-Host "[OK] Desktop shortcut created" -ForegroundColor Green

Write-Host "`n================================`n" -ForegroundColor Cyan
Write-Host "Installation complete!" -ForegroundColor Green
Write-Host "`nDEMIURGE QOR has been installed to: `$installDir" -ForegroundColor Cyan
Write-Host "`nYou can launch it from the Start Menu or Desktop shortcut." -ForegroundColor Yellow
Write-Host "`nPress any key to exit..."
`$null = `$Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
"@

# Save installer script
$installerScript | Out-File -FilePath $InstallerPath -Encoding UTF8

Write-Host "[OK] Simple installer created: $InstallerName" -ForegroundColor Green
Write-Host "Location: $InstallerPath" -ForegroundColor Cyan
Write-Host "`nNote: This is a basic installer. For production, install Qt Installer Framework." -ForegroundColor Yellow
