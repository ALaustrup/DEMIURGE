# 🧪 Testing the QOR Launcher

## ⚠️ **Cursor Crash Issue**

**Problem:** Running the launcher with output redirection (`2>&1 | Select-Object`) causes Cursor to crash due to excessive output or error loops.

**Solution:** Use the safe test script or launch directly without capturing output.

---

## ✅ **Safe Testing Methods**

### **Method 1: Use Test Script (Recommended)**
```powershell
cd C:\Repos\DEMIURGE\apps\genesis-launcher
.\test-launcher.ps1
```

This launches the executable without capturing output, preventing Cursor crashes.

### **Method 2: Direct Launch (No Output Capture)**
```powershell
cd C:\Repos\DEMIURGE\apps\genesis-launcher\build-installer\Release
Start-Process .\GenesisLauncher.exe
```

**DO NOT** use `| Select-Object` or any output redirection - it causes crashes!

### **Method 3: Launch from Installer Directory**
The installer package has all DLLs bundled:
```powershell
cd C:\Repos\DEMIURGE\apps\genesis-launcher\installer\packages\com.demiurge.qor\data
.\DemiurgeQOR.exe
```

---

## 🔍 **Troubleshooting**

### **Launcher Doesn't Open Window**

**Possible Causes:**
1. **Missing Qt DLLs** - Executable needs Qt6Core.dll, Qt6Qml.dll, etc.
2. **Missing QML Resources** - QML files not compiled into executable
3. **Missing Platform Plugin** - `platforms/qwindows.dll` not found
4. **QML Load Error** - LauncherWindow.qml not found in resources

**Check:**
```powershell
# Check if DLLs exist in Release directory
cd C:\Repos\DEMIURGE\apps\genesis-launcher\build-installer\Release
Get-ChildItem *.dll | Select-Object Name

# Check for platform plugin
Test-Path "platforms\qwindows.dll"
```

**Fix:**
- Run `windeployqt` to copy all Qt dependencies:
```powershell
& "C:\Qt\6.10.1\msvc2022_64\bin\windeployqt.exe" `
  --qmldir ..\..\src\qml `
  --release `
  .\GenesisLauncher.exe
```

### **Launcher Crashes Immediately**

**Check Windows Event Viewer:**
1. Open Event Viewer
2. Windows Logs → Application
3. Look for errors from "GenesisLauncher.exe"

**Common Issues:**
- Missing `qwindows.dll` platform plugin
- QML file not found in resources
- Missing font files
- Missing icon files

---

## 📋 **What Should Happen**

When the launcher starts successfully, you should see:

1. **Intro Video** (if `videos/intro.mp4` exists) or skip to login
2. **Login Screen:**
   - "GENESIS" title
   - "Sign in with your QOR ID" subtitle
   - Username field
   - Password field
   - "SIGN IN" button
   - "Create new QOR ID" link
   - Close/Minimize buttons (top-right)
   - Version text (bottom-right)

3. **After Login:** Dashboard with launch options

---

## 🛠️ **Development Testing**

For development, rebuild and test:

```powershell
cd C:\Repos\DEMIURGE\apps\genesis-launcher
mkdir build-installer -Force
cd build-installer

# Configure
cmake .. -G "Visual Studio 17 2022" `
  -DCMAKE_PREFIX_PATH="C:/Qt/6.10.1/msvc2022_64" `
  -DCMAKE_BUILD_TYPE=Release

# Build
cmake --build . --config Release

# Deploy Qt dependencies
& "C:\Qt\6.10.1\msvc2022_64\bin\windeployqt.exe" `
  --qmldir ..\src\qml `
  --release `
  Release\GenesisLauncher.exe

# Test
cd Release
.\test-launcher.ps1
```

---

## 🐛 **Known Issues**

1. **Cursor Crashes:** Don't use output redirection when launching
2. **Missing DLLs:** Use `windeployqt` to bundle dependencies
3. **QML Not Found:** Ensure `qml.qrc` is included in CMakeLists.txt
4. **Video Not Playing:** Video file path may be incorrect - check LauncherWindow.qml line 64

---

## ✅ **Success Indicators**

- ✅ Process starts and stays running
- ✅ Window appears on screen
- ✅ Login screen visible
- ✅ No console errors
- ✅ Window is draggable
- ✅ Close button works

---

**Use the test script to avoid Cursor crashes!** 🚀
