/**
 * Chain Evolution Types
 * 
 * Types for chain bifurcation and merging
 */

export interface ChainFork {
  id: string;
  parentChainId: string;
  newChainId: string;
  forkHeight: number;
  reason: string;
  timestamp: number;
  stateDiff: any;
}

export interface ChainMerge {
  id: string;
  chain1Id: string;
  chain2Id: string;
  mergeHeight: number;
  reconciledState: any;
  timestamp: number;
}

export interface StateDiff {
  added: any[];
  removed: any[];
  modified: any[];
  conflicts: any[];
}

export interface TreatyContract {
  id: string;
  chainIds: string[];
  terms: string;
  consensus: number; // 0-1
  createdAt: number;
  expiresAt?: number;
}

