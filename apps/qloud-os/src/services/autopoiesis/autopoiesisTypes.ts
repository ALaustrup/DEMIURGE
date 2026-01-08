/**
 * Autopoiesis Types
 * 
 * Types for self-generating and self-rewriting systems
 */

export interface ModuleSeed {
  id: string;
  name: string;
  spec: string; // Functional specification
  source: 'neural' | 'spirit' | 'grid' | 'user' | 'kernel';
  priority: number; // 0-100
  estimatedComplexity: number;
  dependencies: string[];
}

export interface ModuleMutation {
  id: string;
  moduleId: string;
  type: 'rewrite' | 'optimize' | 'extend' | 'refactor';
  changes: string; // Description of changes
  code: string; // New/modified code
  invariants: string[]; // Must preserve these
  timestamp: number;
}

export interface FitnessScore {
  performance: number; // 0-100
  stability: number; // 0-100
  efficiency: number; // 0-100
  userSatisfaction: number; // 0-100
  overall: number; // Weighted average
}

export interface SystemSnapshot {
  id: string;
  timestamp: number;
  modules: Map<string, string>; // moduleId -> code hash
  state: any; // System state at snapshot
  merkleRoot: string;
}

