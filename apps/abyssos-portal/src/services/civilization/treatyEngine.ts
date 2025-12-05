/**
 * Treaty Engine
 * 
 * Contract system for inter-instance agreements
 */

import { treatyContractManager } from '../chainEvolution/treatyContracts';
import type { TreatyContract } from '../chainEvolution/chainEvolutionTypes';

class TreatyEngine {
  /**
   * Propose treaty
   */
  proposeTreaty(
    instanceIds: string[],
    terms: string,
    expiresAt?: number
  ): TreatyContract {
    return treatyContractManager.createTreaty(instanceIds, terms, expiresAt);
  }
  
  /**
   * Accept treaty
   */
  acceptTreaty(treatyId: string, instanceId: string): boolean {
    const treaty = treatyContractManager.getTreaty(treatyId);
    if (!treaty) return false;
    
    if (!treaty.chainIds.includes(instanceId)) {
      return false;
    }
    
    // Update consensus (simplified)
    const currentConsensus = treaty.consensus;
    const newConsensus = Math.min(1, currentConsensus + 0.1);
    treatyContractManager.updateConsensus(treatyId, newConsensus);
    
    return true;
  }
  
  /**
   * Get active treaties
   */
  getActiveTreaties(): TreatyContract[] {
    return treatyContractManager.getAllTreaties()
      .filter(t => treatyContractManager.isTreatyActive(t.id));
  }
}

// Singleton instance
export const treatyEngine = new TreatyEngine();

