/**
 * Neural Mesh Types
 * 
 * Types for the Global Neural Mesh (GNM)
 */

export interface NeuralVector {
  id: string;
  embedding: number[]; // Vector embedding
  content: string; // Original content
  metadata: {
    peerId: string;
    chunkId: string;
    timestamp: number;
    source: 'spirit' | 'file' | 'chain' | 'user' | 'receipt';
    tags: string[];
  };
  merkleHash?: string; // Merkle proof of vector
}

export interface NeuralChunk {
  id: string;
  peerId: string;
  content: string;
  embedding: number[];
  timestamp: number;
  source: string;
  tags: string[];
}

export interface NeuralSnapshot {
  rootHash: string;
  timestamp: number;
  peerId: string;
  vectorCount: number;
  merkleTree: string; // Merkle tree structure
}

export interface NeuralQuery {
  query: string;
  limit?: number;
  threshold?: number; // Similarity threshold (0-1)
  filters?: {
    peerId?: string;
    source?: string;
    tags?: string[];
  };
}

export interface NeuralSearchResult {
  vector: NeuralVector;
  similarity: number; // Cosine similarity (0-1)
}

