/**
 * Multiverse Types
 * 
 * Types for parallel timeline execution
 */

export interface TimelineBranch {
  id: string;
  parentBranchId: string | null;
  state: any;
  executionPath: string[]; // Sequence of decisions/actions
  score: number; // 0-100, branch quality
  timestamp: number;
  depth: number; // How many steps into future
}

export interface BranchEvaluation {
  branchId: string;
  score: number;
  metrics: {
    stability: number;
    efficiency: number;
    goalAlignment: number;
  };
  recommendation: 'optimal' | 'acceptable' | 'reject';
}

export interface TemporalRoot {
  rootHash: string;
  timestamp: number;
  branchHashes: string[];
  mergedState: any;
}

