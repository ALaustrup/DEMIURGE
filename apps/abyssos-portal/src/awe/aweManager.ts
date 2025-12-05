/**
 * AWE Manager
 * 
 * Supervisor layer for managing worlds
 */

import { WorldEngine } from './engine/worldEngine';
import { StateManager } from './engine/stateManager';
import { exportToDVFS } from './io/exporters';
import { importFromDVFS } from './io/importers';
import type { WorldState, WorldID } from './types';

export class AWEManager {
  private worlds: Map<WorldID, WorldEngine> = new Map();
  private activeWorldId: WorldID | null = null;
  private stateManager: StateManager = new StateManager();
  private autoSaveInterval: ReturnType<typeof setInterval> | null = null;
  private memoryBudget: number = 100 * 1024 * 1024; // 100MB
  
  /**
   * Start world
   */
  async startWorld(worldId: WorldID): Promise<boolean> {
    const engine = this.worlds.get(worldId);
    if (!engine) {
      // Try to load from DVFS
      const state = await this.loadWorldFromDVFS(worldId);
      if (!state) return false;
      
      const newEngine = new WorldEngine(state);
      this.worlds.set(worldId, newEngine);
      newEngine.start();
      this.activeWorldId = worldId;
      return true;
    }
    
    engine.start();
    this.activeWorldId = worldId;
    return true;
  }
  
  /**
   * Stop world
   */
  stopWorld(worldId: WorldID): void {
    const engine = this.worlds.get(worldId);
    if (engine) {
      engine.stop();
      if (this.activeWorldId === worldId) {
        this.activeWorldId = null;
      }
    }
  }
  
  /**
   * Pause world
   */
  pauseWorld(worldId: WorldID): void {
    const engine = this.worlds.get(worldId);
    if (engine) {
      engine.pause();
    }
  }
  
  /**
   * Resume world
   */
  resumeWorld(worldId: WorldID): void {
    const engine = this.worlds.get(worldId);
    if (engine) {
      engine.resume();
    }
  }
  
  /**
   * Create new world
   */
  createWorld(seed?: string, config?: Partial<WorldState>): WorldID {
    const state = this.stateManager.createWorld(seed, config);
    const engine = new WorldEngine(state);
    this.worlds.set(state.id, engine);
    return state.id;
  }
  
  /**
   * Add existing world engine
   */
  addWorld(engine: WorldEngine): WorldID {
    const state = engine.getState();
    this.worlds.set(state.id, engine);
    return state.id;
  }
  
  /**
   * Get world engine
   */
  getWorld(worldId: WorldID): WorldEngine | undefined {
    return this.worlds.get(worldId);
  }
  
  /**
   * Get active world
   */
  getActiveWorld(): WorldEngine | undefined {
    if (!this.activeWorldId) return undefined;
    return this.worlds.get(this.activeWorldId);
  }
  
  /**
   * Switch active world
   */
  switchWorld(worldId: WorldID): boolean {
    if (this.activeWorldId) {
      const current = this.worlds.get(this.activeWorldId);
      if (current) {
        current.pause();
      }
    }
    
    const engine = this.worlds.get(worldId);
    if (!engine) return false;
    
    this.activeWorldId = worldId;
    engine.resume();
    return true;
  }
  
  /**
   * Save world to DVFS
   */
  async saveWorldToDVFS(worldId: WorldID): Promise<boolean> {
    const engine = this.worlds.get(worldId);
    if (!engine) return false;
    
    try {
      const state = engine.getState();
      const path = `/home/worlds/${worldId}/state.json`;
      await exportToDVFS(state, path);
      return true;
    } catch (error) {
      console.error('[AWE Manager] Failed to save world:', error);
      return false;
    }
  }
  
  /**
   * Load world from DVFS
   */
  async loadWorldFromDVFS(worldId: WorldID): Promise<WorldState | null> {
    try {
      const path = `/home/worlds/${worldId}/state.json`;
      return await importFromDVFS(path);
    } catch (error) {
      console.error('[AWE Manager] Failed to load world:', error);
      return null;
    }
  }
  
  /**
   * Start auto-save
   */
  startAutoSave(intervalMs: number = 30000): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
    
    this.autoSaveInterval = setInterval(async () => {
      for (const [worldId] of this.worlds.entries()) {
        await this.saveWorldToDVFS(worldId);
      }
    }, intervalMs);
  }
  
  /**
   * Stop auto-save
   */
  stopAutoSave(): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
  }
  
  /**
   * Get all world IDs
   */
  getWorldIds(): WorldID[] {
    return Array.from(this.worlds.keys());
  }
  
  /**
   * Check memory usage
   */
  checkMemoryBudget(): { withinBudget: boolean; usage: number } {
    // Simplified memory check
    let usage = 0;
    for (const engine of this.worlds.values()) {
      const state = engine.getState();
      usage += state.entities.size * 100; // Rough estimate
      usage += state.species.size * 50;
    }
    
    return {
      withinBudget: usage < this.memoryBudget,
      usage,
    };
  }
  
  /**
   * Throttle worlds if over budget
   */
  throttleIfNeeded(): void {
    const { withinBudget } = this.checkMemoryBudget();
    
    if (!withinBudget) {
      // Reduce tick rate for all worlds
      for (const engine of this.worlds.values()) {
        engine.setTickRate(10); // Slow down
      }
    }
  }
}

// Singleton instance
export const aweManager = new AWEManager();

// Auto-start auto-save
if (typeof window !== 'undefined') {
  aweManager.startAutoSave();
}

