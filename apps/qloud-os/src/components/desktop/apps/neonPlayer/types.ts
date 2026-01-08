/**
 * NEON Media Player Types
 * 
 * Comprehensive type definitions for the NEON media player
 */

// ============================================================================
// Media Types
// ============================================================================

export type MediaType = 'audio' | 'video' | 'image' | 'nft';

export type AudioFormat = 
  | 'mp3' | 'flac' | 'wav' | 'ogg' | 'aac' | 'm4a' 
  | 'opus' | 'wma' | 'aiff' | 'alac' | 'webm'
  | 'fractal1'; // Custom format

export type VideoFormat = 
  | 'mp4' | 'webm' | 'mkv' | 'avi' | 'mov' 
  | 'wmv' | 'flv' | 'm4v' | 'ogv' | '3gp';

export type ImageFormat = 
  | 'jpg' | 'jpeg' | 'png' | 'gif' | 'webp' 
  | 'svg' | 'bmp' | 'ico' | 'avif';

export const SUPPORTED_AUDIO_FORMATS: AudioFormat[] = [
  'mp3', 'flac', 'wav', 'ogg', 'aac', 'm4a', 
  'opus', 'wma', 'aiff', 'alac', 'webm', 'fractal1'
];

export const SUPPORTED_VIDEO_FORMATS: VideoFormat[] = [
  'mp4', 'webm', 'mkv', 'avi', 'mov', 
  'wmv', 'flv', 'm4v', 'ogv', '3gp'
];

export const SUPPORTED_IMAGE_FORMATS: ImageFormat[] = [
  'jpg', 'jpeg', 'png', 'gif', 'webp', 
  'svg', 'bmp', 'ico', 'avif'
];

// ============================================================================
// Media Item Types
// ============================================================================

export interface MediaItem {
  id: string;
  type: MediaType;
  name: string;
  uri: string;
  duration?: number;
  thumbnail?: string;
  metadata: MediaMetadata;
  source: MediaSource;
  addedAt: number;
}

export interface MediaMetadata {
  // Common
  title?: string;
  artist?: string;
  album?: string;
  year?: number;
  genre?: string;
  
  // Audio specific
  trackNumber?: number;
  discNumber?: number;
  bpm?: number;
  key?: string; // Musical key
  bitrate?: number;
  sampleRate?: number;
  channels?: number;
  
  // Video specific
  resolution?: { width: number; height: number };
  frameRate?: number;
  codec?: string;
  
  // Image specific
  dimensions?: { width: number; height: number };
  colorSpace?: string;
  
  // NFT specific
  nftData?: NFTMediaData;
  
  // File info
  fileSize?: number;
  mimeType?: string;
  format?: string;
}

export interface NFTMediaData {
  tokenId: string;
  contractAddress?: string;
  owner: string;
  creator: string;
  royalties?: number;
  collection?: string;
  description?: string;
  attributes?: Record<string, unknown>;
  provenance?: ProvenanceEntry[];
  chainId?: string;
  mintedAt?: number;
  lastTransferAt?: number;
}

export interface ProvenanceEntry {
  owner: string;
  timestamp: number;
  transactionHash?: string;
  price?: number;
}

export type MediaSource = 
  | { type: 'local'; path: string }
  | { type: 'url'; url: string }
  | { type: 'nft'; tokenId: string; chainId?: string }
  | { type: 'ipfs'; cid: string }
  | { type: 'drc369'; assetId: string };

// ============================================================================
// Playback Types
// ============================================================================

export type RepeatMode = 'off' | 'one' | 'all';
export type ShuffleMode = 'off' | 'on' | 'smart';

export interface PlaybackState {
  currentItem: MediaItem | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  playbackRate: number;
  repeat: RepeatMode;
  shuffle: ShuffleMode;
}

export interface QueueState {
  items: MediaItem[];
  currentIndex: number;
  history: string[]; // Item IDs
}

// ============================================================================
// Equalizer Types
// ============================================================================

