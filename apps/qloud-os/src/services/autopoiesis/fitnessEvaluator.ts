/**
 * Fitness Evaluator
 * 
 * Benchmarks mutated modules for performance and stability
 */

import type { FitnessScore } from './autopoiesisTypes';

class FitnessEvaluator {
  /**
   * Evaluate module fitness
   */
  async evaluateFitness(
    moduleId: string,
    code: string,
    executionTime: number,
    memoryUsage: number,
    errorCount: number,
    userFeedback?: number
  ): Promise<FitnessScore> {
    // Performance score (inverse of execution time and memory)
    const performance = Math.max(0, 100 - (executionTime / 10) - (memoryUsage / 1000));
    
    // Stability score (inverse of error count)
    const stability = Math.max(0, 100 - (errorCount * 10));
    
    // Efficiency score (code size vs functionality)
    const codeSize = code.length;
    const efficiency = Math.max(0, 100 - (codeSize / 1000));
    
    // User satisfaction (if provided)
    const userSatisfaction = userFeedback || 50;
    
    // Weighted overall score
    const overall = (
      performance * 0.3 +
      stability * 0.4 +
      efficiency * 0.2 +
      userSatisfaction * 0.1
    );
    
    return {
      performance,
      stability,
      efficiency,
      userSatisfaction,
      overall,
    };
  }
  
  /**
   * Compare two modules
   */
  compareFitness(a: FitnessScore, b: FitnessScore): number {
    return b.overall - a.overall; // Higher is better
  }
  
  /**
   * Check if fitness meets threshold
   */
  meetsThreshold(score: FitnessScore, threshold: number = 60): boolean {
    return score.overall >= threshold && score.stability >= 70;
  }
}

// Singleton instance
export const fitnessEvaluator = new FitnessEvaluator();

