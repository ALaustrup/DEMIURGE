/**
 * World State Manager
 * 
 * Manages world state lifecycle, snapshots, rollback
 */

import type { WorldState, WorldSnapshot } from '../types';
import { hashString, generateWorldSeed } from '../utils';

export class StateManager {
  private snapshots: WorldSnapshot[] = [];
  private maxSnapshots: number = 100;
  
  /**
   * Create new world state
   */
  createWorld(seed?: string, config?: Partial<WorldState>): WorldState {
    const worldId = `world_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      id: worldId,
      seed: seed || generateWorldSeed(),
      tick: 0,
      entities: new Map(),
      species: new Map(),
      rules: [],
      physics: config?.physics || {
        gravity: 9.8,
        friction: 0.1,
        collisionEnabled: true,
        bounds: { width: 100, height: 100, depth: 100 },
      },
      bio: config?.bio || {
        metabolismRate: 0.1,
        replicationThreshold: 50,
        mutationRate: 0.01,
        energyDecay: 1,
        maxAge: 1000,
      },
      society: config?.society || {
        tradeEnabled: true,
        treatyEnabled: true,
        socialGraphEnabled: true,
        currencyEnabled: false,
      },
      evolution: config?.evolution || {
        selectionPressure: 0.5,
        mutationRate: 0.01,
        speciationThreshold: 10,
        extinctionThreshold: 0.1,
      },
      timestamp: Date.now(),
    };
  }
  
  /**
   * Create snapshot
   */
  createSnapshot(state: WorldState): WorldSnapshot {
    const data = JSON.stringify({
      tick: state.tick,
      entities: Array.from(state.entities.entries()).sort(([a], [b]) => a.localeCompare(b)),
      species: Array.from(state.species.entries()).sort(([a], [b]) => a.localeCompare(b)),
      rules: state.rules.map(r => r.id).sort(),
    });
    const merkleRoot = hashString(data);
    
    const snapshot: WorldSnapshot = {
      worldId: state.id,
      tick: state.tick,
      state: this.deepClone(state),
      timestamp: Date.now(),
      merkleRoot,
    };
    
    this.snapshots.push(snapshot);
    
    // Limit snapshot count
    if (this.snapshots.length > this.maxSnapshots) {
      this.snapshots.shift();
    }
    
    return snapshot;
  }
  
  /**
   * Restore from snapshot
   */
  restoreFromSnapshot(snapshot: WorldSnapshot): WorldState {
    return this.deepClone(snapshot.state);
  }
  
  /**
   * Get latest snapshot
   */
  getLatestSnapshot(worldId: string): WorldSnapshot | undefined {
    return this.snapshots
      .filter(s => s.worldId === worldId)
      .sort((a, b) => b.tick - a.tick)[0];
  }
  
  /**
   * Get snapshot at tick
   */
  getSnapshotAtTick(worldId: string, tick: number): WorldSnapshot | undefined {
    return this.snapshots
      .filter(s => s.worldId === worldId && s.tick <= tick)
      .sort((a, b) => b.tick - a.tick)[0];
  }
  
  /**
   * Deep clone world state
   */
  private deepClone(state: WorldState): WorldState {
    // Clone entities map
    const entities = new Map<string, any>();
    for (const [id, entity] of state.entities.entries()) {
      entities.set(id, { ...entity, position: { ...entity.position }, velocity: { ...entity.velocity } });
    }
    
    // Clone species map
    const species = new Map<string, any>();
    for (const [id, speciesData] of state.species.entries()) {
      species.set(id, { ...speciesData, traits: { ...speciesData.traits } });
    }
    
    return {
      ...state,
      entities,
      species,
      rules: state.rules.map(r => ({ ...r })),
      physics: { ...state.physics, bounds: { ...state.physics.bounds } },
      bio: { ...state.bio },
      society: { ...state.society },
      evolution: { ...state.evolution },
    };
  }
  
  /**
   * Clear snapshots
   */
  clearSnapshots(worldId?: string): void {
    if (worldId) {
      this.snapshots = this.snapshots.filter(s => s.worldId !== worldId);
    } else {
      this.snapshots = [];
    }
  }
}

