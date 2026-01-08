/**
 * Core Heuristics
 * 
 * Decision heuristics for evolution
 */

import { seedGenerator } from '../autopoiesis/seedGenerator';
import { getCognitionState } from '../cogfabrik/cognitionState';
import { getMiningStats } from '../mining/rewardEngine';

export interface EvolutionDecision {
  action: 'expand' | 'optimize' | 'stabilize' | 'explore' | 'consolidate';
  priority: number; // 0-100
  reasoning: string;
}

class CoreHeuristics {
  /**
   * Decide evolution path
   */
  async decideEvolutionPath(): Promise<EvolutionDecision> {
    const cognitionState = await getCognitionState();
    const miningStats = getMiningStats();
    
    // High cognitive load -> optimize
    if (cognitionState.runningTasks > 15) {
      return {
        action: 'optimize',
        priority: 80,
        reasoning: 'High task load detected, prioritize optimization',
      };
    }
    
    // Low mining rewards -> explore new features
    if (miningStats.totalReward < 0.1) {
      return {
        action: 'explore',
        priority: 70,
        reasoning: 'Low mining activity, explore new compute opportunities',
      };
    }
    
    // High vector count -> consolidate knowledge
    if (cognitionState.vectorCount > 1000) {
      return {
        action: 'consolidate',
        priority: 60,
        reasoning: 'Large knowledge base, consolidate and optimize',
      };
    }
    
    // Default: expand capabilities
    return {
      action: 'expand',
      priority: 50,
      reasoning: 'Stable state, expand system capabilities',
    };
  }
  
  /**
   * Evaluate seed priority
   */
  evaluateSeedPriority(seed: any): number {
    // Higher priority for:
    // - High source priority (neural > spirit > grid)
    // - Low complexity (easier to implement)
    // - Few dependencies (less risk)
    
    const sourcePriority = {
      neural: 90,
      spirit: 70,
      grid: 60,
      user: 80,
      kernel: 100,
    }[seed.source] || 50;
    
    const complexityPenalty = seed.estimatedComplexity;
    const dependencyPenalty = seed.dependencies.length * 5;
    
    return Math.max(0, Math.min(100, sourcePriority - complexityPenalty - dependencyPenalty));
  }
}

// Singleton instance
export const coreHeuristics = new CoreHeuristics();

