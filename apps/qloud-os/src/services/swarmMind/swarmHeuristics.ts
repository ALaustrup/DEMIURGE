/**
 * Swarm Heuristics
 * 
 * Decide when swarm or solo cognition is appropriate
 */

import { getCognitionState } from '../cogfabrik/cognitionState';
import { peerDiscovery } from '../grid/discovery';
import { collectiveInference } from './collectiveInference';
import { executeQuery } from '../cogfabrik/attentionRouter';

export type CognitionMode = 'solo' | 'swarm';

class SwarmHeuristics {
  /**
   * Decide cognition mode for query
   */
  async decideCognitionMode(query: string): Promise<CognitionMode> {
    const peers = peerDiscovery.getPeers();
    const cognitionState = await getCognitionState();
    
    // Use swarm if:
    // 1. Multiple peers available
    // 2. Query is complex (long or contains complex keywords)
    // 3. Local cognition load is high
    
    const isComplex = query.length > 100 || 
                      query.includes('analyze') || 
                      query.includes('predict') || 
                      query.includes('optimize');
    
    const isHighLoad = cognitionState.runningTasks > 10;
    
    if (peers.length > 0 && (isComplex || isHighLoad)) {
      return 'swarm';
    }
    
    return 'solo';
  }
  
  /**
   * Execute query with appropriate mode
   */
  async executeQuery(query: string): Promise<string> {
    const mode = await this.decideCognitionMode(query);
    
    if (mode === 'swarm') {
      const inference = await collectiveInference.infer(query);
      return inference.result;
    } else {
      return await executeQuery(query);
    }
  }
}

// Singleton instance
export const swarmHeuristics = new SwarmHeuristics();

