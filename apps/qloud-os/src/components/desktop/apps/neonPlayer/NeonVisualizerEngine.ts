/**
 * NEON Visualizer Engine
 * 
 * Procedurally generated audio-reactive visualizations
 * Inspired by Windows Media Player classic visualizers
 * 
 * Future: Integration with Recursion game engine for advanced 3D visuals
 */

import type { VisualizerType, ColorScheme } from './types';

// ============================================================================
// Types
// ============================================================================

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  hue: number;
  alpha: number;
}

interface VisualizerConfig {
  type: VisualizerType;
  colorScheme: ColorScheme;
  sensitivity: number;
  smoothing: number;
  particleCount: number;
  glowIntensity: number;
}

// ============================================================================
// Visualizer Engine
// ============================================================================

export class NeonVisualizerEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationFrameId: number | null = null;
  
  private config: VisualizerConfig;
  private frequencyData: Uint8Array = new Uint8Array(0);
  private timeDomainData: Uint8Array = new Uint8Array(0);
  
  // Particle system
  private particles: Particle[] = [];
  
  // Smoothed values for smoother animations
  private smoothedBass = 0;
  private smoothedMid = 0;
  private smoothedTreble = 0;
  private smoothedAverage = 0;
  
  // Animation state
  private time = 0;
  private lastTime = 0;
  private rotation = 0;
  private hueOffset = 0;
  
  // Pre-calculated values
  private centerX = 0;
  private centerY = 0;
  private maxRadius = 0;
  
  constructor(canvas: HTMLCanvasElement, config?: Partial<VisualizerConfig>) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    
    this.config = {
      type: 'spectrum',
      colorScheme: {
        id: 'neon',
        name: 'Neon',
        primary: '#00d4ff',
        secondary: '#ff00ff',
        accent: '#00ff88',
        background: '#0a0a15',
      },
      sensitivity: 70,
      smoothing: 60,
      particleCount: 200,
      glowIntensity: 50,
      ...config,
    };
    
    this.resize();
    window.addEventListener('resize', this.resize.bind(this));
  }
  
  // ============================================================================
  // Configuration
  // ============================================================================
  
  setConfig(config: Partial<VisualizerConfig>): void {
    this.config = { ...this.config, ...config };
    
    // Reinitialize particles if count changed
    if (config.particleCount !== undefined) {
      this.initializeParticles();
    }
  }
  
  setType(type: VisualizerType): void {
    this.config.type = type;
    
    // Reset state for new visualizer
    this.particles = [];
    this.rotation = 0;
    this.hueOffset = 0;
    
    if (['particles', 'nebula', 'galaxy'].includes(type)) {
      this.initializeParticles();
    }
  }
  
  setColorScheme(scheme: ColorScheme): void {
    this.config.colorScheme = scheme;
  }
  
  // ============================================================================
  // Audio Data
  // ============================================================================
  
  updateFrequencyData(data: Uint8Array): void {
    this.frequencyData = data;
    this.updateSmoothedValues();
  }
  
  updateTimeDomainData(data: Uint8Array): void {
    this.timeDomainData = data;
  }
  
  private updateSmoothedValues(): void {
    const smoothFactor = this.config.smoothing / 100;
    const sensitivity = this.config.sensitivity / 50;
    
    // Calculate current values
    const bassEnd = Math.floor(this.frequencyData.length * 0.1);
    const midEnd = Math.floor(this.frequencyData.length * 0.5);
    
    let bass = 0, mid = 0, treble = 0;
    
    for (let i = 0; i < this.frequencyData.length; i++) {
      const value = this.frequencyData[i] / 255;
      if (i < bassEnd) bass += value;
      else if (i < midEnd) mid += value;
      else treble += value;
    }
    
    bass = (bass / bassEnd) * sensitivity;
    mid = (mid / (midEnd - bassEnd)) * sensitivity;
    treble = (treble / (this.frequencyData.length - midEnd)) * sensitivity;
    
    // Smooth transition
    this.smoothedBass = this.smoothedBass * smoothFactor + bass * (1 - smoothFactor);
    this.smoothedMid = this.smoothedMid * smoothFactor + mid * (1 - smoothFactor);
    this.smoothedTreble = this.smoothedTreble * smoothFactor + treble * (1 - smoothFactor);
    this.smoothedAverage = (this.smoothedBass + this.smoothedMid + this.smoothedTreble) / 3;
  }
  
  // ============================================================================
  // Animation Loop
  // ============================================================================
  
  start(): void {
    if (this.animationFrameId !== null) return;
    this.lastTime = performance.now();
    this.animate();
  }
  
  stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
  
  private animate = (): void => {
    const now = performance.now();
    const deltaTime = (now - this.lastTime) / 1000;
    this.lastTime = now;
    this.time += deltaTime;
    
    this.render(deltaTime);
    
    this.animationFrameId = requestAnimationFrame(this.animate);
  };
  
  // ============================================================================
  // Rendering
  // ============================================================================
  
  private render(deltaTime: number): void {
    // Clear canvas
    this.ctx.fillStyle = this.config.colorScheme.background;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Select visualizer type
    const type = this.config.type === 'random' 
      ? this.getRandomType() 
      : this.config.type;
    
    switch (type) {
      case 'spectrum':
        this.renderSpectrum();
        break;
      case 'waveform':
        this.renderWaveform();
        break;
      case 'circular':
        this.renderCircular();
        break;
      case 'particles':
        this.renderParticles(deltaTime);
        break;
      case 'kaleidoscope':
        this.renderKaleidoscope();
        break;
      case 'nebula':
        this.renderNebula(deltaTime);
        break;
      case 'geometricShapes':
        this.renderGeometricShapes();
        break;
      case 'vortex':
        this.renderVortex();
        break;
      case 'flames':
        this.renderFlames();
        break;
      case 'matrix':
        this.renderMatrix(deltaTime);
        break;
      case 'bars3d':
        this.render3DBars();
        break;
      case 'galaxy':
        this.renderGalaxy(deltaTime);
        break;
      default:
        this.renderSpectrum();
    }
    
    // Update global animation values
    this.rotation += deltaTime * (0.1 + this.smoothedBass * 0.5);
    this.hueOffset += deltaTime * 20;
  }
  
  private getRandomType(): VisualizerType {
    const types: VisualizerType[] = [
      'spectrum', 'waveform', 'circular', 'particles',
      'kaleidoscope', 'nebula', 'geometricShapes', 'vortex',
      'flames', 'bars3d', 'galaxy'
    ];
    return types[Math.floor(Math.random() * types.length)];
  }
  
  // ============================================================================
  // Visualizer Types
  // ============================================================================
  
  private renderSpectrum(): void {
    const barCount = Math.min(128, this.frequencyData.length);
    const barWidth = this.canvas.width / barCount;
    const maxHeight = this.canvas.height * 0.8;
    
    for (let i = 0; i < barCount; i++) {
      const value = this.frequencyData[i] / 255;
      const height = value * maxHeight * (this.config.sensitivity / 50);
      
      const hue = (i / barCount * 180 + this.hueOffset) % 360;
      const saturation = 80 + value * 20;
      const lightness = 40 + value * 30;
      
      // Glow effect
      if (this.config.glowIntensity > 0) {
        this.ctx.shadowColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        this.ctx.shadowBlur = this.config.glowIntensity * value / 2;
      }
      
      // Main bar
      const gradient = this.ctx.createLinearGradient(
        0, this.canvas.height - height,
        0, this.canvas.height
      );
      gradient.addColorStop(0, `hsl(${hue}, ${saturation}%, ${lightness}%)`);
      gradient.addColorStop(1, `hsl(${hue}, ${saturation}%, ${lightness * 0.5}%)`);
      
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(
        i * barWidth,
        this.canvas.height - height,
        barWidth - 2,
        height
      );
      
      // Mirror reflection
      this.ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.3)`;
      this.ctx.fillRect(
        i * barWidth,
        this.canvas.height,
        barWidth - 2,
        height * 0.3
      );
    }
    
    this.ctx.shadowBlur = 0;
  }
  
  private renderWaveform(): void {
    const { primary, secondary } = this.config.colorScheme;
    
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.centerY);
    
    for (let i = 0; i < this.timeDomainData.length; i++) {
      const x = (i / this.timeDomainData.length) * this.canvas.width;
      const value = this.timeDomainData[i] / 128 - 1;
      const y = this.centerY + value * this.canvas.height * 0.4 * (this.config.sensitivity / 50);
      
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    
    this.ctx.strokeStyle = primary;
    this.ctx.lineWidth = 2;
    this.ctx.shadowColor = primary;
    this.ctx.shadowBlur = this.config.glowIntensity;
    this.ctx.stroke();
    
    // Second wave (offset)
    this.ctx.beginPath();
    for (let i = 0; i < this.timeDomainData.length; i++) {
      const x = (i / this.timeDomainData.length) * this.canvas.width;
      const value = this.timeDomainData[i] / 128 - 1;
      const y = this.centerY - value * this.canvas.height * 0.3 * (this.config.sensitivity / 50);
      
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    
    this.ctx.strokeStyle = secondary;
    this.ctx.shadowColor = secondary;
    this.ctx.stroke();
    
    this.ctx.shadowBlur = 0;
  }
  
  private renderCircular(): void {
    const { primary, secondary, accent } = this.config.colorScheme;
    const barCount = Math.min(180, this.frequencyData.length);
    const baseRadius = this.maxRadius * 0.3;
    
    this.ctx.save();
    this.ctx.translate(this.centerX, this.centerY);
    this.ctx.rotate(this.rotation);
    
    for (let i = 0; i < barCount; i++) {
      const value = this.frequencyData[i] / 255;
      const angle = (i / barCount) * Math.PI * 2;
      const barLength = value * this.maxRadius * 0.5 * (this.config.sensitivity / 50);
      
      const hue = (i / barCount * 360 + this.hueOffset) % 360;
      
      const x1 = Math.cos(angle) * baseRadius;
      const y1 = Math.sin(angle) * baseRadius;
      const x2 = Math.cos(angle) * (baseRadius + barLength);
      const y2 = Math.sin(angle) * (baseRadius + barLength);
      
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      
      this.ctx.strokeStyle = `hsl(${hue}, 80%, ${50 + value * 30}%)`;
      this.ctx.lineWidth = 2 + value * 3;
      this.ctx.shadowColor = `hsl(${hue}, 80%, 60%)`;
      this.ctx.shadowBlur = this.config.glowIntensity * value;
      this.ctx.stroke();
      
      // Inner circle mirror
      const x3 = Math.cos(angle) * (baseRadius - barLength * 0.5);
      const y3 = Math.sin(angle) * (baseRadius - barLength * 0.5);
      
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x3, y3);
      this.ctx.strokeStyle = `hsla(${hue}, 80%, ${50 + value * 30}%, 0.5)`;
      this.ctx.stroke();
    }
    
    // Center circle
    this.ctx.beginPath();
    this.ctx.arc(0, 0, baseRadius * (0.8 + this.smoothedBass * 0.2), 0, Math.PI * 2);
    this.ctx.fillStyle = `${primary}20`;
    this.ctx.fill();
    this.ctx.strokeStyle = primary;
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    
    this.ctx.restore();
    this.ctx.shadowBlur = 0;
  }
  
  private initializeParticles(): void {
    this.particles = [];
    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push(this.createParticle());
    }
  }
  
  private createParticle(): Particle {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 4 + 1,
      life: 1,
      maxLife: Math.random() * 2 + 1,
      hue: Math.random() * 360,
      alpha: 1,
    };
  }
  
  private renderParticles(deltaTime: number): void {
    if (this.particles.length === 0) {
      this.initializeParticles();
    }
    
    const { primary, secondary } = this.config.colorScheme;
    
    for (const particle of this.particles) {
      // Update particle
      const audioForce = this.smoothedAverage * 5;
      particle.vx += (Math.random() - 0.5) * audioForce * deltaTime;
      particle.vy += (Math.random() - 0.5) * audioForce * deltaTime;
      
      particle.x += particle.vx * (1 + this.smoothedBass * 2);
      particle.y += particle.vy * (1 + this.smoothedBass * 2);
      
      particle.life -= deltaTime / particle.maxLife;
      particle.alpha = particle.life;
      particle.size = (1 + this.smoothedMid) * 3 * particle.life;
      
      // Wrap around screen
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;
      
      // Respawn dead particles
      if (particle.life <= 0) {
        Object.assign(particle, this.createParticle());
      }
      
      // Draw particle
      const hue = (particle.hue + this.hueOffset) % 360;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `hsla(${hue}, 80%, 60%, ${particle.alpha})`;
      this.ctx.shadowColor = `hsl(${hue}, 80%, 60%)`;
      this.ctx.shadowBlur = this.config.glowIntensity * particle.alpha;
      this.ctx.fill();
    }
    
    this.ctx.shadowBlur = 0;
  }
  
  private renderKaleidoscope(): void {
    const segments = 8;
    const segmentAngle = (Math.PI * 2) / segments;
    
    this.ctx.save();
    this.ctx.translate(this.centerX, this.centerY);
    
    for (let s = 0; s < segments; s++) {
      this.ctx.save();
      this.ctx.rotate(s * segmentAngle + this.rotation);
      
      // Mirror every other segment
      if (s % 2 === 1) {
        this.ctx.scale(-1, 1);
      }
      
      // Draw frequency bars in segment
      const barCount = Math.min(32, this.frequencyData.length);
      for (let i = 0; i < barCount; i++) {
        const value = this.frequencyData[i * 4] / 255;
        const distance = (i / barCount) * this.maxRadius * 0.8 + this.maxRadius * 0.1;
        const height = value * 30 * (this.config.sensitivity / 50);
        const angle = (value - 0.5) * 0.2;
        
        const hue = (i / barCount * 180 + this.hueOffset) % 360;
        
        this.ctx.save();
        this.ctx.rotate(angle);
        this.ctx.fillStyle = `hsla(${hue}, 80%, ${50 + value * 30}%, 0.8)`;
        this.ctx.fillRect(distance, -height / 2, 8, height);
        this.ctx.restore();
      }
      
      this.ctx.restore();
    }
    
    this.ctx.restore();
  }
  
  private renderNebula(deltaTime: number): void {
    // Similar to particles but with cloud-like effect
    if (this.particles.length === 0) {
      this.initializeParticles();
    }
    
    for (const particle of this.particles) {
      // Slower, more ethereal movement
      const angle = Math.atan2(particle.y - this.centerY, particle.x - this.centerX);
      particle.vx += Math.cos(angle + Math.PI / 2) * this.smoothedAverage * deltaTime;
      particle.vy += Math.sin(angle + Math.PI / 2) * this.smoothedAverage * deltaTime;
      
      particle.x += particle.vx * 0.5;
      particle.y += particle.vy * 0.5;
      particle.vx *= 0.99;
      particle.vy *= 0.99;
      
      particle.life -= deltaTime / (particle.maxLife * 2);
      
      if (particle.life <= 0 || 
          particle.x < -50 || particle.x > this.canvas.width + 50 ||
          particle.y < -50 || particle.y > this.canvas.height + 50) {
        Object.assign(particle, this.createParticle());
        particle.x = this.centerX + (Math.random() - 0.5) * 100;
        particle.y = this.centerY + (Math.random() - 0.5) * 100;
      }
      
      // Draw nebula cloud
      const hue = (particle.hue + this.hueOffset) % 360;
      const gradient = this.ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 10 * (1 + this.smoothedBass)
      );
      gradient.addColorStop(0, `hsla(${hue}, 70%, 50%, ${particle.alpha * 0.3})`);
      gradient.addColorStop(1, `hsla(${hue}, 70%, 50%, 0)`);
      
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(
        particle.x - particle.size * 20,
        particle.y - particle.size * 20,
        particle.size * 40,
        particle.size * 40
      );
    }
  }
  
  private renderGeometricShapes(): void {
    const { primary, secondary, accent } = this.config.colorScheme;
    const shapeCount = 6;
    
    this.ctx.save();
    this.ctx.translate(this.centerX, this.centerY);
    
    for (let s = 0; s < shapeCount; s++) {
      const sides = 3 + s;
      const layerBass = this.smoothedBass * (1 + s * 0.2);
      const radius = this.maxRadius * (0.2 + s * 0.1) * (1 + layerBass * 0.3);
      const rotation = this.rotation * (s % 2 === 0 ? 1 : -1) * (1 + s * 0.1);
      
      this.ctx.save();
      this.ctx.rotate(rotation);
      
      const hue = (s / shapeCount * 180 + this.hueOffset) % 360;
      
      this.ctx.beginPath();
      for (let i = 0; i <= sides; i++) {
        const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        if (i === 0) this.ctx.moveTo(x, y);
        else this.ctx.lineTo(x, y);
      }
      
      this.ctx.strokeStyle = `hsla(${hue}, 80%, 60%, ${0.8 - s * 0.1})`;
      this.ctx.lineWidth = 2 + this.smoothedMid * 3;
      this.ctx.shadowColor = `hsl(${hue}, 80%, 60%)`;
      this.ctx.shadowBlur = this.config.glowIntensity;
      this.ctx.stroke();
      
      this.ctx.restore();
    }
    
    this.ctx.restore();
    this.ctx.shadowBlur = 0;
  }
  
  private renderVortex(): void {
    const { primary } = this.config.colorScheme;
    const spirals = 3;
    const segments = 100;
    
    this.ctx.save();
    this.ctx.translate(this.centerX, this.centerY);
    this.ctx.rotate(this.rotation);
    
    for (let s = 0; s < spirals; s++) {
      const spiralOffset = (s / spirals) * Math.PI * 2;
      const hue = (s / spirals * 120 + this.hueOffset) % 360;
      
      this.ctx.beginPath();
      
      for (let i = 0; i < segments; i++) {
        const t = i / segments;
        const angle = t * Math.PI * 6 + spiralOffset;
        const freqIndex = Math.floor(t * this.frequencyData.length);
        const audioMod = this.frequencyData[freqIndex] / 255;
        const radius = t * this.maxRadius * (0.8 + audioMod * 0.2) * (this.config.sensitivity / 50);
        
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        if (i === 0) this.ctx.moveTo(x, y);
        else this.ctx.lineTo(x, y);
      }
      
      this.ctx.strokeStyle = `hsla(${hue}, 80%, 60%, 0.8)`;
      this.ctx.lineWidth = 2 + this.smoothedBass * 3;
      this.ctx.shadowColor = `hsl(${hue}, 80%, 60%)`;
      this.ctx.shadowBlur = this.config.glowIntensity;
      this.ctx.stroke();
    }
    
    this.ctx.restore();
    this.ctx.shadowBlur = 0;
  }
  
  private renderFlames(): void {
    const flameCount = 50;
    const baseY = this.canvas.height;
    
    for (let i = 0; i < flameCount; i++) {
      const x = (i / flameCount) * this.canvas.width + this.canvas.width / flameCount / 2;
      const freqIndex = Math.floor((i / flameCount) * this.frequencyData.length);
      const value = this.frequencyData[freqIndex] / 255;
      const height = value * this.canvas.height * 0.6 * (this.config.sensitivity / 50);
      
      const hue = 20 + value * 30; // Orange to yellow
      
      // Create flame gradient
      const gradient = this.ctx.createLinearGradient(x, baseY, x, baseY - height);
      gradient.addColorStop(0, `hsla(${hue}, 100%, 50%, 0.9)`);
      gradient.addColorStop(0.5, `hsla(${hue + 20}, 100%, 60%, 0.6)`);
      gradient.addColorStop(1, `hsla(${hue + 40}, 100%, 70%, 0)`);
      
      // Draw flame shape with some randomness
      const flameWidth = this.canvas.width / flameCount * 2;
      const wobble = Math.sin(this.time * 10 + i) * 5;
      
      this.ctx.beginPath();
      this.ctx.moveTo(x - flameWidth / 2, baseY);
      this.ctx.quadraticCurveTo(
        x + wobble, baseY - height * 0.5,
        x + wobble * 0.5, baseY - height
      );
      this.ctx.quadraticCurveTo(
        x - wobble, baseY - height * 0.5,
        x + flameWidth / 2, baseY
      );
      
      this.ctx.fillStyle = gradient;
      this.ctx.shadowColor = `hsl(${hue}, 100%, 50%)`;
      this.ctx.shadowBlur = this.config.glowIntensity;
      this.ctx.fill();
    }
    
    this.ctx.shadowBlur = 0;
  }
  
  private matrixDrops: number[] = [];
  
  private renderMatrix(deltaTime: number): void {
    const { primary } = this.config.colorScheme;
    const fontSize = 14;
    const columns = Math.floor(this.canvas.width / fontSize);
    
    // Initialize drops
    if (this.matrixDrops.length !== columns) {
      this.matrixDrops = Array(columns).fill(0).map(() => Math.random() * this.canvas.height);
    }
    
    // Semi-transparent black to create trail effect
    this.ctx.fillStyle = 'rgba(10, 10, 21, 0.1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.font = `${fontSize}px monospace`;
    
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
    
    for (let i = 0; i < columns; i++) {
      const freqIndex = Math.floor((i / columns) * this.frequencyData.length);
      const value = this.frequencyData[freqIndex] / 255;
      
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = this.matrixDrops[i];
      
      // Color based on audio
      const hue = (120 + value * 60 + this.hueOffset) % 360; // Green-ish
      this.ctx.fillStyle = `hsla(${hue}, 100%, ${50 + value * 30}%, ${0.8 + value * 0.2})`;
      this.ctx.shadowColor = `hsl(${hue}, 100%, 60%)`;
      this.ctx.shadowBlur = value * this.config.glowIntensity;
      
      this.ctx.fillText(char, x, y);
      
      // Reset drop to top with some randomness
      if (y > this.canvas.height && Math.random() > 0.975) {
        this.matrixDrops[i] = 0;
      }
      
      // Move drop down - faster with more bass
      this.matrixDrops[i] += fontSize * (0.5 + this.smoothedBass + value * 0.5);
    }
    
    this.ctx.shadowBlur = 0;
  }
  
  private render3DBars(): void {
    const barCount = Math.min(32, this.frequencyData.length);
    const barWidth = this.canvas.width / barCount * 0.8;
    const barSpacing = this.canvas.width / barCount;
    const maxHeight = this.canvas.height * 0.6;
    const perspective = 0.3;
    
    // Draw from back to front for proper layering
    for (let i = barCount - 1; i >= 0; i--) {
      const value = this.frequencyData[i * Math.floor(this.frequencyData.length / barCount)] / 255;
      const height = value * maxHeight * (this.config.sensitivity / 50);
      const x = i * barSpacing + barSpacing * 0.1;
      const y = this.canvas.height - height;
      
      const depth = i / barCount;
      const hue = (i / barCount * 180 + this.hueOffset) % 360;
      
      // 3D offset based on depth
      const offsetX = depth * 100 * perspective;
      const offsetY = depth * 50 * perspective;
      
      // Top face
      this.ctx.fillStyle = `hsla(${hue}, 80%, ${60 + value * 20}%, 1)`;
      this.ctx.beginPath();
      this.ctx.moveTo(x + offsetX, y - offsetY);
      this.ctx.lineTo(x + barWidth + offsetX, y - offsetY);
      this.ctx.lineTo(x + barWidth + offsetX * 0.5, y - offsetY * 0.5);
      this.ctx.lineTo(x + offsetX * 0.5, y - offsetY * 0.5);
      this.ctx.fill();
      
      // Front face
      this.ctx.fillStyle = `hsla(${hue}, 80%, ${50 + value * 20}%, 1)`;
      this.ctx.fillRect(x + offsetX * 0.5, y - offsetY * 0.5, barWidth, height);
      
      // Right face
      this.ctx.fillStyle = `hsla(${hue}, 80%, ${40 + value * 20}%, 1)`;
      this.ctx.beginPath();
      this.ctx.moveTo(x + barWidth + offsetX * 0.5, y - offsetY * 0.5);
      this.ctx.lineTo(x + barWidth + offsetX, y - offsetY);
      this.ctx.lineTo(x + barWidth + offsetX, y + height - offsetY);
      this.ctx.lineTo(x + barWidth + offsetX * 0.5, y + height - offsetY * 0.5);
      this.ctx.fill();
      
      // Glow
      if (value > 0.5) {
        this.ctx.shadowColor = `hsl(${hue}, 80%, 60%)`;
        this.ctx.shadowBlur = (value - 0.5) * 2 * this.config.glowIntensity;
      }
    }
    
    this.ctx.shadowBlur = 0;
  }
  
  private renderGalaxy(deltaTime: number): void {
    if (this.particles.length === 0) {
      this.initializeParticles();
    }
    
    this.ctx.save();
    this.ctx.translate(this.centerX, this.centerY);
    
    // Galaxy core glow
    const coreGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, this.maxRadius * 0.2);
    coreGradient.addColorStop(0, `hsla(${this.hueOffset % 360}, 80%, 70%, ${0.5 + this.smoothedBass * 0.3})`);
    coreGradient.addColorStop(1, 'transparent');
    this.ctx.fillStyle = coreGradient;
    this.ctx.fillRect(-this.maxRadius, -this.maxRadius, this.maxRadius * 2, this.maxRadius * 2);
    
    // Update and draw particles as stars
    for (const particle of this.particles) {
      // Orbital motion
      const distance = Math.sqrt(particle.x * particle.x + particle.y * particle.y);
      const angle = Math.atan2(particle.y, particle.x);
      const angularVelocity = (0.1 + this.smoothedAverage * 0.2) / (distance / 100 + 1);
      
      const newAngle = angle + angularVelocity * deltaTime;
      particle.x = Math.cos(newAngle) * distance;
      particle.y = Math.sin(newAngle) * distance;
      
      // Draw star
      const hue = (particle.hue + this.hueOffset) % 360;
      const starSize = particle.size * (1 + this.smoothedTreble);
      
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, starSize, 0, Math.PI * 2);
      this.ctx.fillStyle = `hsla(${hue}, 60%, 80%, ${0.5 + particle.alpha * 0.5})`;
      this.ctx.shadowColor = `hsl(${hue}, 60%, 80%)`;
      this.ctx.shadowBlur = starSize * 2;
      this.ctx.fill();
    }
    
    this.ctx.restore();
    this.ctx.shadowBlur = 0;
  }
  
  // ============================================================================
  // Resize Handler
  // ============================================================================
  
  private resize = (): void => {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    
    this.ctx.scale(dpr, dpr);
    
    this.centerX = rect.width / 2;
    this.centerY = rect.height / 2;
    this.maxRadius = Math.min(this.centerX, this.centerY);
  };
  
  // ============================================================================
  // Cleanup
  // ============================================================================
  
  destroy(): void {
    this.stop();
    window.removeEventListener('resize', this.resize);
    this.particles = [];
    this.matrixDrops = [];
  }
}
