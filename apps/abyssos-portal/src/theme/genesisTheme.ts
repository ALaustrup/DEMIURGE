/**
 * Genesis Launcher Theme System
 * 
 * Unified theme colors and styling matching the Genesis Launcher design.
 * This theme is applied across the entire Demiurge ecosystem.
 */

export const GenesisTheme = {
  // Core Colors
  void: '#050505',           // Primary background (almost black)
  voidDark: '#000000',       // Pure black
  glass: '#0A0A0A',          // Glass/container background
  glassLight: '#0D0D0D',    // Lighter glass
  glassHover: '#151515',     // Hover state
  
  // Text Colors
  textPrimary: '#E0E0E0',    // Primary text (light gray)
  textSecondary: '#7A7A7A',  // Secondary text (medium gray)
  textTertiary: '#555555',   // Tertiary text (dark gray)
  
  // Accent Colors
  flameOrange: '#FF3D00',    // Primary accent (orange)
  flameOrangeHover: '#FF5722', // Hover state
  cipherCyan: '#00FFC8',     // Secondary accent (cyan)
  cipherCyanHover: '#00E5B8', // Hover state
  
  // Border Colors
  borderDefault: '#252525',  // Default border
  borderLight: 'rgba(255, 255, 255, 0.1)', // Light border
  borderMedium: 'rgba(255, 255, 255, 0.2)', // Medium border
  borderAccent: 'rgba(255, 61, 0, 0.3)',   // Accent border (flameOrange)
  borderCyan: 'rgba(0, 255, 200, 0.3)',    // Cyan border
  
  // Semantic Colors
  success: '#00FF88',
  warning: '#FF9100',
  error: '#FF4444',
  info: '#00FFC8',
  
  // Opacity Variants
  overlay: 'rgba(5, 5, 5, 0.9)',  // Dark overlay
  backdrop: 'rgba(0, 0, 0, 0.5)', // Backdrop blur
  
  // Shadows
  shadowGlow: '0 0 20px rgba(255, 61, 0, 0.3)', // Orange glow
  shadowCyan: '0 0 20px rgba(0, 255, 200, 0.3)', // Cyan glow
  shadowDark: '0 4px 20px rgba(0, 0, 0, 0.5)',
  
  // Spacing (matching Genesis Launcher)
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },
  
  // Typography
  font: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
    display: "'Orbitron', sans-serif", // For "GENESIS" style text
  },
  
  // Transitions
  transition: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    default: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    spring: '300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const;

/**
 * Tailwind-compatible color mapping
 */
export const GenesisTailwindColors = {
  void: GenesisTheme.void,
  'void-dark': GenesisTheme.voidDark,
  glass: GenesisTheme.glass,
  'glass-light': GenesisTheme.glassLight,
  'glass-hover': GenesisTheme.glassHover,
  'text-primary': GenesisTheme.textPrimary,
  'text-secondary': GenesisTheme.textSecondary,
  'text-tertiary': GenesisTheme.textTertiary,
  'flame-orange': GenesisTheme.flameOrange,
  'flame-orange-hover': GenesisTheme.flameOrangeHover,
  'cipher-cyan': GenesisTheme.cipherCyan,
  'cipher-cyan-hover': GenesisTheme.cipherCyanHover,
  'border-default': GenesisTheme.borderDefault,
  'border-light': GenesisTheme.borderLight,
  'border-medium': GenesisTheme.borderMedium,
  'border-accent': GenesisTheme.borderAccent,
  'border-cyan': GenesisTheme.borderCyan,
  success: GenesisTheme.success,
  warning: GenesisTheme.warning,
  error: GenesisTheme.error,
  info: GenesisTheme.info,
};

/**
 * CSS Variables for runtime theme switching
 */
export const GenesisCSSVariables = `
  --genesis-void: ${GenesisTheme.void};
  --genesis-void-dark: ${GenesisTheme.voidDark};
  --genesis-glass: ${GenesisTheme.glass};
  --genesis-glass-light: ${GenesisTheme.glassLight};
  --genesis-glass-hover: ${GenesisTheme.glassHover};
  --genesis-text-primary: ${GenesisTheme.textPrimary};
  --genesis-text-secondary: ${GenesisTheme.textSecondary};
  --genesis-text-tertiary: ${GenesisTheme.textTertiary};
  --genesis-flame-orange: ${GenesisTheme.flameOrange};
  --genesis-flame-orange-hover: ${GenesisTheme.flameOrangeHover};
  --genesis-cipher-cyan: ${GenesisTheme.cipherCyan};
  --genesis-cipher-cyan-hover: ${GenesisTheme.cipherCyanHover};
  --genesis-border-default: ${GenesisTheme.borderDefault};
  --genesis-border-light: ${GenesisTheme.borderLight};
  --genesis-border-medium: ${GenesisTheme.borderMedium};
  --genesis-border-accent: ${GenesisTheme.borderAccent};
  --genesis-border-cyan: ${GenesisTheme.borderCyan};
  --genesis-success: ${GenesisTheme.success};
  --genesis-warning: ${GenesisTheme.warning};
  --genesis-error: ${GenesisTheme.error};
  --genesis-info: ${GenesisTheme.info};
  --genesis-radius-sm: ${GenesisTheme.radius.sm};
  --genesis-radius-md: ${GenesisTheme.radius.md};
  --genesis-radius-lg: ${GenesisTheme.radius.lg};
  --genesis-radius-xl: ${GenesisTheme.radius.xl};
  --genesis-transition-fast: ${GenesisTheme.transition.fast};
  --genesis-transition-default: ${GenesisTheme.transition.default};
  --genesis-transition-slow: ${GenesisTheme.transition.slow};
  --genesis-transition-spring: ${GenesisTheme.transition.spring};
`;
