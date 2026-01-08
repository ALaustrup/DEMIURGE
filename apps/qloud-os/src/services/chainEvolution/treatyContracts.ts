/**
 * Treaty Contracts
 * 
 * Governance contracts allowing chain federation
 */

import type { TreatyContract } from './chainEvolutionTypes';

class TreatyContractManager {
  private treaties: Map<string, TreatyContract> = new Map();
  
  /**
   * Create treaty
   */
  createTreaty(
    chainIds: string[],
    terms: string,
    expiresAt?: number
  ): TreatyContract {
    const treaty: TreatyContract = {
      id: `treaty:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`,
      chainIds,
      terms,
      consensus: 0.5, // Would be calculated from chain agreement
      createdAt: Date.now(),
      expiresAt,
    };
    
    this.treaties.set(treaty.id, treaty);
    
    return treaty;
  }
  
  /**
   * Get treaty
   */
  getTreaty(treatyId: string): TreatyContract | undefined {
    return this.treaties.get(treatyId);
  }
  
  /**
   * Get all treaties
   */
  getAllTreaties(): TreatyContract[] {
    return Array.from(this.treaties.values());
  }
  
  /**
   * Get treaties for chain
   */
  getTreatiesForChain(chainId: string): TreatyContract[] {
    return Array.from(this.treaties.values())
      .filter(t => t.chainIds.includes(chainId));
  }
  
  /**
   * Update consensus
   */
  updateConsensus(treatyId: string, consensus: number): void {
    const treaty = this.treaties.get(treatyId);
    if (treaty) {
      treaty.consensus = Math.max(0, Math.min(1, consensus));
    }
  }
  
  /**
   * Check if treaty is active
   */
  isTreatyActive(treatyId: string): boolean {
    const treaty = this.treaties.get(treatyId);
    if (!treaty) return false;
    
    if (treaty.expiresAt && treaty.expiresAt < Date.now()) {
      return false;
    }
    
    return treaty.consensus > 0.5;
  }
}

// Singleton instance
export const treatyContractManager = new TreatyContractManager();

