"use client";

import { ReactNode } from "react";

interface HeroPanelProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function HeroPanel({ title, subtitle, children }: HeroPanelProps) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-purple-500">
          {title}
        </span>
      </h1>
      {subtitle && (
        <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      {children && (
        <div className="mt-8">
          {children}
        </div>
      )}
    </div>
  );
}

