/**
 * Vector Store
 * 
 * Distributed vector database for neural mesh
 */

import { dvfs } from '../vfs/dvfs';
import { generateEmbedding, cosineSimilarity } from './embeddings';
import type { NeuralVector, NeuralQuery, NeuralSearchResult } from './neuralTypes';

class VectorStore {
  private vectors: Map<string, NeuralVector> = new Map();
  private initialized = false;
  
  /**
   * Initialize vector store
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    // Load vectors from DVFS
    try {
      const files = await dvfs.list('neural', 'index');
      for (const file of files) {
        if (file.type === 'file' && file.data) {
          const content = typeof file.data === 'string' ? file.data : new TextDecoder().decode(file.data);
          const vector: NeuralVector = JSON.parse(content);
          this.vectors.set(vector.id, vector);
        }
      }
    } catch (error) {
      console.error('Failed to load vectors:', error);
    }
    
    this.initialized = true;
  }
  
  /**
   * Add vector to store
   */
  async addVector(vector: NeuralVector): Promise<void> {
    this.vectors.set(vector.id, vector);
    
    // Persist to DVFS
    const path = `/grid/neural/index/${vector.metadata.peerId}/${vector.metadata.chunkId}.vec`;
    await dvfs.write('neural', vector.metadata.peerId, `${vector.metadata.chunkId}.vec`, JSON.stringify(vector));
  }
  
  /**
   * Search vectors by similarity
   */
  async search(query: NeuralQuery): Promise<NeuralSearchResult[]> {
    await this.initialize();
    
    const queryEmbedding = await generateEmbedding(query.query);
    const results: NeuralSearchResult[] = [];
    
    for (const vector of this.vectors.values()) {
      // Apply filters
      if (query.filters) {
        if (query.filters.peerId && vector.metadata.peerId !== query.filters.peerId) continue;
        if (query.filters.source && vector.metadata.source !== query.filters.source) continue;
        if (query.filters.tags && !query.filters.tags.some(tag => vector.metadata.tags.includes(tag))) continue;
      }
      
      // Calculate similarity
      const similarity = cosineSimilarity(queryEmbedding, vector.embedding);
      
      // Apply threshold
      if (query.threshold && similarity < query.threshold) continue;
      
      results.push({ vector, similarity });
    }
    
    // Sort by similarity (descending)
    results.sort((a, b) => b.similarity - a.similarity);
    
    // Apply limit
    return results.slice(0, query.limit || 10);
  }
  
  /**
   * Get vector by ID
   */
  getVector(id: string): NeuralVector | undefined {
    return this.vectors.get(id);
  }
  
  /**
   * Get all vectors
   */
  getAllVectors(): NeuralVector[] {
    return Array.from(this.vectors.values());
  }
  
  /**
   * Get vectors by peer
   */
  getVectorsByPeer(peerId: string): NeuralVector[] {
    return Array.from(this.vectors.values()).filter(v => v.metadata.peerId === peerId);
  }
  
  /**
   * Delete vector
   */
  async deleteVector(id: string): Promise<void> {
    const vector = this.vectors.get(id);
    if (!vector) return;
    
    this.vectors.delete(id);
    await dvfs.delete('neural', vector.metadata.peerId, `${vector.metadata.chunkId}.vec`);
  }
}

// Singleton instance
export const vectorStore = new VectorStore();

// Auto-initialize
if (typeof window !== 'undefined') {
  vectorStore.initialize();
}