export interface EqualizerBand {
  id: string;
  frequency: number; // Hz
  gain: number; // dB (-12 to +12)
  type: BiquadFilterType;
  q?: number;
}

export interface EqualizerPreset {
  id: string;
  name: string;
  bands: EqualizerBand[];
  icon?: string;
}

export const DEFAULT_EQ_BANDS: EqualizerBand[] = [
  { id: 'b1', frequency: 32, gain: 0, type: 'lowshelf' },
  { id: 'b2', frequency: 64, gain: 0, type: 'peaking', q: 1.4 },
  { id: 'b3', frequency: 125, gain: 0, type: 'peaking', q: 1.4 },
  { id: 'b4', frequency: 250, gain: 0, type: 'peaking', q: 1.4 },
  { id: 'b5', frequency: 500, gain: 0, type: 'peaking', q: 1.4 },
  { id: 'b6', frequency: 1000, gain: 0, type: 'peaking', q: 1.4 },
  { id: 'b7', frequency: 2000, gain: 0, type: 'peaking', q: 1.4 },
  { id: 'b8', frequency: 4000, gain: 0, type: 'peaking', q: 1.4 },
  { id: 'b9', frequency: 8000, gain: 0, type: 'peaking', q: 1.4 },
  { id: 'b10', frequency: 16000, gain: 0, type: 'highshelf' },
];

export const EQ_PRESETS: EqualizerPreset[] = [
  {
    id: 'flat',
    name: 'Flat',
    icon: '━',
    bands: DEFAULT_EQ_BANDS,
  },
  {
    id: 'bass-boost',
    name: 'Bass Boost',
    icon: '🔊',
    bands: DEFAULT_EQ_BANDS.map(b => ({
      ...b,
      gain: b.frequency <= 250 ? 6 : b.frequency <= 500 ? 3 : 0,
    })),
  },
  {
    id: 'treble-boost',
    name: 'Treble Boost',
    icon: '🎵',
    bands: DEFAULT_EQ_BANDS.map(b => ({
      ...b,
      gain: b.frequency >= 4000 ? 5 : b.frequency >= 2000 ? 3 : 0,
    })),
  },
  {
    id: 'vocal',
    name: 'Vocal',
    icon: '🎤',
    bands: DEFAULT_EQ_BANDS.map(b => ({
      ...b,
      gain: b.frequency >= 250 && b.frequency <= 4000 ? 4 : b.frequency < 250 ? -2 : 0,
    })),
  },
  {
    id: 'rock',
    name: 'Rock',
    icon: '🎸',
    bands: DEFAULT_EQ_BANDS.map(b => ({
      ...b,
      gain: b.frequency <= 64 ? 5 : b.frequency <= 250 ? 3 : 
            b.frequency >= 4000 ? 4 : b.frequency >= 2000 ? 2 : -1,
    })),
  },
  {
    id: 'electronic',
    name: 'Electronic',
    icon: '🎧',
    bands: DEFAULT_EQ_BANDS.map(b => ({
      ...b,
      gain: b.frequency <= 64 ? 6 : b.frequency <= 125 ? 4 : 
            b.frequency >= 8000 ? 5 : b.frequency >= 4000 ? 3 : 0,
    })),
  },
  {
    id: 'acoustic',
    name: 'Acoustic',
    icon: '🪕',
    bands: DEFAULT_EQ_BANDS.map(b => ({
      ...b,
      gain: b.frequency >= 500 && b.frequency <= 4000 ? 3 : 
            b.frequency <= 125 ? 2 : b.frequency >= 8000 ? 2 : 0,
    })),
  },
  {
    id: 'classical',
    name: 'Classical',
    icon: '🎻',
    bands: DEFAULT_EQ_BANDS.map(b => ({
      ...b,
      gain: b.frequency <= 64 ? -2 : b.frequency >= 8000 ? -2 : 
            b.frequency >= 500 && b.frequency <= 2000 ? 2 : 0,
    })),
  },
];

// ============================================================================
// Visualizer Types
// ============================================================================

