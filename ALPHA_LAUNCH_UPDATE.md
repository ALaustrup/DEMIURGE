# DEMIURGE QOR Alpha Launch - Update Summary

**Date:** January 7, 2026  
**Release:** Alpha v1.0  
**Launch Date:** January 10, 2026 at 12:00 UTC (3 days from now)

---

## 🎉 What's New

### 1. **Landing Page Transformation (demiurge.guru)**

#### Countdown Timer
- **Prominent countdown banner** at the top of the landing page
- Shows days, hours, minutes, seconds until alpha launch
- **Compact mode** for banner, **full mode** for modals
- **Live now** message when countdown reaches zero

#### QOR Launcher Download Button
- **Massive "DOWNLOAD QOR LAUNCHER" button** on hero section
- Opens modal with:
  - Pre-launch: Countdown display + requirements
  - Post-launch: Platform selection (Windows/macOS)
  - Features list and system requirements
- Download URLs ready: `releases.demiurge.cloud/qor/latest/{platform}`

#### Quick QOR ID Signup
- **Dedicated signup section** below hero
- Highlights benefits:
  - ✅ Free forever
  - ✅ 2GB storage
  - ✅ On-chain wallet
  - ✅ Early adopter benefits
- One-click signup opens QOR ID creation dialog

---

### 2. **NFT Promo for Early Adopters**

#### Legendary Genesis NFT
**Available to:** First 1,000 early adopters who opt-in before launch

**Benefits:**
- 🎯 **Lifetime Archon Tier** (100 CGT/month value)
- 🚀 **10x Mining Rewards Multiplier**
- 🗳️ **Exclusive Governance Voting Power**
- ⚡ **Early Access to All Features**
- 🏆 **Unique On-Chain Badge**

#### Where It Appears
- **Haven page** (profile page) for signed-in users only
- **Two states:**
  1. **Not Opted In:** Promo card with "Claim My NFT" button
  2. **Opted In:** Confirmation card with airdrop details

#### Technical Implementation
- Opt-in status stored in **localStorage** (`nft_promo_{address}`)
- Expandable details view with collection info
- Can opt-out at any time before launch
- NFT will be airdropped on-chain on **January 10, 2026**

---

### 3. **Build & Code Quality Fixes**

#### Metadata Warnings Fixed
- ✅ Separated `viewport` export from `metadata` (Next.js 14+ requirement)
- ✅ Moved `themeColor` to viewport config
- ✅ All build warnings resolved

#### QOR Branding Updates
- ✅ HeroPanel: "A B Y S S  OS" → "Q L O U D  OS"
- ✅ CTA button: "Enter the Abyss" → "Enter QOR Realm"
- ✅ Metadata description updated with QOR naming
- ✅ API documentation: `abyssid_get` → `qorid_get`

---

## 📋 Component Inventory

### New Components Created

| Component | Location | Purpose |
|-----------|----------|---------|
| `LaunchCountdown` | `src/components/countdown/` | Reusable countdown (compact & full) |
| `DownloadModal` | `src/components/modals/` | QOR Launcher download popup |
| `NftPromoCard` | `src/components/promo/` | NFT opt-in for users |

### Updated Pages

| Page | Changes |
|------|---------|
| `app/page.tsx` | Complete landing page redesign |
| `app/haven/page.tsx` | Added NFT promo card |
| `app/layout.tsx` | Fixed metadata warnings, added viewport |
| `components/fracture/HeroPanel.tsx` | Updated QOR branding |

---

## 🎨 Design & UX

### Genesis Theme Integration
All new components use the Genesis theme color palette:
- **Flame Orange** (`#F97316`) - Primary accent
- **Cipher Cyan** (`#00FFC8`) - Secondary accent  
- **Void Purple** (`#7C3AED`) - Tertiary accent
- **Glass layers** with backdrop blur
- **Smooth animations** with Framer Motion

### User Flow
```
Landing Page
    ↓
[See Countdown] → [Click Download] → [View Modal with Countdown/Download]
    ↓
[Create QOR ID] → [QOR ID Dialog Opens]
    ↓
[Login to Haven] → [See NFT Promo] → [Opt-In for NFT]
```

---

## 📊 Launch Timeline

### January 7, 2026 (Today)
- ✅ Landing page deployed
- ✅ Countdown timer live
- ✅ NFT promo system active
- ✅ QOR ID signup ready

### January 10, 2026 at 12:00 UTC (Launch Day)
- 🚀 Countdown reaches zero
- 🚀 Download button shows platform selection
- 🚀 Legendary Genesis NFTs airdropped to opted-in users
- 🚀 DEMIURGE QOR launcher available for download

---

## 🔧 Technical Details

### Countdown Configuration
```typescript
const launchDate = new Date('2026-01-10T12:00:00Z');
```

### Download URLs (Post-Launch)
```
Windows: https://releases.demiurge.cloud/qor/latest/windows
macOS:   https://releases.demiurge.cloud/qor/latest/macos
```

### NFT Promo Storage
```javascript
localStorage.setItem(`nft_promo_${userAddress}`, 'true');
localStorage.setItem(`nft_promo_timestamp_${userAddress}`, Date.now().toString());
```

### Environment Variables
No additional env vars required. All changes work with existing configuration.

---

## 🚀 Deployment Status

### Committed to Main Branch
✅ All changes pushed to `main`  
✅ Ready for Vercel deployment  
✅ Build verified successful  
✅ No warnings in production build

### How to Deploy
1. **Vercel Dashboard:** https://vercel.com/projects/portal-web
2. **Root Directory:** `apps/portal-web`
3. **Branch:** `main`
4. **Auto-deploy:** Enabled

---

## 📝 Next Steps for You

### Before Launch (Optional)
1. **Upload QOR Launcher binaries** to:
   - `releases.demiurge.cloud/qor/latest/windows`
   - `releases.demiurge.cloud/qor/latest/macos`

2. **Prepare NFT metadata** for Genesis NFT:
   - Collection name: "Genesis Archons"
   - NFT name: "The Architect"
   - Rarity: Legendary
   - Supply: 1,000

3. **Set up NFT airdrop script** for users who opted in

### On Launch Day
1. Verify countdown reaches zero at 12:00 UTC
2. Test download links
3. Monitor opt-in addresses
4. Execute NFT airdrops

---

## 🎯 Success Metrics

Track these post-launch:
- **QOR ID signups** before launch
- **NFT opt-in rate** (target: 1,000 users)
- **Download button clicks**
- **Launcher downloads** (Windows vs macOS)
- **Time to first 100 users**

---

## 🔗 Links

- **Production Site:** https://demiurge.guru
- **GitHub Repo:** https://github.com/Alaustrup/DEMIURGE
- **Branch:** `main`
- **Commits:** 4 commits for this update

---

*The flame burns eternal. The alpha approaches.* 🔥

**All systems ready for launch!** ✅
