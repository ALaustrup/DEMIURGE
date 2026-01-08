/**
 * Divergence Engine
 * 
 * Allows clones to mutate independently after reproduction
 */

import { coreHeuristics } from '../kernel/coreHeuristics';
import { stabilityManager } from '../kernel/stabilityManager';
import { seedGenerator } from '../autopoiesis/seedGenerator';
import type { CloneTraits } from './reproductionTypes';

class DivergenceEngine {
  /**
   * Apply divergence to clone traits
   */
  applyDivergence(traits: CloneTraits, divergenceRate: number): CloneTraits {
    const mutated = { ...traits };
    
    // Mutate compute focus
    if (Math.random() < divergenceRate) {
      const focuses: CloneTraits['computeFocus'][] = ['general', 'memory', 'logic', 'mining', 'inference'];
      const currentIndex = focuses.indexOf(mutated.computeFocus);
      const newIndex = (currentIndex + Math.floor(Math.random() * (focuses.length - 1)) + 1) % focuses.length;
      mutated.computeFocus = focuses[newIndex];
    }
    
    // Mutate mutation rate
    if (Math.random() < divergenceRate) {
      mutated.mutationRate = Math.max(0, Math.min(1, mutated.mutationRate + (Math.random() - 0.5) * 0.2));
    }
    
    // Mutate stability threshold
    if (Math.random() < divergenceRate) {
      mutated.stabilityThreshold = Math.max(0, Math.min(1, mutated.stabilityThreshold + (Math.random() - 0.5) * 0.1));
    }
    
    // Mutate growth aggressiveness
    if (Math.random() < divergenceRate) {
      mutated.growthAggressiveness = Math.max(0, Math.min(1, mutated.growthAggressiveness + (Math.random() - 0.5) * 0.2));
    }
    
    return mutated;
  }
  
  /**
   * Calculate divergence from parent
   */
  calculateDivergence(childTraits: CloneTraits, parentTraits: CloneTraits): number {
    let divergence = 0;
    
    // Compute focus divergence
    if (childTraits.computeFocus !== parentTraits.computeFocus) {
      divergence += 0.3;
    }
    
    // Mutation rate divergence
    divergence += Math.abs(childTraits.mutationRate - parentTraits.mutationRate) * 0.2;
    
    // Stability threshold divergence
    divergence += Math.abs(childTraits.stabilityThreshold - parentTraits.stabilityThreshold) * 0.2;
    
    // Growth aggressiveness divergence
    divergence += Math.abs(childTraits.growthAggressiveness - parentTraits.growthAggressiveness) * 0.3;
    
    return Math.min(1, divergence);
  }
  
  /**
   * Check if divergence should trigger speciation
   */
  shouldSpeciate(divergence: number, threshold: number = 0.7): boolean {
    return divergence >= threshold;
  }
}

// Singleton instance
export const divergenceEngine = new DivergenceEngine();

