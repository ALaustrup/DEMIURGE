/**
 * Swarm Embeddings
 * 
 * Knowledge not stored locally, but as emergent collective vectors
 */

import { vectorStore } from '../neural/vectorStore';
import { generateEmbedding } from '../neural/embeddings';
import type { NeuralVector } from '../neural/neuralTypes';

class SwarmEmbeddings {
  /**
   * Create swarm embedding from multiple instances
   */
  async createSwarmEmbedding(
    content: string,
    contributorIds: string[]
  ): Promise<NeuralVector> {
    // Generate embedding
    const embedding = await generateEmbedding(content);
    
    // Create vector with swarm metadata
    const vector: NeuralVector = {
      id: `swarm:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`,
      embedding,
      content,
      metadata: {
        peerId: 'swarm',
        chunkId: `swarm:${contributorIds.join(',')}`,
        timestamp: Date.now(),
        source: 'spirit',
        tags: ['swarm', 'collective', ...contributorIds],
      },
    };
    
    await vectorStore.addVector(vector);
    
    return vector;
  }
  
  /**
   * Search swarm knowledge
   */
  async searchSwarmKnowledge(query: string): Promise<NeuralVector[]> {
    return vectorStore.search({
      query,
      limit: 10,
      threshold: 0.6,
      filters: {
        tags: ['swarm', 'collective'],
      },
    }).then(results => results.map(r => r.vector));
  }
}

// Singleton instance
export const swarmEmbeddings = new SwarmEmbeddings();

