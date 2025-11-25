"use client";

import { ReactNode } from "react";
import { FractureNav } from "./FractureNav";
import { AudioReactiveLayer } from "./AudioReactiveLayer";

interface FractureShellProps {
  children: ReactNode;
  showNav?: boolean;
}

export function FractureShell({ children, showNav = true }: FractureShellProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover pointer-events-none z-0"
        poster="/media/fracture-bg-poster.jpg"
      >
        <source src="/media/fracture-bg.webm" type="video/webm" />
        <source src="/media/fracture-bg.mp4" type="video/mp4" />
        {/* Fallback gradient if video fails */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-black" />
      </video>

      {/* Dark Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black/95 z-10 pointer-events-none" />

      {/* Audio Reactive Layer */}
      <AudioReactiveLayer />

      {/* Navigation */}
      {showNav && <FractureNav />}

      {/* Content Area */}
      <main className="relative z-20 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="max-w-7xl mx-auto">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-12">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

