/**
 * Timeline Merger
 * 
 * Merges multiple branches into a singular reality
 */

import type { TimelineBranch, TemporalRoot } from './multiverseTypes';
import { branchEvaluator } from './branchEvaluator';

class TimelineMerger {
  /**
   * Merge branches into temporal root
   */
  async mergeBranches(
    branches: TimelineBranch[],
    goals?: any
  ): Promise<TemporalRoot> {
    // Find optimal branch
    const optimal = branchEvaluator.findOptimalBranch(branches, goals);
    
    if (!optimal) {
      // If no optimal branch, merge states
      return this.mergeStates(branches);
    }
    
    // Use optimal branch as base
    const mergedState = optimal.state;
    const branchHashes = branches.map(b => this.hashBranch(b));
    const rootHash = this.calculateRootHash(branchHashes, mergedState);
    
    return {
      rootHash,
      timestamp: Date.now(),
      branchHashes,
      mergedState,
    };
  }
  
  /**
   * Merge states from multiple branches
   */
  private mergeStates(branches: TimelineBranch[]): TemporalRoot {
    // Simple merge: take average of numeric values, union of arrays
    const mergedState: any = {};
    
    for (const branch of branches) {
      for (const [key, value] of Object.entries(branch.state)) {
        if (typeof value === 'number') {
          mergedState[key] = (mergedState[key] || 0) + value / branches.length;
        } else if (Array.isArray(value)) {
          mergedState[key] = [...new Set([...(mergedState[key] || []), ...value])];
        } else {
          mergedState[key] = value; // Last branch wins for non-numeric
        }
      }
    }
    
    const branchHashes = branches.map(b => this.hashBranch(b));
    const rootHash = this.calculateRootHash(branchHashes, mergedState);
    
    return {
      rootHash,
      timestamp: Date.now(),
      branchHashes,
      mergedState,
    };
  }
  
  /**
   * Hash branch
   */
  private hashBranch(branch: TimelineBranch): string {
    const data = JSON.stringify(branch.state) + branch.id;
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(16, '0');
  }
  
  /**
   * Calculate root hash
   */
  private calculateRootHash(branchHashes: string[], mergedState: any): string {
    const combined = branchHashes.join('') + JSON.stringify(mergedState);
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
export const timelineMerger = new TimelineMerger();

