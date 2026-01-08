/**
 * NEON Audio Engine
 * 
 * Web Audio API-based audio engine with equalizer, analyser, and effects
 */

import type { EqualizerBand } from './types';
import { DEFAULT_EQ_BANDS } from './types';

export class NeonAudioEngine {
  private audioContext: AudioContext | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private equalizerNodes: BiquadFilterNode[] = [];
  private stereoEnhancerNode: StereoPannerNode | null = null;
  
  private audioElement: HTMLAudioElement | null = null;
  private videoElement: HTMLVideoElement | null = null;
  
  private isInitialized = false;
  private equalizerEnabled = false;
  
  // Analyser configuration
  private fftSize = 2048;
  private smoothingTimeConstant = 0.8;
  
  // Callbacks
  private onAnalyserUpdate: ((data: Uint8Array) => void) | null = null;
  private animationFrameId: number | null = null;
  
  constructor() {
    // Audio context will be created on first user interaction
  }
  
  // ============================================================================
  // Initialization
  // ============================================================================
  
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      this.audioContext = new AudioContext();
      
      // Create nodes
      this.gainNode = this.audioContext.createGain();
      this.analyserNode = this.audioContext.createAnalyser();
      this.stereoEnhancerNode = this.audioContext.createStereoPanner();
      
      // Configure analyser
      this.analyserNode.fftSize = this.fftSize;
      this.analyserNode.smoothingTimeConstant = this.smoothingTimeConstant;
      
      // Create equalizer filter chain
      this.createEqualizerChain();
      
