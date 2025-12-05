/**
 * Branch Evaluator
 * 
 * Scores branches based on desired outcomes
 */

import type { TimelineBranch, BranchEvaluation } from './multiverseTypes';

class BranchEvaluator {
  /**
   * Evaluate branch
   */
  evaluateBranch(
    branch: TimelineBranch,
    goals: {
      stability?: number; // Desired stability (0-1)
      efficiency?: number; // Desired efficiency (0-1)
      goalAlignment?: number; // Desired goal alignment (0-1)
    } = {}
  ): BranchEvaluation {
    // Calculate metrics
    const stability = this.calculateStability(branch);
    const efficiency = this.calculateEfficiency(branch);
    const goalAlignment = this.calculateGoalAlignment(branch, goals);
    
    // Overall score (weighted average)
    const score = (
      stability * 0.4 +
      efficiency * 0.3 +
      goalAlignment * 0.3
    ) * 100;
    
    // Determine recommendation
    let recommendation: BranchEvaluation['recommendation'];
    if (score >= 80) {
      recommendation = 'optimal';
    } else if (score >= 50) {
      recommendation = 'acceptable';
    } else {
      recommendation = 'reject';
    }
    
    return {
      branchId: branch.id,
      score,
      metrics: {
        stability,
        efficiency,
        goalAlignment,
      },
      recommendation,
    };
  }
  
  /**
   * Calculate stability metric
   */
  private calculateStability(branch: TimelineBranch): number {
    // Stability based on execution path length and state consistency
    const pathLength = branch.executionPath.length;
    const stability = Math.max(0, 1 - (pathLength / 100));
    return stability;
  }
  
  /**
   * Calculate efficiency metric
   */
  private calculateEfficiency(branch: TimelineBranch): number {
    // Efficiency based on depth vs execution path length
    if (branch.depth === 0) return 0.5;
    const efficiency = Math.min(1, branch.executionPath.length / branch.depth);
    return efficiency;
  }
  
  /**
   * Calculate goal alignment
   */
  private calculateGoalAlignment(
    branch: TimelineBranch,
    goals: any
  ): number {
    // Simplified: check if branch state aligns with goals
    return 0.7; // Placeholder
  }
  
  /**
   * Find optimal branch
   */
  findOptimalBranch(
    branches: TimelineBranch[],
    goals?: any
  ): TimelineBranch | null {
    if (branches.length === 0) return null;
    
    const evaluations = branches.map(b => this.evaluateBranch(b, goals));
    const optimal = evaluations
      .filter(e => e.recommendation === 'optimal')
      .sort((a, b) => b.score - a.score)[0];
    
    if (optimal) {
      return branches.find(b => b.id === optimal.branchId) || null;
    }
    
    // Fallback to highest scoring acceptable branch
    const acceptable = evaluations
      .filter(e => e.recommendation === 'acceptable')
      .sort((a, b) => b.score - a.score)[0];
    
    if (acceptable) {
      return branches.find(b => b.id === acceptable.branchId) || null;
    }
    
    return null;
  }
}

// Singleton instance
export const branchEvaluator = new BranchEvaluator();

