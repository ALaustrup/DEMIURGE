# NEON - Media Player & Browser

> *Play. Stream. Discover.*

A full-featured media player and streaming platform for the Abyss ecosystem, supporting local files, streaming, and DRC-369 media assets.

---

## Table of Contents

1. [Overview](#overview)
2. [Supported Formats](#supported-formats)
3. [Core Features](#core-features)
4. [User Interface](#user-interface)
5. [Library Management](#library-management)
6. [DRC-369 Integration](#drc-369-integration)
7. [Technical Architecture](#technical-architecture)
8. [Implementation Phases](#implementation-phases)
9. [Development Progress](#development-progress)

---

## Overview

NEON transforms media consumption in the Abyss ecosystem. From local files to DRC-369 music NFTs, NEON provides a unified experience for all your audio and video content.

### Key Features

- **Universal Playback**: Video, audio, images
- **Local Library**: Scan and organize local files
- **Streaming**: YouTube, IPFS, and more
- **DRC-369 Media**: Play and trade music/video NFTs
- **Radio Stations**: Curated streaming stations
- **Visualizers**: Audio-reactive visuals
- **Playlists**: Create and share playlists

---

## Supported Formats

### Video Formats

| Format | Extension | Notes |
|--------|-----------|-------|
| MP4 | `.mp4` | H.264, H.265 |
| MKV | `.mkv` | Full container support |
| AVI | `.avi` | Legacy support |
| MOV | `.mov` | QuickTime |
| WebM | `.webm` | VP8, VP9 |
| FLV | `.flv` | Flash video |
| WMV | `.wmv` | Windows Media |
| M4V | `.m4v` | iTunes video |

### Audio Formats

| Format | Extension | Notes |
|--------|-----------|-------|
| MP3 | `.mp3` | Universal support |
| FLAC | `.flac` | Lossless audio |
| WAV | `.wav` | Uncompressed |
| OGG | `.ogg` | Vorbis codec |
| AAC | `.aac`, `.m4a` | Advanced audio |
| OPUS | `.opus` | Modern efficient |
| WMA | `.wma` | Windows Media |
| AIFF | `.aiff` | Apple lossless |

### Image Formats

| Format | Extension | Notes |
|--------|-----------|-------|
| JPEG | `.jpg`, `.jpeg` | Photos |
| PNG | `.png` | Lossless with alpha |
| GIF | `.gif` | Animated support |
| WebP | `.webp` | Modern format |
| BMP | `.bmp` | Bitmap |
| SVG | `.svg` | Vector graphics |

### Playlist Formats

| Format | Extension | Notes |
|--------|-----------|-------|
| M3U | `.m3u`, `.m3u8` | Standard playlist |
| PLS | `.pls` | Winamp playlist |
| XSPF | `.xspf` | XML shareable |

---

## Core Features

### Video Player
- Full playback controls (play, pause, seek, volume)
- Fullscreen mode
- Picture-in-Picture
- Subtitle support (.srt, .vtt, .ass)
- Multiple audio tracks
- Speed control (0.25x - 2x)
- Screenshot capture
- Bookmark scenes

### Audio Player
- Gapless playback
- Crossfade between tracks
- Equalizer (10-band)
- Replay gain
- Queue management
- Shuffle and repeat modes
- Sleep timer
- Lyrics display

### Visualizers
- Spectrum analyzer
- Waveform
- Particle effects
- Kaleidoscope
- Custom shader support

### Radio
- Curated stations by genre
- User-created stations
- Live streams
- Recording capability
- Station favorites

---

## User Interface

### Main View

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  NEON                                                    ─  □  ✕            │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐                                                           │
│  │ 🏠 Home      │  Now Playing                                              │
│  │ 🎵 Music     │  ───────────────────────────────────────────────────────│
│  │ 🎬 Videos    │                                                           │
│  │ 📷 Photos    │         ┌───────────────────────────────┐                │
│  │ 🎨 DRC-369   │         │                               │                │
│  │ 📻 Radio     │         │         ALBUM ART             │                │
│  │ 📋 Playlists │         │                               │                │
│  │              │         │                               │                │
│  │ ─────────── │         └───────────────────────────────┘                │
│  │ Library     │                                                           │
│  │ ├─ Recently │            Song Title                                     │
│  │ │  Added    │            Artist Name - Album                            │
│  │ ├─ Artists  │                                                           │
│  │ ├─ Albums   │         ▬▬▬▬▬▬▬▬▬▬▬○▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬                    │
│  │ ├─ Genres   │         1:45                           4:32               │
│  │ └─ Folders  │                                                           │
│  │              │                                                           │
│  └──────────────┘                                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│  ⏮  ▶️  ⏭  │  🔀  🔁  │  ▬▬▬▬▬▬▬▬▬▬▬○▬▬▬▬  1:45/4:32  │  🔊 ▬▬▬▬○▬▬  │  📋 │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Video Player Mode

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│                                                                              │
│                                                                              │
│                         ┌─────────────────────┐                             │
│                         │                     │                             │
│                         │    VIDEO CONTENT    │                             │
│                         │                     │                             │
│                         │                     │                             │
│                         └─────────────────────┘                             │
│                                                                              │
│                                                                              │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│  Video Title                                                                 │
│  ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬○▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬   1:23:45 / 2:15:00                 │
│  ⏮  ▶️  ⏭  │  1x ▾  │  🔊 ▬▬▬○▬▬  │  CC  │  🖼️  │  ⛶                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Library View

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Library > Music > Albums                                    🔍 Search      │
├─────────────────────────────────────────────────────────────────────────────┤
│  Sort by: [Title ▾]   View: [Grid ▾]   Filter: [All ▾]                     │
│ ───────────────────────────────────────────────────────────────────────────│
│                                                                              │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │
│  │ 🎵      │  │ 🎵      │  │ 🎵      │  │ 🎵      │  │ 🎵      │          │
│  │         │  │         │  │         │  │         │  │         │          │
│  │ Album 1 │  │ Album 2 │  │ Album 3 │  │ Album 4 │  │ Album 5 │          │
│  │ Artist  │  │ Artist  │  │ Artist  │  │ Artist  │  │ Artist  │          │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘          │
│                                                                              │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │
│  │ 🎵      │  │ 🎵      │  │ 🎵      │  │ 🎵      │  │ 🎵      │          │
│  │         │  │         │  │         │  │         │  │         │          │
│  │ Album 6 │  │ Album 7 │  │ Album 8 │  │ Album 9 │  │ Album 10│          │
│  │ Artist  │  │ Artist  │  │ Artist  │  │ Artist  │  │ Artist  │          │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Library Management

### Library Scanning

```
Settings > Library > Scan Folders

Watched Folders:
├── /home/user/Music
├── /home/user/Videos
└── /home/user/Pictures

Options:
☑ Scan for new files automatically
☑ Extract metadata from files
☑ Download album artwork
☑ Organize by metadata
☐ Move files to organized folders
```

### Metadata Support
- ID3v1, ID3v2, ID3v2.4 (MP3)
- Vorbis Comments (FLAC, OGG)
- APE tags
- iTunes metadata
- MusicBrainz integration
- Cover art extraction

---

## DRC-369 Integration

### DRC-369 Media NFTs

```
┌─────────────────────────────────────────────────────────────────┐
│  My DRC-369 Collection                           [Refresh] [+]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐            │
│  │ 🎵      │  │ 🎵      │  │ 🎬      │  │ 📷      │            │
│  │ ♦ NFT   │  │ ♦ NFT   │  │ ♦ NFT   │  │ ♦ NFT   │            │
│  │         │  │         │  │         │  │         │            │
│  │ Track 1 │  │ Album   │  │ Video   │  │ Art     │            │
│  │ 0.5 CGT │  │ 2.0 CGT │  │ 1.0 CGT │  │ 0.3 CGT │            │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘            │
│                                                                  │
│  Marketplace                                                     │
│  ─────────────────────────────────────────────────────────────  │
│  Featured releases, trending, new arrivals...                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Technical Architecture

### Component Structure

```
src/components/desktop/apps/
├── NeonPlayerApp.tsx              # Main application
├── neon/
│   ├── NeonPlayer.tsx             # Core player component
│   ├── NeonVideoPlayer.tsx        # Video-specific player
│   ├── NeonAudioPlayer.tsx        # Audio-specific player
│   ├── NeonLibrary.tsx            # Library browser
│   ├── NeonPlaylist.tsx           # Playlist management
│   ├── NeonQueue.tsx              # Play queue
│   ├── NeonVisualizer.tsx         # Audio visualizations
│   ├── NeonRadio.tsx              # Radio stations
│   ├── NeonDrc369.tsx             # NFT collection
│   ├── NeonEqualizer.tsx          # Audio equalizer
│   ├── hooks/
│   │   ├── useNeonPlayer.ts       # Player state
│   │   ├── useNeonLibrary.ts      # Library scanning
│   │   └── useNeonMetadata.ts     # Metadata extraction
│   └── utils/
│       ├── audioUtils.ts          # Audio processing
│       └── metadataParser.ts      # ID3/metadata parsing
```

### Player Engine

For the web app:
- HTML5 Audio/Video API
- Web Audio API for visualizations
- Media Session API for system integration

For desktop (Qt):
- libmpv or VLC integration
- Native codec support
- Hardware acceleration

---

## Implementation Phases

### Phase 1: Core Player (2 weeks)
- [x] Basic audio playback
- [x] Play/pause/seek controls
- [ ] Volume control with slider
- [ ] Queue management
- [ ] Now playing display

### Phase 2: Video Support (2 weeks)
- [ ] Video playback integration
- [ ] Fullscreen mode
- [ ] Subtitle support
- [ ] Video controls overlay

### Phase 3: Library (2 weeks)
- [ ] Folder scanning
- [ ] Metadata extraction
- [ ] Album artwork
- [ ] Library browser UI
- [ ] Search and filter

### Phase 4: Playlists & Radio (1 week)
- [x] Basic radio stations
- [ ] Playlist creation
- [ ] Playlist import/export
- [ ] Radio station favorites

### Phase 5: Advanced Features (2 weeks)
- [ ] Visualizers
- [ ] Equalizer
- [ ] Gapless playback
- [ ] DRC-369 integration

**Total Estimated Time: 9 weeks**

---

## Development Progress

### Current Status: 🟢 Mostly Complete

| Phase | Status | Progress | Notes |
|-------|--------|----------|-------|
| Phase 1: Core Player | 🟢 Complete | 100% | Web Audio API + controls |
| Phase 2: Video Support | 🟢 Complete | 100% | Video element integration |
| Phase 3: Library | 🟢 Complete | 100% | Drag/drop, filtering |
| Phase 4: Playlists & Radio | 🟡 In Progress | 70% | Radio exists, playlists WIP |
| Phase 5: Advanced Features | 🟢 Complete | 90% | Equalizer, visualizers |

---

## Implemented Components (January 2026)

### Core Files Structure

```
src/components/desktop/apps/neonPlayer/
├── index.ts                    # Exports all components
├── types.ts                    # TypeScript type definitions
├── useNeonStore.ts             # Zustand state management
├── NeonAudioEngine.ts          # Web Audio API engine
├── NeonVisualizerEngine.ts     # Procedural visualizers
├── NeonMediaLibrary.tsx        # Media browser with drag/drop
├── NeonEqualizer.tsx           # 10-band graphic equalizer
├── NeonVisualizer.tsx          # React visualizer component
├── NFTMetadataPanel.tsx        # NFT ownership display
└── NeonDesktopReactivity.ts    # Desktop theme reactivity
```

### Audio Engine Features

The `NeonAudioEngine` class provides:

- **Web Audio API Integration**: Full AudioContext management
- **10-Band Equalizer**: Biquad filters for precise audio shaping
- **Real-time Analysis**: FFT-based frequency and time-domain data
- **Audio Levels**: Bass, mid, treble level detection
- **Volume Control**: Perceptually-linear volume curves
- **Stereo Enhancement**: Stereo width control

### Visualizer Engine

`NeonVisualizerEngine` offers 12 procedural visualization types:

1. **Spectrum**: Classic frequency bar display
2. **Waveform**: Audio waveform oscilloscope
3. **Circular**: Radial spectrum analyzer
4. **Particles**: Audio-reactive particle system
5. **Kaleidoscope**: Symmetrical patterns
6. **Nebula**: Space cloud effect
7. **Geometric Shapes**: Morphing polygons
8. **Vortex**: Spiral tunnel effect
9. **Flames**: Reactive fire simulation
10. **Matrix**: Digital rain effect
11. **3D Bars**: Pseudo-3D bar graph
12. **Galaxy**: Rotating star field

All visualizers support:
- 8 color schemes
- Adjustable sensitivity
- Smoothing controls
- Glow intensity settings
- Random mode for variety

### Equalizer Presets

Built-in EQ presets:
- Flat (reference)
- Bass Boost
- Treble Boost
- Vocal
- Rock
- Electronic
- Acoustic
- Classical

### Media Library Features

- **Drag & Drop**: Drop files directly into NEON
- **File Type Detection**: Auto-detects audio/video/image
- **Filtering**: By type, favorites, recent
- **Search**: Full-text search across metadata
- **Sorting**: By name, date, type
- **Playlists**: Create and manage playlists
- **Favorites**: Quick access to liked items

### NFT Media Support

- Display NFT ownership information
- Show creator and royalty data
- View provenance history
- Display token metadata
- Support for DRC-369 assets

### Future: Recursion Engine Integration

The visualizer system is designed for future integration with the Recursion game engine:

```typescript
// Future implementation
export type VisualizerType = 
  | 'spectrum'
  | 'waveform'
  // ... other types
  | 'recursion';  // Future 3D engine integration
```

This will enable:
- Real-time 3D procedural graphics
- GPU-accelerated particle systems
- Shader-based effects
- Custom user-created visualizers

---

*NEON - Illuminate your media.*
