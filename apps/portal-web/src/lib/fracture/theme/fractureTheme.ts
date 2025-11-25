/**
 * Fracture Theme
 * 
 * Centralized theme configuration for Fracture v1 UI.
 */

export const fractureTheme = {
  colors: {
    primary: {
      cyan: "#06b6d4", // cyan-500
      fuchsia: "#d946ef", // fuchsia-500
      purple: "#a855f7", // purple-500
    },
    background: {
      base: "#000000",
      overlay: "rgba(0, 0, 0, 0.8)",
      glass: "rgba(255, 255, 255, 0.05)",
    },
    border: {
      default: "rgba(255, 255, 255, 0.1)",
      accent: "rgba(6, 182, 212, 0.3)",
    },
    text: {
      primary: "#f4f4f5", // zinc-100
      secondary: "#a1a1aa", // zinc-400
      muted: "#71717a", // zinc-500
    },
  },
  gradients: {
    primary: "linear-gradient(to right, #06b6d4, #d946ef, #a855f7)",
    overlay: "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.8), rgba(0,0,0,0.95))",
  },
  effects: {
    blur: {
      backdrop: "backdrop-blur-xl",
      glass: "backdrop-blur-2xl",
    },
    glow: {
      cyan: "0 0 20px rgba(6, 182, 212, 0.3)",
      fuchsia: "0 0 20px rgba(217, 70, 239, 0.3)",
    },
  },
} as const;

