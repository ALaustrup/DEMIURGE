"use client";

import { createContext, useContext, ReactNode, useState, useRef, useEffect } from "react";
import { getAudioEngine, AudioEngine } from "./AudioEngine";

interface AudioContextValue {
  audioEngine: AudioEngine;
  isReady: boolean;
  isPlaying: boolean;
  startAudio: () => void;
  stopAudio: () => void;
  analyser: AnalyserNode | null;
}

const AudioContext = createContext<AudioContextValue | null>(null);

export function AudioContextProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioEngineRef = useRef<AudioEngine>(getAudioEngine());
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const startAudio = () => {
    // TODO: Milestone 4.1 – connect to actual audio source
    // For now, this is stubbed
    const engine = audioEngineRef.current;
    
    // In a real implementation, you would:
    // 1. Create or reference an audio element
    // 2. Set its src to your audio file
    // 3. Call engine.startAudio(audioElement)
    
    if (!audioElementRef.current) {
      // Stub: Create a dummy audio element for testing
      const audio = document.createElement("audio");
      audio.loop = true;
      audio.muted = true; // Start muted to avoid autoplay issues
      audioElementRef.current = audio;
    }

    const success = engine.startAudio(audioElementRef.current);
    if (success) {
      setIsReady(true);
      engine.setPlaying(true);
      setIsPlaying(true);
    }
  };

  const stopAudio = () => {
    const engine = audioEngineRef.current;
    engine.stopAudio();
    setIsReady(false);
    setIsPlaying(false);
  };

  return (
    <AudioContext.Provider
      value={{
        audioEngine: audioEngineRef.current,
        isReady,
        isPlaying,
        startAudio,
        stopAudio,
        analyser: audioEngineRef.current.getAnalyser(),
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudioEngine(): AudioContextValue {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudioEngine must be used within AudioContextProvider");
  }
  return context;
}

