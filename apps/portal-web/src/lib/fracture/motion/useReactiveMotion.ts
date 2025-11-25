"use client";

import { useMemo } from "react";
import { useAudioSpectrum } from "../audio/useAudioSpectrum";

/**
 * useReactiveMotion
 * 
 * TODO: Milestone 4.1 – integrate audio-reactive behavior
 * 
 * Maps low/mid/high frequency bands to subtle UI motion props.
 */
export function useReactiveMotion() {
  const { low, mid, high, isActive } = useAudioSpectrum();

  const motionProps = useMemo(() => {
    if (!isActive) {
      return {
        glowIntensity: 0,
        wobble: 0,
        parallaxDepth: 0,
        flicker: 0,
      };
    }

    // Normalize values (0-255) to 0-1 range
    const lowNorm = low / 255;
    const midNorm = mid / 255;
    const highNorm = high / 255;

    return {
      // Glow intensity based on overall energy
      glowIntensity: (lowNorm + midNorm + highNorm) / 3,
      
      // Wobble based on low frequencies (bass)
      wobble: lowNorm * 2, // Max 2px displacement
      
      // Parallax depth based on mid frequencies
      parallaxDepth: midNorm * 10, // Max 10px depth
      
      // Flicker based on high frequencies (treble)
      flicker: highNorm * 0.3, // Max 30% opacity variation
    };
  }, [low, mid, high, isActive]);

  return motionProps;
}

