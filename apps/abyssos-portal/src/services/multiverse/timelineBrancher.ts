/**
 * Timeline Brancher
 * 
 * Creates parallel simulation branches from a current state
 */

import type { TimelineBranch } from './multiverseTypes';
import { temporalStateManager } from '../temporal/temporalState';

class TimelineBrancher {
  /**
   * Create branches from current state
   */
  async createBranches(
    currentState: any,
    branchCount: number = 3
  ): Promise<TimelineBranch[]> {
    const branches: TimelineBranch[] = [];
    const now = temporalStateManager.getState().now;
    
    for (let i = 0; i < branchCount; i++) {
      const branch: TimelineBranch = {
        id: `branch:${Date.now()}:${i}:${Math.random().toString(36).substr(2, 9)}`,
        parentBranchId: null,
        state: JSON.parse(JSON.stringify(currentState)), // Deep clone
        executionPath: [],
        score: 50, // Initial score
        timestamp: Date.now(),
        depth: 0,
      };
      
      branches.push(branch);
    }
    
    return branches;
  }
  
  /**
   * Branch from existing branch
   */
  branchFrom(parentBranch: TimelineBranch, mutation: any): TimelineBranch {
    const child: TimelineBranch = {
      id: `branch:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`,
      parentBranchId: parentBranch.id,
      state: JSON.parse(JSON.stringify(parentBranch.state)),
      executionPath: [...parentBranch.executionPath, mutation.action],
      score: parentBranch.score,
      timestamp: Date.now(),
      depth: parentBranch.depth + 1,
    };
    
    // Apply mutation
    if (mutation.stateChange) {
      Object.assign(child.state, mutation.stateChange);
    }
    
    return child;
  }
  
  /**
   * Get branch lineage
   */
  getBranchLineage(branch: TimelineBranch, allBranches: TimelineBranch[]): TimelineBranch[] {
    const lineage: TimelineBranch[] = [branch];
    let current = branch;
    
    while (current.parentBranchId) {
      const parent = allBranches.find(b => b.id === current.parentBranchId);
      if (!parent) break;
      lineage.unshift(parent);
      current = parent;
    }
    
    return lineage;
  }
}

// Singleton instance
export const timelineBrancher = new TimelineBrancher();

