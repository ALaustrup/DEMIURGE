/**
 * Trait Inheritance
 * 
 * Determine which kernel traits, heuristics, and spirit behaviors carry forward
 */

import type { CloneTraits } from './reproductionTypes';
import { coreHeuristics } from '../kernel/coreHeuristics';
import { spiritManager } from '../spirits/spiritManager';

/**
 * Inherit traits from parent
 */
export function inheritTraits(parentTraits: CloneTraits, mutationRate: number = 0.1): CloneTraits {
  const inherited: CloneTraits = {
    kernelHeuristics: [...parentTraits.kernelHeuristics],
    spiritBehaviors: [...parentTraits.spiritBehaviors],
    computeFocus: parentTraits.computeFocus,
    mutationRate: parentTraits.mutationRate,
    stabilityThreshold: parentTraits.stabilityThreshold,
    growthAggressiveness: parentTraits.growthAggressiveness,
  };
  
  // Apply mutations
  if (Math.random() < mutationRate) {
    // Mutate compute focus
    const focuses: CloneTraits['computeFocus'][] = ['general', 'memory', 'logic', 'mining', 'inference'];
    inherited.computeFocus = focuses[Math.floor(Math.random() * focuses.length)];
  }
  
  if (Math.random() < mutationRate) {
    inherited.mutationRate = Math.max(0, Math.min(1, inherited.mutationRate + (Math.random() - 0.5) * 0.1));
  }
  
  return inherited;
}

/**
 * Extract current system traits
 */
export async function extractSystemTraits(): Promise<CloneTraits> {
  const decision = await coreHeuristics.decideEvolutionPath();
  const spirits = spiritManager.getAllSpirits();
  
  return {
    kernelHeuristics: [decision.action],
    spiritBehaviors: spirits.map(s => s.personality.traits.join(',')),
    computeFocus: 'general', // Would be determined by system state
    mutationRate: 0.1,
    stabilityThreshold: 0.7,
    growthAggressiveness: 0.5,
  };
}

