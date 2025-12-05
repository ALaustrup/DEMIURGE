/**
 * State Diff
 * 
 * Calculate differences in chain states
 */

import type { StateDiff } from './chainEvolutionTypes';

/**
 * Calculate state diff between two states
 */
export function calculateStateDiff(state1: any, state2: any): StateDiff {
  const diff: StateDiff = {
    added: [],
    removed: [],
    modified: [],
    conflicts: [],
  };
  
  // Get all keys from both states
  const keys1 = new Set(Object.keys(state1 || {}));
  const keys2 = new Set(Object.keys(state2 || {}));
  
  // Find added keys (in state2 but not state1)
  for (const key of keys2) {
    if (!keys1.has(key)) {
      diff.added.push({ key, value: state2[key] });
    }
  }
  
  // Find removed keys (in state1 but not state2)
  for (const key of keys1) {
    if (!keys2.has(key)) {
      diff.removed.push({ key, value: state1[key] });
    }
  }
  
  // Find modified keys
  for (const key of keys1) {
    if (keys2.has(key)) {
      const val1 = state1[key];
      const val2 = state2[key];
      if (JSON.stringify(val1) !== JSON.stringify(val2)) {
        diff.modified.push({ key, oldValue: val1, newValue: val2 });
      }
    }
  }
  
  return diff;
}

/**
 * Check if states are compatible for merge
 */
export function areStatesCompatible(state1: any, state2: any): boolean {
  const diff = calculateStateDiff(state1, state2);
  // States are compatible if no conflicts
  return diff.conflicts.length === 0;
}