      // Connect nodes
      this.connectNodes();
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize audio engine:', error);
      throw error;
    }
  }
  
  private createEqualizerChain(): void {
    if (!this.audioContext) return;
    
    this.equalizerNodes = DEFAULT_EQ_BANDS.map(band => {
      const filter = this.audioContext!.createBiquadFilter();
      filter.type = band.type;
      filter.frequency.value = band.frequency;
      filter.gain.value = band.gain;
      if (band.q !== undefined) {
        filter.Q.value = band.q;
      }
      return filter;
    });
    
    // Connect filters in series
    for (let i = 0; i < this.equalizerNodes.length - 1; i++) {
      this.equalizerNodes[i].connect(this.equalizerNodes[i + 1]);
    }
  }
  
  private connectNodes(): void {
    if (!this.audioContext || !this.gainNode || !this.analyserNode) return;
    
    // Final output chain: [source] -> gain -> analyser -> destination
    // With EQ: [source] -> eq chain -> gain -> analyser -> destination
    
    if (this.equalizerEnabled && this.equalizerNodes.length > 0) {
      const lastEqNode = this.equalizerNodes[this.equalizerNodes.length - 1];
      lastEqNode.connect(this.gainNode);
    }
    
    this.gainNode.connect(this.analyserNode);
    this.analyserNode.connect(this.audioContext.destination);
  }
  
  // ============================================================================
  // Audio/Video Element Binding
  // ============================================================================
  
  async connectAudioElement(element: HTMLAudioElement): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    if (!this.audioContext) return;
    
    // Disconnect existing source
    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }
    
    this.audioElement = element;
    this.videoElement = null;
    
    // Resume audio context if suspended
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    
    // Create media element source
    this.sourceNode = this.audioContext.createMediaElementSource(element);
    
    // Connect to chain
    if (this.equalizerEnabled && this.equalizerNodes.length > 0) {
      this.sourceNode.connect(this.equalizerNodes[0]);
    } else if (this.gainNode) {
      this.sourceNode.connect(this.gainNode);
    }
  }
  
  async connectVideoElement(element: HTMLVideoElement): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    if (!this.audioContext) return;
    
    // Disconnect existing source
    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }
    
    this.videoElement = element;
    this.audioElement = null;
    
    // Resume audio context if suspended
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    
    // Create media element source
    this.sourceNode = this.audioContext.createMediaElementSource(element);
    
    // Connect to chain
    if (this.equalizerEnabled && this.equalizerNodes.length > 0) {
      this.sourceNode.connect(this.equalizerNodes[0]);
    } else if (this.gainNode) {
      this.sourceNode.connect(this.gainNode);
    }
  }
  
  disconnectElement(): void {
    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }
    this.audioElement = null;
    this.videoElement = null;
  }
  
  // ============================================================================
  // Equalizer Control
  // ============================================================================
  
  setEqualizerEnabled(enabled: boolean): void {
    if (this.equalizerEnabled === enabled) return;
    this.equalizerEnabled = enabled;
    
    // Reconnect nodes with new configuration
    if (this.sourceNode && this.gainNode) {
      this.sourceNode.disconnect();
      
      if (enabled && this.equalizerNodes.length > 0) {
        this.sourceNode.connect(this.equalizerNodes[0]);
        const lastEqNode = this.equalizerNodes[this.equalizerNodes.length - 1];
        lastEqNode.disconnect();
        lastEqNode.connect(this.gainNode);
      } else {
        this.sourceNode.connect(this.gainNode);
      }
    }
  }
  
  setEqualizerBands(bands: EqualizerBand[]): void {
    bands.forEach((band, index) => {
      if (this.equalizerNodes[index]) {
        this.equalizerNodes[index].gain.value = band.gain;
        this.equalizerNodes[index].frequency.value = band.frequency;
        if (band.q !== undefined) {
          this.equalizerNodes[index].Q.value = band.q;
        }
      }
    });
  }
  
  setEqualizerBand(index: number, gain: number): void {
    if (this.equalizerNodes[index]) {
      this.equalizerNodes[index].gain.value = Math.max(-12, Math.min(12, gain));
    }
  }
  
  // ============================================================================
  // Volume and Gain
  // ============================================================================
  
  setVolume(volume: number): void {
    if (this.gainNode) {
      // Use exponential ramp for more natural volume control
      const clampedVolume = Math.max(0, Math.min(1, volume));
      this.gainNode.gain.value = clampedVolume * clampedVolume; // Square for perceptual linearity
    }
  }
  
  setMuted(muted: boolean): void {
    if (this.gainNode) {
      this.gainNode.gain.value = muted ? 0 : 1;
    }
  }
  
  // ============================================================================
  // Analyser Data
  // ============================================================================
  
  setAnalyserCallback(callback: (data: Uint8Array) => void): void {
    this.onAnalyserUpdate = callback;
    this.startAnalyserLoop();
  }
  
  removeAnalyserCallback(): void {
    this.onAnalyserUpdate = null;
    this.stopAnalyserLoop();
  }
  
  private startAnalyserLoop(): void {
    if (this.animationFrameId !== null) return;
    
    const updateAnalyser = () => {
      if (!this.analyserNode || !this.onAnalyserUpdate) return;
      
      const dataArray = new Uint8Array(this.analyserNode.frequencyBinCount);
      this.analyserNode.getByteFrequencyData(dataArray);
      this.onAnalyserUpdate(dataArray);
      
      this.animationFrameId = requestAnimationFrame(updateAnalyser);
    };
    
    updateAnalyser();
  }
  
  private stopAnalyserLoop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
  
  getFrequencyData(): Uint8Array | null {
    if (!this.analyserNode) return null;
    const dataArray = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteFrequencyData(dataArray);
    return dataArray;
  }
  
  getTimeDomainData(): Uint8Array | null {
    if (!this.analyserNode) return null;
    const dataArray = new Uint8Array(this.analyserNode.fftSize);
    this.analyserNode.getByteTimeDomainData(dataArray);
    return dataArray;
  }
  
  getAverageFrequency(): number {
    const data = this.getFrequencyData();
    if (!data) return 0;
    const sum = data.reduce((acc, val) => acc + val, 0);
    return sum / data.length / 255;
  }
  
  getBassLevel(): number {
    const data = this.getFrequencyData();
    if (!data) return 0;
    // Bass is roughly the first 10% of frequency bins
    const bassEnd = Math.floor(data.length * 0.1);
    let sum = 0;
    for (let i = 0; i < bassEnd; i++) {
      sum += data[i];
    }
    return sum / bassEnd / 255;
  }
  
  getMidLevel(): number {
    const data = this.getFrequencyData();
    if (!data) return 0;
    // Mids are roughly 10-50% of frequency bins
    const midStart = Math.floor(data.length * 0.1);
    const midEnd = Math.floor(data.length * 0.5);
    let sum = 0;
    for (let i = midStart; i < midEnd; i++) {
      sum += data[i];
    }
    return sum / (midEnd - midStart) / 255;
  }
  
  getTrebleLevel(): number {
    const data = this.getFrequencyData();
    if (!data) return 0;
    // Treble is roughly 50-100% of frequency bins
    const trebleStart = Math.floor(data.length * 0.5);
    let sum = 0;
    for (let i = trebleStart; i < data.length; i++) {
      sum += data[i];
    }
    return sum / (data.length - trebleStart) / 255;
  }
  
  // ============================================================================
  // Stereo Enhancement
  // ============================================================================
  
  setStereoWidth(width: number): void {
    if (this.stereoEnhancerNode) {
      // width: -1 (full left) to 1 (full right), 0 = center
      this.stereoEnhancerNode.pan.value = Math.max(-1, Math.min(1, width));
    }
  }
  
  // ============================================================================
  // Configuration
  // ============================================================================
  
  setFFTSize(size: 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096 | 8192 | 16384 | 32768): void {
    this.fftSize = size;
    if (this.analyserNode) {
      this.analyserNode.fftSize = size;
    }
  }
  
  setSmoothing(value: number): void {
    this.smoothingTimeConstant = Math.max(0, Math.min(1, value));
    if (this.analyserNode) {
      this.analyserNode.smoothingTimeConstant = this.smoothingTimeConstant;
    }
  }
  
  // ============================================================================
  // Cleanup
  // ============================================================================
  
  destroy(): void {
    this.stopAnalyserLoop();
    this.disconnectElement();
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    this.gainNode = null;
    this.analyserNode = null;
    this.equalizerNodes = [];
    this.stereoEnhancerNode = null;
    this.isInitialized = false;
  }
  
  // ============================================================================
  // Getters
  // ============================================================================
  
  get context(): AudioContext | null {
    return this.audioContext;
  }
  
  get initialized(): boolean {
    return this.isInitialized;
  }
  
  get analyser(): AnalyserNode | null {
    return this.analyserNode;
  }
}

// Singleton instance
let audioEngineInstance: NeonAudioEngine | null = null;

export function getNeonAudioEngine(): NeonAudioEngine {
  if (!audioEngineInstance) {
    audioEngineInstance = new NeonAudioEngine();
  }
  return audioEngineInstance;
}

export function destroyNeonAudioEngine(): void {
  if (audioEngineInstance) {
    audioEngineInstance.destroy();
    audioEngineInstance = null;
  }
}
