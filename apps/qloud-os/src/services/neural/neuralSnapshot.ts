/**
 * Neural Snapshot
 * 
 * Merkle-protected neural state snapshots
 */

import { vectorStore } from './vectorStore';
import type { NeuralSnapshot } from './neuralTypes';
import { getLocalPeerId } from '../grid/peer';

/**
 * Generate Merkle root from vector IDs
 */
function merkleRoot(items: string[]): string {
  if (items.length === 0) return '0';
  if (items.length === 1) return items[0];
  
  let level = items;
  while (level.length > 1) {
    const nextLevel: string[] = [];
    for (let i = 0; i < level.length; i += 2) {
      const left = level[i];
      const right = i + 1 < level.length ? level[i + 1] : left;
      nextLevel.push(hashPair(left, right));
    }
    level = nextLevel;
  }
  
  return level[0];
}

/**
 * Hash pair
 */
function hashPair(a: string, b: string): string {
  const combined = a + b;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
}

/**
 * Create neural snapshot
 */
export async function createNeuralSnapshot(): Promise<NeuralSnapshot> {
  const vectors = vectorStore.getAllVectors();
  const vectorIds = vectors.map(v => v.id);
  const rootHash = merkleRoot(vectorIds);
  
  return {
    rootHash,
    timestamp: Date.now(),
    peerId: getLocalPeerId(),
    vectorCount: vectors.length,
    merkleTree: JSON.stringify(buildMerkleTree(vectorIds)),
  };
}

/**
 * Build Merkle tree structure
 */
function buildMerkleTree(items: string[]): any {
  if (items.length === 0) return null;
  if (items.length === 1) return { value: items[0], left: null, right: null };
  
  const mid = Math.floor(items.length / 2);
  const left = buildMerkleTree(items.slice(0, mid));
  const right = buildMerkleTree(items.slice(mid));
  const value = hashPair(
    left ? (left.value || '') : '',
    right ? (right.value || '') : ''
  );
  
  return { value, left, right };
}

/**
 * Verify snapshot
 */
export function verifySnapshot(snapshot: NeuralSnapshot, vectors: string[]): boolean {
  const rootHash = merkleRoot(vectors);
  return rootHash === snapshot.rootHash;
}

