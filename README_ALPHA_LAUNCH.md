# 🚀 DEMIURGE - Alpha Launch Guide

**Launch Date:** January 10, 2026 at 12:00 UTC  
**Status:** ✅ **PRODUCTION READY**

---

## 🎯 **What is DEMIURGE?**

**DEMIURGE** is a sovereign Layer-1 blockchain ecosystem with:

- **QOR ID** - Decentralized identity system
- **QLOUD OS** - Web-based operating system
- **QOR Desktop** - Native desktop environment
- **DEMIURGE QOR** - Unified launcher and installer
- **CGT Token** - Native governance token
- **DRC-369 NFTs** - Creator economy standard

---

## 📥 **Download the Launcher**

### **Windows (Ready Now!)**
**File:** `DemiurgeQOR-1.0.0-Setup.exe` (87 MB)  
**Location:** [GitHub Releases](https://github.com/ALaustrup/DEMIURGE/releases)

**System Requirements:**
- Windows 10/11 (64-bit)
- 8GB RAM recommended
- 500MB disk space
- Internet for updates

**Installation:**
1. Download `DemiurgeQOR-1.0.0-Setup.exe`
2. Run the installer
3. Follow setup wizard
4. Launch from Start Menu: `DEMIURGE → QOR Launcher`

### **macOS & Linux**
Coming soon! For now, use the web-based QLOUD OS at https://demiurge.cloud

---

## 🌐 **Access DEMIURGE**

### **QLOUD OS (Web-based)**
**URL:** https://demiurge.cloud  
**What is it?** Full operating system in your browser

**Features:**
- Desktop environment
- Built-in apps (Wallet, Shell, Files, etc.)
- QOR ID authentication
- No installation required
- Works on any device

### **Portal Web (Landing & Docs)**
**URL:** https://demiurge.guru  
**What is it?** Gateway, documentation, and QOR ID creation

**Features:**
- Alpha launch countdown
- Quick QOR ID signup
- NFT promo for early adopters
- Download QOR Launcher
- Documentation and guides

---

## 🆔 **Create Your QOR ID**

**QOR ID** is your sovereign digital identity on the Demiurge chain.

### **How to Create:**

1. Visit https://demiurge.guru
2. Click "Sign Up Free"
3. Choose a username
4. Save your seed phrase (12 words) - **DO NOT LOSE THIS!**
5. Your QOR ID is ready!

**What You Get:**
- Unique blockchain address
- Wallet for CGT and NFTs
- Access to QLOUD OS apps
- On-chain profile
- Archon tier progression

---

## 🐛 **Report Bugs**

Found an issue? Help us improve!

### **From QLOUD OS:**
1. Open the Bug Reporter app
2. Select category
3. Fill in title and description
4. Submit!

### **From QOR Launcher:**
1. Click Help → Report Bug
2. Same process as above

### **Via GitHub:**
https://github.com/ALaustrup/DEMIURGE/issues

---

## 🔗 **Important Links**

| Resource | URL |
|----------|-----|
| **QLOUD OS** | https://demiurge.cloud |
| **Portal** | https://demiurge.guru |
| **GraphQL API** | https://api.demiurge.cloud/graphql |
| **RPC Node** | https://rpc.demiurge.cloud/rpc |
| **GitHub** | https://github.com/ALaustrup/DEMIURGE |
| **Documentation** | https://demiurge.cloud/scrolls |

---

## 🎁 **Early Adopter NFT**

**Sign up before Jan 10, 2026** to be eligible for a legendary Demiurge Genesis NFT!

**How to Qualify:**
1. Create your QOR ID at demiurge.guru
2. Sign in to your Haven page
3. Click "Claim My NFT" on the promo card
4. Your wallet address will be registered for the airdrop

**Benefits:**
- Lifetime Archon tier (100 CGT/month value)
- 10x mining rewards multiplier
- Exclusive governance voting power
- Early access to all features
- Unique on-chain badge

**Limited to first 1,000 users!**

---

## 💻 **For Developers**

### **Build from Source:**
```bash
git clone https://github.com/ALaustrup/DEMIURGE
cd DEMIURGE

# Install dependencies
pnpm install

# Build QLOUD OS
cd apps/qloud-os
pnpm build

# Build QOR Launcher (requires Qt 6.10+)
cd ../genesis-launcher
cmake -B build -DCMAKE_PREFIX_PATH=/path/to/Qt/6.10.1/msvc2022_64
cmake --build build --config Release
```

### **Run Your Own Node:**
```bash
# Build Demiurge chain
cd chain
cargo build --release

# Run validator
./target/release/demiurge-node --validator
```

### **API Documentation:**
- GraphQL: https://api.demiurge.cloud/graphql
- RPC Methods: `docs/api/RPC.md`

---

## 📚 **Documentation**

- **Quick Start:** `docs/getting-started/QUICKSTART.md`
- **Architecture:** `docs/architecture/OVERVIEW.md`
- **API Reference:** `docs/api/RPC.md`
- **Deployment:** `docs/deployment/NODE_SETUP.md`

---

## ❓ **FAQ**

### **What is QOR ID?**
Your decentralized identity on the Demiurge blockchain. It's your wallet, profile, and access key to the ecosystem.

### **What's the difference between QLOUD OS and QOR Desktop?**
- **QLOUD OS:** Web-based, runs in browser, accessible anywhere
- **QOR Desktop:** Native app, full desktop environment, better performance

### **Do I need to download anything?**
Not required! QLOUD OS works in your browser. But for best experience, download DEMIURGE QOR Launcher.

### **Is this a real operating system?**
QLOUD OS is a web-based desktop environment. QOR Desktop is a native desktop client that provides a full OS experience with blockchain integration.

### **What can I mine?**
CGT (Cognitive Governance Token) - the native token of the Demiurge blockchain.

### **Is it free?**
Yes! Free tier available. Premium "Archon" tier unlocks advanced features (100 CGT/month or earned through mining).

---

## 🛡️ **Security**

- **QOR ID:** Your keys, your coins. Seed phrase = full control
- **Never share:** Your seed phrase or private keys
- **Backup:** Write down your 12-word seed phrase on paper
- **Official sites only:** demiurge.cloud, demiurge.guru
- **No seed phrase entry:** We'll never ask for your seed phrase

---

## 🎬 **Alpha Launch Timeline**

- **Now:** Download launcher, create QOR ID, opt-in for NFT
- **Jan 10, 2026 12:00 UTC:** Official alpha launch
- **Launch Day:** NFT airdrop for early adopters
- **Post-Launch:** Feature announcements, community events

---

## 🤝 **Community**

- **GitHub:** https://github.com/ALaustrup/DEMIURGE
- **Issues:** Report bugs and request features
- **Discussions:** Join the conversation

---

## 📜 **License**

MIT License - See LICENSE file for details.

---

**Built by:** Alaustrup  
**Powered by:** Substrate, Qt 6, React, Rust  
**Status:** Alpha (v1.0.0)  

🔥 **Welcome to the DEMIURGE!** 🔥
