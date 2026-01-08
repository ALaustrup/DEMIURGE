/**
 * Temporal Influence
 * 
 * Adjusts kernel decisions based on predicted outcomes
 */

import { retroHeuristics } from './retroHeuristics';
import { coreHeuristics } from '../kernel/coreHeuristics';
import { futurePredictor } from './futurePredictor';

class TemporalInfluence {
  /**
   * Apply temporal influence to kernel decision
   */
  async influenceDecision(originalDecision: any): Promise<any> {
    // Apply retrocausal influence
    const retroDecision = await retroHeuristics.applyRetroInfluence(originalDecision);
    
    // Check future predictions
    const futureGridLoad = await futurePredictor.predictGridLoad(3600000);
    
    // Modify decision if future conditions are unfavorable
    if (futureGridLoad.load > 0.8 && originalDecision.action === 'expand') {
      return {
        ...retroDecision,
        action: 'optimize',
        priority: retroDecision.priority * 0.8,
        reasoning: `${retroDecision.reasoning} (Temporal: Future grid load ${(futureGridLoad.load * 100).toFixed(0)}% predicted)`,
      };
    }
    
    return retroDecision;
  }
  
  /**
   * Get temporal influence strength
   */
  getInfluenceStrength(): number {
    return retroHeuristics.getRetroWeight();
  }
}

// Singleton instance
export const temporalInfluence = new TemporalInfluence();