export type VisualizerType = 
  | 'spectrum'        // Frequency spectrum bars
  | 'waveform'        // Audio waveform
  | 'circular'        // Circular spectrum
  | 'particles'       // Particle system
  | 'kaleidoscope'    // Kaleidoscope effect
  | 'nebula'          // Nebula/space effect
  | 'geometricShapes' // Geometric patterns
  | 'vortex'          // Spiral vortex
  | 'flames'          // Reactive flames
  | 'matrix'          // Matrix rain
  | 'bars3d'          // 3D bars
  | 'galaxy'          // Galaxy spiral
  | 'recursion'       // Future: Recursion engine integration
  | 'random';         // Random selection

export interface VisualizerSettings {
  type: VisualizerType;
  colorScheme: ColorScheme;
  sensitivity: number; // 0-100
  smoothing: number; // 0-100
  showAlbumArt: boolean;
  showTrackInfo: boolean;
  fullscreen: boolean;
  particleCount?: number;
  glowIntensity?: number;
}

export interface ColorScheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

export const COLOR_SCHEMES: ColorScheme[] = [
  { id: 'neon', name: 'Neon', primary: '#00d4ff', secondary: '#ff00ff', accent: '#00ff88', background: '#0a0a15' },
  { id: 'sunset', name: 'Sunset', primary: '#ff6b6b', secondary: '#feca57', accent: '#ff9ff3', background: '#1a1a2e' },
  { id: 'ocean', name: 'Ocean', primary: '#00b4d8', secondary: '#0077b6', accent: '#48cae4', background: '#03045e' },
  { id: 'forest', name: 'Forest', primary: '#2d6a4f', secondary: '#40916c', accent: '#74c69d', background: '#1b4332' },
  { id: 'fire', name: 'Fire', primary: '#ff4500', secondary: '#ff8c00', accent: '#ffd700', background: '#1a0a00' },
  { id: 'monochrome', name: 'Mono', primary: '#ffffff', secondary: '#888888', accent: '#cccccc', background: '#000000' },
  { id: 'vapor', name: 'Vaporwave', primary: '#ff71ce', secondary: '#01cdfe', accent: '#05ffa1', background: '#1a1a2e' },
  { id: 'aurora', name: 'Aurora', primary: '#00ff87', secondary: '#60efff', accent: '#ff00ff', background: '#0d0221' },
];

// ============================================================================
// Library Types
// ============================================================================

export interface MediaLibrary {
  items: MediaItem[];
  playlists: Playlist[];
  folders: LibraryFolder[];
  recentlyPlayed: string[];
  favorites: string[];
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  items: string[]; // MediaItem IDs
  thumbnail?: string;
  createdAt: number;
  updatedAt: number;
  isSmartPlaylist?: boolean;
  smartQuery?: SmartPlaylistQuery;
}

export interface SmartPlaylistQuery {
  type: 'genre' | 'artist' | 'year' | 'recentlyAdded' | 'mostPlayed' | 'custom';
  value?: string;
  limit?: number;
}

export interface LibraryFolder {
  id: string;
  name: string;
  path: string;
  itemCount: number;
  lastScanned?: number;
}

// ============================================================================
// View Types
// ============================================================================

export type NeonView = 
  | 'nowPlaying'    // Main player view
  | 'library'       // Media library browser
  | 'queue'         // Current queue
  | 'playlists'     // Playlist management
  | 'visualizer'    // Fullscreen visualizer
  | 'equalizer'     // EQ settings
  | 'settings';     // App settings

export interface NeonSettings {
  // Audio
  outputDevice?: string;
  crossfade: boolean;
  crossfadeDuration: number; // seconds
  gaplessPlayback: boolean;
  normalizeVolume: boolean;
  
  // Visualizer
  defaultVisualizer: VisualizerType;
  visualizerSensitivity: number;
  
  // Library
  libraryPaths: string[];
  autoScanLibrary: boolean;
  showNFTsInLibrary: boolean;
  
  // UI
  theme: 'dark' | 'light' | 'system';
  showMiniPlayer: boolean;
  backgroundPlayback: boolean;
}
