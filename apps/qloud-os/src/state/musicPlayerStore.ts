import { create } from 'zustand';
import type { DRC369 } from '../services/drc369/schema';
import type { FractalBeatmap } from '@abyssos/fractall/types';

interface MusicPlayerState {
  currentTrack: DRC369 | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  beatmap: FractalBeatmap[];
  isBackgroundMode: boolean;
  
  // Actions
  setTrack: (track: DRC369 | null) => void;
  setPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setBeatmap: (beatmap: FractalBeatmap[]) => void;
  setBackgroundMode: (enabled: boolean) => void;
  togglePlayPause: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
}

export const useMusicPlayerStore = create<MusicPlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  beatmap: [],
  isBackgroundMode: false,

  setTrack: (track) => set({ currentTrack: track }),
  setPlaying: (playing) => set({ isPlaying: playing }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  setBeatmap: (beatmap) => set({ beatmap }),
  setBackgroundMode: (enabled) => set({ isBackgroundMode: enabled }),
  
  togglePlayPause: () => set((state) => ({ isPlaying: !state.isPlaying })),
  nextTrack: () => {
    // TODO: Implement playlist navigation
    console.log('Next track');
  },
  previousTrack: () => {
    // TODO: Implement playlist navigation
    console.log('Previous track');
  },
}));

