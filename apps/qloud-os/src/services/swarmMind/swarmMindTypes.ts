/**
 * SwarmMind Types
 * 
 * Types for collective cognition
 */

export interface SwarmThought {
  id: string;
  instanceIds: string[]; // Instances that contributed
  content: string;
  confidence: number; // 0-1
  timestamp: number;
  embeddings: number[];
}

export interface SharedIntent {
  id: string;
  goal: string;
  priority: number; // 0-100
  consensus: number; // 0-1, how many instances agree
  instanceIds: string[];
  createdAt: number;
}

export interface CollectiveInference {
  id: string;
  query: string;
  result: string;
  contributors: string[];
  confidence: number;
  timestamp: number;
}

