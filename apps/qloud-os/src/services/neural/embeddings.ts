/**
 * Embeddings Service
 * 
 * Generates embeddings for neural mesh content
 */

import type { NeuralChunk, NeuralVector } from './neuralTypes';

/**
 * Generate embedding for text
 * 
 * In production, use actual embedding model (e.g., sentence-transformers)
 * For now, uses a simple hash-based embedding
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  // Simple hash-based embedding (in production, use actual model)
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hash));
  
  // Convert to 128-dimensional vector (normalized)
  const vector: number[] = [];
  for (let i = 0; i < 128; i++) {
    const idx = i % hashArray.length;
    vector.push((hashArray[idx] / 255) * 2 - 1); // Normalize to [-1, 1]
  }
  
  // Normalize vector
  const magnitude = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0));
  return vector.map(v => v / magnitude);
}

/**
 * Chunk text into smaller pieces
 */
export function chunkText(text: string, chunkSize: number = 500, overlap: number = 50): string[] {
  const chunks: string[] = [];
  let start = 0;
  
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    start = end - overlap;
  }
  
  return chunks;
}

/**
 * Create neural vector from chunk
 */
export async function createNeuralVector(
  chunk: NeuralChunk
): Promise<NeuralVector> {
  const embedding = await generateEmbedding(chunk.content);
  
  return {
    id: `vec:${chunk.peerId}:${chunk.id}`,
    embedding,
    content: chunk.content,
    metadata: {
      peerId: chunk.peerId,
      chunkId: chunk.id,
      timestamp: chunk.timestamp,
      source: chunk.source as any,
      tags: chunk.tags,
    },
  };
}

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have same length');
  }
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

