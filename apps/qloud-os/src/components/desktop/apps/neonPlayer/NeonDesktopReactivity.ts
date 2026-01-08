/**
 * NEON Desktop Reactivity
 * 
 * Updates QOR OS theme colors in real-time based on audio beatmap
 */

import { useEffect } from 'react';
import type { FractalBeatmap } from '@abyssos/fractall/types';
import { useThemeStore } from '../../../../state/themeStore';

interface NeonDesktopReactivityProps {
  beatmap: FractalBeatmap[];
  currentTime: number;
}

export function NeonDesktopReactivity({ beatmap, currentTime }: NeonDesktopReactivityProps) {
  const updateTheme = useThemeStore((state: any) => state.updateReactiveColors);
  const audioReactiveEnabled = useThemeStore((state: any) => state.audioReactiveEnabled);

  useEffect(() => {
    if (beatmap.length === 0 || !audioReactiveEnabled) return;

    // Find current beat
    const currentBeat = beatmap.find(
      (b) => Math.abs(b.timestamp - currentTime) < 0.1
    ) || beatmap[0];

    // Update theme colors (throttled to 60 FPS)
    const updateColors = () => {
      if (!audioReactiveEnabled) return;
      
      updateTheme({
        glow: {
          r: currentBeat.colorR,
          g: currentBeat.colorG,
          b: currentBeat.colorB,
          intensity: (currentBeat.bass + currentBeat.mid + currentBeat.high) / 3 / 255,
        },
        shadow: {
          r: currentBeat.colorR * 0.5,
          g: currentBeat.colorG * 0.5,
          b: currentBeat.colorB * 0.5,
        },
        bloom: currentBeat.beat / 255,
      });
    };

    const interval = setInterval(updateColors, 16); // ~60 FPS

    return () => clearInterval(interval);
  }, [beatmap, currentTime, updateTheme, audioReactiveEnabled]);

  return null; // This component doesn't render anything
}

