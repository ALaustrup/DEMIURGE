/**
 * Reproduction Types
 * 
 * Types for self-cloning and reproduction
 */

export interface DemiurgeClone {
  id: string;
  parentId: string;
  generation: number;
  lineage: string; // Lineage identifier
  traits: CloneTraits;
  genesisSeed: string; // Serialized system state
  createdAt: number;
  divergence: number; // 0-1, how much it has diverged from parent
}

export interface CloneTraits {
  kernelHeuristics: string[]; // Inherited heuristics
  spiritBehaviors: string[]; // Inherited spirit behaviors
  computeFocus: 'general' | 'memory' | 'logic' | 'mining' | 'inference';
  mutationRate: number; // 0-1
  stabilityThreshold: number; // 0-1
  growthAggressiveness: number; // 0-1
}

export interface GenesisSeed {
  id: string;
  parentId: string;
  systemState: any; // Serialized system state
  kernelConfig: any;
  spiritTemplates: any[];
  neuralSnapshots: any[];
  timestamp: number;
  merkleRoot: string;
}

export interface HeritageRecord {
  instanceId: string;
  parentId: string | null;
  generation: number;
  lineage: string;
  divergence: number;
  traits: CloneTraits;
  createdAt: number;
  status: 'active' | 'extinct' | 'merged';
}

