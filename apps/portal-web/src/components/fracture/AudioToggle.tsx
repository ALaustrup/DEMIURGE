"use client";

import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useAudioEngine } from "@/lib/fracture/audio/AudioContextProvider";

export function AudioToggle() {
  const { isPlaying, startAudio, stopAudio } = useAudioEngine();
  const [isEnabled, setIsEnabled] = useState(false);

  const handleToggle = () => {
    if (isEnabled) {
      stopAudio();
      setIsEnabled(false);
    } else {
      startAudio();
      setIsEnabled(true);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-zinc-300 hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-200"
      title={isEnabled ? "Disable audio reactivity" : "Enable audio reactivity"}
    >
      {isEnabled ? (
        <Volume2 className="h-5 w-5" />
      ) : (
        <VolumeX className="h-5 w-5" />
      )}
    </button>
  );
}

