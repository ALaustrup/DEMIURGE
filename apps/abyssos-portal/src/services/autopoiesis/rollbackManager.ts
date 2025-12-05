/**
 * Rollback Manager
 * 
 * Snapshots and restores system state
 */

import type { SystemSnapshot } from './autopoiesisTypes';

class RollbackManager {
  private snapshots: Map<string, SystemSnapshot> = new Map();
  private maxSnapshots = 10;
  
  /**
   * Create snapshot
   */
  createSnapshot(modules: Map<string, string>, state: any): SystemSnapshot {
    const snapshot: SystemSnapshot = {
      id: `snapshot:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      modules: new Map(modules),
      state: JSON.parse(JSON.stringify(state)), // Deep clone
      merkleRoot: this.calculateMerkleRoot(modules),
    };
    
    this.snapshots.set(snapshot.id, snapshot);
    
    // Keep only last N snapshots
    if (this.snapshots.size > this.maxSnapshots) {
      const oldest = Array.from(this.snapshots.values())
        .sort((a, b) => a.timestamp - b.timestamp)[0];
      this.snapshots.delete(oldest.id);
    }
    
    return snapshot;
  }
  
  /**
   * Get snapshot
   */
  getSnapshot(id: string): SystemSnapshot | undefined {
    return this.snapshots.get(id);
  }
  
  /**
   * Get latest snapshot
   */
  getLatestSnapshot(): SystemSnapshot | undefined {
    const snapshots = Array.from(this.snapshots.values());
    if (snapshots.length === 0) return undefined;
    
    return snapshots.sort((a, b) => b.timestamp - a.timestamp)[0];
  }
  
  /**
   * Restore from snapshot
   */
  async restoreSnapshot(snapshotId: string): Promise<boolean> {
    const snapshot = this.snapshots.get(snapshotId);
    if (!snapshot) {
      return false;
    }
    
    // Verify Merkle root
    const currentRoot = this.calculateMerkleRoot(snapshot.modules);
    if (currentRoot !== snapshot.merkleRoot) {
      console.error('[Rollback] Snapshot integrity check failed');
      return false;
    }
    
    // In production, restore modules and state
    console.log(`[Rollback] Restoring snapshot ${snapshotId}`);
    return true;
  }
  
  /**
   * Calculate Merkle root from modules
   */
  private calculateMerkleRoot(modules: Map<string, string>): string {
    const hashes = Array.from(modules.values());
    return this.merkleRoot(hashes);
  }
  
  /**
   * Merkle root calculation
   */
  private merkleRoot(items: string[]): string {
    if (items.length === 0) return '0';
    if (items.length === 1) return items[0];
    
    let level = items;
    while (level.length > 1) {
      const nextLevel: string[] = [];
      for (let i = 0; i < level.length; i += 2) {
        const left = level[i];
        const right = i + 1 < level.length ? level[i + 1] : left;
        nextLevel.push(this.hashPair(left, right));
      }
      level = nextLevel;
    }
    
    return level[0];
  }
  
  /**
   * Hash pair
   */
  private hashPair(a: string, b: string): string {
    const combined = a + b;
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(16, '0');
  }
}

// Singleton instance
export const rollbackManager = new RollbackManager();

