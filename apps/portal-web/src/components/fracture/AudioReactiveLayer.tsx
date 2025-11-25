"use client";

import { useEffect, useRef } from "react";
import { useAudioSpectrum } from "@/lib/fracture/audio/useAudioSpectrum";

/**
 * AudioReactiveLayer
 * 
 * TODO: Milestone 4.1 – integrate audio-reactive behavior
 * This layer will apply visual effects based on audio spectrum data.
 * Currently stubbed with basic structure.
 */
export function AudioReactiveLayer() {
  const { low, mid, high, isActive } = useAudioSpectrum();
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!layerRef.current || !isActive) return;

    // TODO: Apply reactive visual effects based on low/mid/high values
    // Example: subtle glow, particle effects, parallax depth
    const intensity = (low + mid + high) / 3 / 255;
    
    if (layerRef.current) {
      layerRef.current.style.opacity = String(intensity * 0.1);
    }
  }, [low, mid, high, isActive]);

  return (
    <div
      ref={layerRef}
      className="fixed inset-0 z-15 pointer-events-none"
      style={{
        background: isActive
          ? `radial-gradient(circle at 50% 50%, rgba(6, 182, 212, ${low / 255 * 0.1}), transparent 70%)`
          : "transparent",
      }}
    />
  );
}

