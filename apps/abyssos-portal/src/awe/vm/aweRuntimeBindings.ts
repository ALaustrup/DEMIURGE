/**
 * AWE Runtime Bindings
 * 
 * WASM access to world state
 */

import type { WASMABI } from '../../services/runtime/wasmVM';
import { getCurrentEngine } from './aweVmHooks';

/**
 * Create AWE ABI for WASM runtime
 */
export function createAWERuntimeABI(): {
  getState: () => Promise<any>;
  setState: (partial: any) => Promise<boolean>;
  spawn: (position: any, mass?: number, properties?: any) => Promise<string | null>;
  applyForce: (entityId: string, force: any) => Promise<boolean>;
  runEvolutionCycle: () => Promise<boolean>;
  exportWorld: () => Promise<string | null>;
} {
  return {
    async getState() {
      const engine = getCurrentEngine();
      if (!engine) throw new Error('No world engine active');
      return engine.getState();
    },
    
    async setState(partial: any) {
      const engine = getCurrentEngine();
      if (!engine) return false;
      try {
        engine.setState(partial);
        return true;
      } catch {
        return false;
      }
    },
    
    async spawn(position: any, mass?: number, properties?: any) {
      const engine = getCurrentEngine();
      if (!engine) return null;
      try {
        return engine.spawnEntity(position, mass || 1, properties || {});
      } catch {
        return null;
      }
    },
    
    async applyForce(entityId: string, force: any) {
      const engine = getCurrentEngine();
      if (!engine) return false;
      try {
        engine.applyForce(entityId, force);
        return true;
      } catch {
        return false;
      }
    },
    
    async runEvolutionCycle() {
      const engine = getCurrentEngine();
      if (!engine) return false;
      try {
        engine.runEvolutionCycle();
        return true;
      } catch {
        return false;
      }
    },
    
    async exportWorld() {
      const engine = getCurrentEngine();
      if (!engine) return null;
      try {
        const { exportToJSON } = await import('../io/exporters');
        return exportToJSON(engine.getState());
      } catch {
        return null;
      }
    },
  };
}

