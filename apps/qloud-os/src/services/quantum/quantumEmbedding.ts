/**
 * Quantum Embedding
 * 
 * Embeds logical states into weighted superpositions
 */

import { generateEmbedding } from '../neural/embeddings';
import type { ProbabilityField } from './quantumTypes';

class QuantumEmbedding {
  /**
   * Embed decision into quantum state
   */
  async embedDecision(decision: string, context: string): Promise<ProbabilityField> {
    // Generate semantic embedding
    const embedding = await generateEmbedding(decision + ' ' + context);
    
    // Calculate amplitude from embedding magnitude
    const magnitude = Math.sqrt(embedding.reduce((sum, v) => sum + v * v, 0));
    const amplitude = Math.min(1, magnitude / Math.sqrt(embedding.length));
    
    // Calculate phase from embedding direction
    const phase = Math.atan2(embedding[1] || 0, embedding[0] || 0);
    
    return {
      decision,
      amplitude,
      phase: phase < 0 ? phase + 2 * Math.PI : phase,
    };
  }
  
  /**
   * Embed multiple decisions
   */
  async embedDecisions(decisions: string[], context: string): Promise<ProbabilityField[]> {
    const promises = decisions.map(d => this.embedDecision(d, context));
    return Promise.all(promises);
  }
  
  /**
   * Measure quantum state
   */
  measureState(fields: ProbabilityField[]): string {
    // Use probabilistic router to collapse state
    return probabilisticRouter.routeDecision(fields);
  }
}

// Singleton instance
export const quantumEmbedding = new QuantumEmbedding();

