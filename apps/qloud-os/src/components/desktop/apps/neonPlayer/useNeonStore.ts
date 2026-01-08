/**
 * NEON Media Player Store
 * 
 * Zustand store for managing NEON player state
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  MediaItem,
  MediaType,
  PlaybackState,
  QueueState,
  EqualizerBand,
  EqualizerPreset,
  VisualizerSettings,
  VisualizerType,
  ColorScheme,
  MediaLibrary,
  Playlist,
  NeonView,
  NeonSettings,
  RepeatMode,
  ShuffleMode,
} from './types';
import { 
  DEFAULT_EQ_BANDS, 
  EQ_PRESETS, 
  COLOR_SCHEMES,
  SUPPORTED_AUDIO_FORMATS,
  SUPPORTED_VIDEO_FORMATS,
  SUPPORTED_IMAGE_FORMATS,
} from './types';

// ============================================================================
// Helper Functions
// ============================================================================

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getMediaTypeFromFile(filename: string): MediaType | null {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (!ext) return null;
  
  if (SUPPORTED_AUDIO_FORMATS.includes(ext as never)) return 'audio';
  if (SUPPORTED_VIDEO_FORMATS.includes(ext as never)) return 'video';
  if (SUPPORTED_IMAGE_FORMATS.includes(ext as never)) return 'image';
  return null;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ============================================================================
// Store Types
// ============================================================================

interface NeonState {
  // View
  currentView: NeonView;
  
  // Playback
  playback: PlaybackState;
  queue: QueueState;
  
  // Equalizer
  equalizerEnabled: boolean;
  equalizerBands: EqualizerBand[];
  currentPreset: string;
  
  // Visualizer
  visualizer: VisualizerSettings;
  analyserData: Uint8Array | null;
  
  // Library
  library: MediaLibrary;
  
  // Settings
  settings: NeonSettings;
  
  // UI State
  showMetadataPanel: boolean;
  showEqualizer: boolean;
  isDraggingOver: boolean;
  
  // View Actions
  setView: (view: NeonView) => void;
  
  // Playback Actions
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  stop: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
  setRepeat: (mode: RepeatMode) => void;
  setShuffle: (mode: ShuffleMode) => void;
  
  // Queue Actions
  playItem: (item: MediaItem) => void;
  playItemAt: (index: number) => void;
  addToQueue: (item: MediaItem) => void;
  addMultipleToQueue: (items: MediaItem[]) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  reorderQueue: (fromIndex: number, toIndex: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  shuffleQueue: () => void;
  
  // Equalizer Actions
  toggleEqualizer: () => void;
  setEqualizerBand: (bandId: string, gain: number) => void;
  setEqualizerPreset: (presetId: string) => void;
  resetEqualizer: () => void;
  
  // Visualizer Actions
  setVisualizerType: (type: VisualizerType) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  setVisualizerSetting: <K extends keyof VisualizerSettings>(key: K, value: VisualizerSettings[K]) => void;
  setAnalyserData: (data: Uint8Array) => void;
  
  // Library Actions
  addToLibrary: (item: MediaItem) => void;
  removeFromLibrary: (itemId: string) => void;
  addToFavorites: (itemId: string) => void;
  removeFromFavorites: (itemId: string) => void;
  addToRecentlyPlayed: (itemId: string) => void;
  createPlaylist: (name: string, description?: string) => Playlist;
  deletePlaylist: (playlistId: string) => void;
  addToPlaylist: (playlistId: string, itemId: string) => void;
  removeFromPlaylist: (playlistId: string, itemId: string) => void;
  
  // Settings Actions
  updateSettings: (settings: Partial<NeonSettings>) => void;
  
  // UI Actions
  toggleMetadataPanel: () => void;
  toggleEqualizerPanel: () => void;
  setDraggingOver: (isDragging: boolean) => void;
  
  // Utility
  getItemById: (id: string) => MediaItem | undefined;
  getCurrentItem: () => MediaItem | null;
  updatePlaybackTime: (time: number) => void;
  setDuration: (duration: number) => void;
}

// ============================================================================
// Default Values
// ============================================================================

const DEFAULT_PLAYBACK: PlaybackState = {
  currentItem: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  muted: false,
  playbackRate: 1,
  repeat: 'off',
  shuffle: 'off',
};

const DEFAULT_QUEUE: QueueState = {
  items: [],
  currentIndex: -1,
  history: [],
};

const DEFAULT_VISUALIZER: VisualizerSettings = {
  type: 'spectrum',
  colorScheme: COLOR_SCHEMES[0],
  sensitivity: 70,
  smoothing: 60,
  showAlbumArt: true,
  showTrackInfo: true,
  fullscreen: false,
  particleCount: 200,
  glowIntensity: 50,
};

const DEFAULT_LIBRARY: MediaLibrary = {
  items: [],
  playlists: [],
  folders: [],
  recentlyPlayed: [],
  favorites: [],
};

const DEFAULT_SETTINGS: NeonSettings = {
  crossfade: false,
  crossfadeDuration: 3,
  gaplessPlayback: true,
  normalizeVolume: false,
  defaultVisualizer: 'spectrum',
  visualizerSensitivity: 70,
  libraryPaths: [],
  autoScanLibrary: false,
  showNFTsInLibrary: true,
  theme: 'dark',
  showMiniPlayer: true,
  backgroundPlayback: true,
};

// ============================================================================
// Store
// ============================================================================

export const useNeonStore = create<NeonState>()(
  persist(
    (set, get) => ({
      // Initial State
      currentView: 'nowPlaying',
      playback: DEFAULT_PLAYBACK,
      queue: DEFAULT_QUEUE,
      equalizerEnabled: false,
      equalizerBands: [...DEFAULT_EQ_BANDS],
      currentPreset: 'flat',
      visualizer: DEFAULT_VISUALIZER,
      analyserData: null,
      library: DEFAULT_LIBRARY,
      settings: DEFAULT_SETTINGS,
      showMetadataPanel: false,
      showEqualizer: false,
      isDraggingOver: false,
      
      // View Actions
      setView: (view) => set({ currentView: view }),
      
      // Playback Actions
      play: () => set((state) => ({
        playback: { ...state.playback, isPlaying: true },
      })),
      
      pause: () => set((state) => ({
        playback: { ...state.playback, isPlaying: false },
      })),
      
      togglePlay: () => set((state) => ({
        playback: { ...state.playback, isPlaying: !state.playback.isPlaying },
      })),
      
      stop: () => set((state) => ({
        playback: { ...state.playback, isPlaying: false, currentTime: 0 },
      })),
      
      seek: (time) => set((state) => ({
        playback: { ...state.playback, currentTime: time },
      })),
      
      setVolume: (volume) => set((state) => ({
        playback: { ...state.playback, volume: Math.max(0, Math.min(1, volume)) },
      })),
      
      toggleMute: () => set((state) => ({
        playback: { ...state.playback, muted: !state.playback.muted },
      })),
      
      setPlaybackRate: (rate) => set((state) => ({
        playback: { ...state.playback, playbackRate: rate },
      })),
      
      setRepeat: (mode) => set((state) => ({
        playback: { ...state.playback, repeat: mode },
      })),
      
      setShuffle: (mode) => set((state) => ({
        playback: { ...state.playback, shuffle: mode },
      })),
      
      // Queue Actions
      playItem: (item) => {
        const state = get();
        const existingIndex = state.queue.items.findIndex(i => i.id === item.id);
        
        if (existingIndex >= 0) {
          set({
            queue: { ...state.queue, currentIndex: existingIndex },
            playback: { ...state.playback, currentItem: item, isPlaying: true, currentTime: 0 },
          });
        } else {
          set({
            queue: {
              ...state.queue,
              items: [...state.queue.items, item],
              currentIndex: state.queue.items.length,
            },
            playback: { ...state.playback, currentItem: item, isPlaying: true, currentTime: 0 },
          });
        }
        
        // Add to recently played
        get().addToRecentlyPlayed(item.id);
      },
      
      playItemAt: (index) => {
        const state = get();
        const item = state.queue.items[index];
        if (item) {
          set({
            queue: { ...state.queue, currentIndex: index },
            playback: { ...state.playback, currentItem: item, isPlaying: true, currentTime: 0 },
          });
          get().addToRecentlyPlayed(item.id);
        }
      },
      
      addToQueue: (item) => set((state) => ({
        queue: {
          ...state.queue,
          items: [...state.queue.items, item],
        },
      })),
      
      addMultipleToQueue: (items) => set((state) => ({
        queue: {
          ...state.queue,
          items: [...state.queue.items, ...items],
        },
      })),
      
      removeFromQueue: (index) => set((state) => {
        const newItems = state.queue.items.filter((_, i) => i !== index);
        let newIndex = state.queue.currentIndex;
        
        if (index < state.queue.currentIndex) {
          newIndex--;
        } else if (index === state.queue.currentIndex) {
          newIndex = Math.min(newIndex, newItems.length - 1);
        }
        
        return {
          queue: {
            ...state.queue,
            items: newItems,
            currentIndex: newIndex,
          },
          playback: newIndex >= 0 && newItems[newIndex]
            ? { ...state.playback, currentItem: newItems[newIndex] }
            : { ...state.playback, currentItem: null, isPlaying: false },
        };
      }),
      
      clearQueue: () => set((state) => ({
        queue: DEFAULT_QUEUE,
        playback: { ...state.playback, currentItem: null, isPlaying: false, currentTime: 0 },
      })),
      
      reorderQueue: (fromIndex, toIndex) => set((state) => {
        const newItems = [...state.queue.items];
        const [removed] = newItems.splice(fromIndex, 1);
        newItems.splice(toIndex, 0, removed);
        
        let newCurrentIndex = state.queue.currentIndex;
        if (fromIndex === state.queue.currentIndex) {
          newCurrentIndex = toIndex;
        } else if (fromIndex < state.queue.currentIndex && toIndex >= state.queue.currentIndex) {
          newCurrentIndex--;
        } else if (fromIndex > state.queue.currentIndex && toIndex <= state.queue.currentIndex) {
          newCurrentIndex++;
        }
        
        return {
          queue: { ...state.queue, items: newItems, currentIndex: newCurrentIndex },
        };
      }),
      
      playNext: () => {
        const state = get();
        const { items, currentIndex } = state.queue;
        const { repeat, shuffle } = state.playback;
        
        if (items.length === 0) return;
        
        let nextIndex: number;
        
        if (repeat === 'one') {
          nextIndex = currentIndex;
        } else if (shuffle === 'on') {
          nextIndex = Math.floor(Math.random() * items.length);
        } else {
          nextIndex = currentIndex + 1;
          if (nextIndex >= items.length) {
            if (repeat === 'all') {
              nextIndex = 0;
            } else {
              set((s) => ({ playback: { ...s.playback, isPlaying: false } }));
              return;
            }
          }
        }
        
        get().playItemAt(nextIndex);
      },
      
      playPrevious: () => {
        const state = get();
        const { currentIndex, items, history } = state.queue;
        
        // If we're more than 3 seconds in, restart the track
        if (state.playback.currentTime > 3) {
          set((s) => ({ playback: { ...s.playback, currentTime: 0 } }));
          return;
        }
        
        if (items.length === 0) return;
        
        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) {
          prevIndex = state.playback.repeat === 'all' ? items.length - 1 : 0;
        }
        
        get().playItemAt(prevIndex);
      },
      
      shuffleQueue: () => set((state) => {
        const currentItem = state.queue.items[state.queue.currentIndex];
        const otherItems = state.queue.items.filter((_, i) => i !== state.queue.currentIndex);
        const shuffled = shuffleArray(otherItems);
        
        return {
          queue: {
            ...state.queue,
            items: currentItem ? [currentItem, ...shuffled] : shuffled,
            currentIndex: currentItem ? 0 : -1,
          },
        };
      }),
      
      // Equalizer Actions
      toggleEqualizer: () => set((state) => ({
        equalizerEnabled: !state.equalizerEnabled,
      })),
      
      setEqualizerBand: (bandId, gain) => set((state) => ({
        equalizerBands: state.equalizerBands.map(b =>
          b.id === bandId ? { ...b, gain: Math.max(-12, Math.min(12, gain)) } : b
        ),
        currentPreset: 'custom',
      })),
      
      setEqualizerPreset: (presetId) => {
        const preset = EQ_PRESETS.find(p => p.id === presetId);
        if (preset) {
          set({
            equalizerBands: [...preset.bands],
            currentPreset: presetId,
          });
        }
      },
      
      resetEqualizer: () => set({
        equalizerBands: [...DEFAULT_EQ_BANDS],
        currentPreset: 'flat',
      }),
      
      // Visualizer Actions
      setVisualizerType: (type) => set((state) => ({
        visualizer: { ...state.visualizer, type },
      })),
      
      setColorScheme: (scheme) => set((state) => ({
        visualizer: { ...state.visualizer, colorScheme: scheme },
      })),
      
      setVisualizerSetting: (key, value) => set((state) => ({
        visualizer: { ...state.visualizer, [key]: value },
      })),
      
      setAnalyserData: (data) => set({ analyserData: data }),
      
      // Library Actions
      addToLibrary: (item) => set((state) => {
        if (state.library.items.some(i => i.id === item.id)) return state;
        return {
          library: {
            ...state.library,
            items: [...state.library.items, item],
          },
        };
      }),
      
      removeFromLibrary: (itemId) => set((state) => ({
        library: {
          ...state.library,
          items: state.library.items.filter(i => i.id !== itemId),
          favorites: state.library.favorites.filter(id => id !== itemId),
          recentlyPlayed: state.library.recentlyPlayed.filter(id => id !== itemId),
        },
      })),
      
      addToFavorites: (itemId) => set((state) => {
        if (state.library.favorites.includes(itemId)) return state;
        return {
          library: {
            ...state.library,
            favorites: [...state.library.favorites, itemId],
          },
        };
      }),
      
      removeFromFavorites: (itemId) => set((state) => ({
        library: {
          ...state.library,
          favorites: state.library.favorites.filter(id => id !== itemId),
        },
      })),
      
      addToRecentlyPlayed: (itemId) => set((state) => ({
        library: {
          ...state.library,
          recentlyPlayed: [
            itemId,
            ...state.library.recentlyPlayed.filter(id => id !== itemId),
          ].slice(0, 50), // Keep last 50
        },
      })),
      
      createPlaylist: (name, description) => {
        const playlist: Playlist = {
          id: generateId(),
          name,
          description,
          items: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        
        set((state) => ({
          library: {
            ...state.library,
            playlists: [...state.library.playlists, playlist],
          },
        }));
        
        return playlist;
      },
      
      deletePlaylist: (playlistId) => set((state) => ({
        library: {
          ...state.library,
          playlists: state.library.playlists.filter(p => p.id !== playlistId),
        },
      })),
      
      addToPlaylist: (playlistId, itemId) => set((state) => ({
        library: {
          ...state.library,
          playlists: state.library.playlists.map(p =>
            p.id === playlistId && !p.items.includes(itemId)
              ? { ...p, items: [...p.items, itemId], updatedAt: Date.now() }
              : p
          ),
        },
      })),
      
      removeFromPlaylist: (playlistId, itemId) => set((state) => ({
        library: {
          ...state.library,
          playlists: state.library.playlists.map(p =>
            p.id === playlistId
              ? { ...p, items: p.items.filter(id => id !== itemId), updatedAt: Date.now() }
              : p
          ),
        },
      })),
      
      // Settings Actions
      updateSettings: (settings) => set((state) => ({
        settings: { ...state.settings, ...settings },
      })),
      
      // UI Actions
      toggleMetadataPanel: () => set((state) => ({
        showMetadataPanel: !state.showMetadataPanel,
      })),
      
      toggleEqualizerPanel: () => set((state) => ({
        showEqualizer: !state.showEqualizer,
      })),
      
      setDraggingOver: (isDragging) => set({ isDraggingOver: isDragging }),
      
      // Utility
      getItemById: (id) => get().library.items.find(i => i.id === id),
      
      getCurrentItem: () => get().playback.currentItem,
      
      updatePlaybackTime: (time) => set((state) => ({
        playback: { ...state.playback, currentTime: time },
      })),
      
      setDuration: (duration) => set((state) => ({
        playback: { ...state.playback, duration },
      })),
    }),
    {
      name: 'neon-storage',
      partialize: (state) => ({
        equalizerEnabled: state.equalizerEnabled,
        equalizerBands: state.equalizerBands,
        currentPreset: state.currentPreset,
        visualizer: state.visualizer,
        library: state.library,
        settings: state.settings,
        playback: {
          volume: state.playback.volume,
          muted: state.playback.muted,
          playbackRate: state.playback.playbackRate,
          repeat: state.playback.repeat,
          shuffle: state.playback.shuffle,
        },
      }),
    }
  )
);

// ============================================================================
// Selectors
// ============================================================================

export const selectCurrentItem = (state: NeonState) => state.playback.currentItem;
export const selectIsPlaying = (state: NeonState) => state.playback.isPlaying;
export const selectQueue = (state: NeonState) => state.queue;
export const selectEqualizer = (state: NeonState) => ({
  enabled: state.equalizerEnabled,
  bands: state.equalizerBands,
  preset: state.currentPreset,
});
export const selectVisualizer = (state: NeonState) => state.visualizer;
export const selectLibrary = (state: NeonState) => state.library;

// ============================================================================
// Utility Functions
// ============================================================================

export function createMediaItemFromFile(file: File): MediaItem | null {
  const mediaType = getMediaTypeFromFile(file.name);
  if (!mediaType) return null;
  
  return {
    id: generateId(),
    type: mediaType,
    name: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
    uri: URL.createObjectURL(file),
    metadata: {
      fileSize: file.size,
      mimeType: file.type,
      format: file.name.split('.').pop()?.toLowerCase(),
    },
    source: { type: 'local', path: file.name },
    addedAt: Date.now(),
  };
}

export function createMediaItemFromURL(url: string, name?: string): MediaItem | null {
  const mediaType = getMediaTypeFromFile(url);
  if (!mediaType) return null;
  
  return {
    id: generateId(),
    type: mediaType,
    name: name || url.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'Unknown',
    uri: url,
    metadata: {
      format: url.split('.').pop()?.toLowerCase(),
    },
    source: { type: 'url', url },
    addedAt: Date.now(),
  };
}
