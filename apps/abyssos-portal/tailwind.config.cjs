/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Genesis Launcher Theme Colors
        genesis: {
          void: '#050505',
          'void-dark': '#000000',
          glass: '#0A0A0A',
          'glass-light': '#0D0D0D',
          'glass-hover': '#151515',
          'text-primary': '#E0E0E0',
          'text-secondary': '#7A7A7A',
          'text-tertiary': '#555555',
          'flame-orange': '#FF3D00',
          'flame-orange-hover': '#FF5722',
          'cipher-cyan': '#00FFC8',
          'cipher-cyan-hover': '#00E5B8',
          'border-default': '#252525',
          'border-light': 'rgba(255, 255, 255, 0.1)',
          'border-medium': 'rgba(255, 255, 255, 0.2)',
          'border-accent': 'rgba(255, 61, 0, 0.3)',
          'border-cyan': 'rgba(0, 255, 200, 0.3)',
          success: '#00FF88',
          warning: '#FF9100',
          error: '#FF4444',
          info: '#00FFC8',
        },
        // Legacy Abyss colors (mapped to Genesis for compatibility)
        abyss: {
          dark: '#050505',      // Genesis void
          navy: '#0A0A0A',      // Genesis glass
          cyan: '#00FFC8',      // Genesis cipher-cyan
          magenta: '#FF3D00',    // Genesis flame-orange
          purple: '#9d00ff',    // Keep for special cases
        },
      },
      borderRadius: {
        'genesis-sm': '8px',
        'genesis-md': '12px',
        'genesis-lg': '16px',
        'genesis-xl': '24px',
      },
      fontFamily: {
        'genesis': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'genesis-mono': ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        'genesis-display': ['Orbitron', 'sans-serif'],
      },
      transitionTimingFunction: {
        'genesis-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      boxShadow: {
        'genesis-glow': '0 0 20px rgba(255, 61, 0, 0.3)',
        'genesis-cyan': '0 0 20px rgba(0, 255, 200, 0.3)',
        'genesis-dark': '0 4px 20px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'glitch': 'glitch 0.3s infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'genesis-pulse': 'genesis-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 0.5 },
          '50%': { opacity: 1 },
        },
        'genesis-pulse': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
      },
    },
  },
  plugins: [],
}

