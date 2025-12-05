/**
 * Temporal Types
 * 
 * Types for temporal memory and time-based reasoning
 */

export interface TimeSlice {
  id: string;
  timestamp: number;
  state: any; // System state at this time
  events: TemporalEvent[];
  embeddings: number[]; // Compressed representation
}

export interface TemporalEvent {
  id: string;
  type: string;
  data: any;
  timestamp: number;
  causes: string[]; // IDs of events that caused this
  effects: string[]; // IDs of events caused by this
}

export interface TemporalState {
  past: TimeSlice[];
  now: TimeSlice;
  future: TimeSlice[];
  branches: TimeSlice[][]; // Counterfactual branches
}

export interface CausalLink {
  from: string; // Event ID
  to: string; // Event ID
  strength: number; // 0-1, causal strength
  timestamp: number;
}

export interface TemporalRoot {
  rootHash: string;
  timestamp: number;
  pastHash: string;
  futureHash: string;
  branchHashes: string[];
}

