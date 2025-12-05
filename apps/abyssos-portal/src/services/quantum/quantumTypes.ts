/**
 * Quantum Types
 * 
 * Types for probabilistic and quantum-like reasoning
 */

export interface ProbabilityField {
  decision: string;
  amplitude: number; // Complex amplitude (simplified to real number)
  phase: number; // 0-2π
}

export interface InterferencePattern {
  decisions: string[];
  type: 'constructive' | 'destructive';
  strength: number; // 0-1
}

export interface QuantumState {
  superpositions: ProbabilityField[];
  collapsed: string | null; // Collapsed decision
  measurement: number; // Measurement result
}

