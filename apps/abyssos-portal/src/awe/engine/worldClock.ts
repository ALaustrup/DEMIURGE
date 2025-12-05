/**
 * World Clock - Tick Scheduler
 */

export interface ClockConfig {
  tickRate: number; // Ticks per second (10-60)
  maxTickDelta: number; // Maximum tick delta for catch-up
  paused: boolean;
}

export class WorldClock {
  private config: ClockConfig;
  private lastTickTime: number = 0;
  private accumulatedTime: number = 0;
  private tickCallback?: (delta: number) => void;
  private animationFrameId?: number;
  
  constructor(config: Partial<ClockConfig> = {}) {
    this.config = {
      tickRate: config.tickRate || 30,
      maxTickDelta: config.maxTickDelta || 0.1,
      paused: config.paused || false,
    };
  }
  
  /**
   * Start clock
   */
  start(callback: (delta: number) => void): void {
    this.tickCallback = callback;
    this.lastTickTime = performance.now();
    this.tick();
  }
  
  /**
   * Stop clock
   */
  stop(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
    this.tickCallback = undefined;
  }
  
  /**
   * Pause clock
   */
  pause(): void {
    this.config.paused = true;
  }
  
  /**
   * Resume clock
   */
  resume(): void {
    this.config.paused = false;
    this.lastTickTime = performance.now();
  }
  
  /**
   * Set tick rate
   */
  setTickRate(rate: number): void {
    this.config.tickRate = Math.max(10, Math.min(60, rate));
  }
  
  /**
   * Get current tick rate
   */
  getTickRate(): number {
    return this.config.tickRate;
  }
  
  /**
   * Tick loop
   */
  private tick = (): void => {
    if (!this.tickCallback) return;
    
    const now = performance.now();
    const delta = (now - this.lastTickTime) / 1000; // Convert to seconds
    this.lastTickTime = now;
    
    if (!this.config.paused) {
      this.accumulatedTime += delta;
      
      const tickInterval = 1 / this.config.tickRate;
      const maxDelta = this.config.maxTickDelta;
      
      // Fixed timestep with catch-up
      while (this.accumulatedTime >= tickInterval) {
        const stepDelta = Math.min(this.accumulatedTime, maxDelta);
        this.tickCallback(stepDelta);
        this.accumulatedTime -= tickInterval;
      }
    }
    
    this.animationFrameId = requestAnimationFrame(this.tick);
  };
  
  /**
   * Step one tick manually
   */
  step(): void {
    if (this.tickCallback) {
      const tickInterval = 1 / this.config.tickRate;
      this.tickCallback(tickInterval);
    }
  }
}

