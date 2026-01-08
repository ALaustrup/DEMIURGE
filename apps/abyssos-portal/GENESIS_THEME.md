# Genesis Launcher Theme System

This document describes the unified Genesis Launcher theme applied across the entire Demiurge ecosystem.

## Color Palette

### Core Colors
- **Void**: `#050505` - Primary background (almost black)
- **Void Dark**: `#000000` - Pure black
- **Glass**: `#0A0A0A` - Glass/container background
- **Glass Light**: `#0D0D0D` - Lighter glass
- **Glass Hover**: `#151515` - Hover state

### Text Colors
- **Primary**: `#E0E0E0` - Primary text (light gray)
- **Secondary**: `#7A7A7A` - Secondary text (medium gray)
- **Tertiary**: `#555555` - Tertiary text (dark gray)

### Accent Colors
- **Flame Orange**: `#FF3D00` - Primary accent (orange)
- **Flame Orange Hover**: `#FF5722` - Hover state
- **Cipher Cyan**: `#00FFC8` - Secondary accent (cyan)
- **Cipher Cyan Hover**: `#00E5B8` - Hover state

### Border Colors
- **Default**: `#252525` - Default border
- **Light**: `rgba(255, 255, 255, 0.1)` - Light border
- **Medium**: `rgba(255, 255, 255, 0.2)` - Medium border
- **Accent**: `rgba(255, 61, 0, 0.3)` - Accent border (flameOrange)
- **Cyan**: `rgba(0, 255, 200, 0.3)` - Cyan border

### Semantic Colors
- **Success**: `#00FF88`
- **Warning**: `#FF9100`
- **Error**: `#FF4444`
- **Info**: `#00FFC8`

## Usage

### Tailwind Classes

```tsx
// Backgrounds
bg-genesis-void
bg-genesis-glass
bg-genesis-glass-light
bg-genesis-glass-hover

// Text
text-genesis-text-primary
text-genesis-text-secondary
text-genesis-text-tertiary
text-genesis-flame-orange
text-genesis-cipher-cyan

// Borders
border-genesis-border-default
border-genesis-border-light
border-genesis-border-medium
border-genesis-border-accent
border-genesis-border-cyan

// Buttons
genesis-button-primary
genesis-button-secondary
genesis-button-cyan

// Inputs
genesis-input

// Cards
genesis-card
```

### Utility Classes

```css
.genesis-glass          /* Glass container with blur */
.genesis-glass-light    /* Lighter glass container */
.genesis-button-primary  /* Primary orange button */
.genesis-button-secondary /* Secondary glass button */
.genesis-button-cyan     /* Cyan accent button */
.genesis-input          /* Styled input field */
.genesis-card           /* Card container */
```

### CSS Variables

All theme colors are available as CSS variables:

```css
--genesis-void
--genesis-flame-orange
--genesis-cipher-cyan
--genesis-text-primary
/* ... etc */
```

## Design Principles

1. **Dark Void Base**: Almost black background (`#050505`)
2. **Glass Morphism**: Subtle glass containers with blur
3. **Orange Primary**: Flame orange (`#FF3D00`) for primary actions
4. **Cyan Secondary**: Cipher cyan (`#00FFC8`) for secondary accents
5. **Rounded Corners**: 8px (sm), 12px (md), 16px (lg), 24px (xl)
6. **Smooth Transitions**: Spring animations for interactions

## Migration Guide

### Old → New

```tsx
// Backgrounds
bg-abyss-dark → bg-genesis-void
bg-abyss-navy → bg-genesis-glass

// Text
text-abyss-cyan → text-genesis-cipher-cyan
text-gray-300 → text-genesis-text-primary
text-gray-400 → text-genesis-text-secondary

// Borders
border-abyss-cyan/20 → border-genesis-border-cyan
border-abyss-cyan/30 → border-genesis-border-cyan

// Buttons
bg-abyss-cyan/20 → genesis-button-secondary
bg-abyss-cyan → genesis-button-cyan (or use flame-orange for primary)
```

## Components Updated

- ✅ Theme system (`genesisTheme.ts`)
- ✅ Tailwind config
- ✅ Global styles
- ✅ Login form
- ✅ Card component
- ✅ Button component
- ✅ Status bar

## Next Steps

Continue updating remaining components to use Genesis theme colors. Search for:
- `abyss-cyan` → `genesis-cipher-cyan` or `genesis-flame-orange`
- `abyss-dark` → `genesis-void`
- `abyss-navy` → `genesis-glass`
- `gray-300/400` → `genesis-text-primary/secondary`
