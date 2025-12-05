/**
 * Stability Manager
 * 
 * Prevents runaway behaviors and ensures system stability
 */

import { rollbackManager } from '../autopoiesis/rollbackManager';
import { fitnessEvaluator } from '../autopoiesis/fitnessEvaluator';

class StabilityManager {
  private mutationCount = 0;
  private lastMutationTime = 0;
  private errorCount = 0;
  private lastErrorTime = 0;
  
  /**
   * Check if mutation is safe
   */
  async isMutationSafe(): Promise<{ safe: boolean; reason?: string }> {
    // Rate limiting: max 1 mutation per minute
    const timeSinceLastMutation = Date.now() - this.lastMutationTime;
    if (timeSinceLastMutation < 60000 && this.mutationCount > 0) {
      return {
        safe: false,
        reason: 'Mutation rate limit: too soon after last mutation',
      };
    }
    
    // Error rate limiting: if errors in last 5 minutes, slow down
    const timeSinceLastError = Date.now() - this.lastErrorTime;
    if (this.errorCount > 3 && timeSinceLastError < 300000) {
      return {
        safe: false,
        reason: 'High error rate detected, mutation paused for stability',
      };
    }
    
    // Check if we have a recent snapshot for rollback
    const latestSnapshot = rollbackManager.getLatestSnapshot();
    if (!latestSnapshot) {
      return {
        safe: false,
        reason: 'No snapshot available for rollback',
      };
    }
    
    return { safe: true };
  }
  
  /**
   * Record mutation
   */
  recordMutation(): void {
    this.mutationCount++;
    this.lastMutationTime = Date.now();
  }
  
  /**
   * Record error
   */
  recordError(): void {
    this.errorCount++;
    this.lastErrorTime = Date.now();
  }
  
  /**
   * Reset counters (called after successful period)
   */
  resetCounters(): void {
    this.mutationCount = 0;
    this.errorCount = 0;
  }
  
  /**
   * Get stability metrics
   */
  getStabilityMetrics(): {
    mutationRate: number;
    errorRate: number;
    isStable: boolean;
  } {
    const timeWindow = 3600000; // 1 hour
    const mutationsPerHour = (this.mutationCount / timeWindow) * 3600000;
    const errorsPerHour = (this.errorCount / timeWindow) * 3600000;
    
    return {
      mutationRate: mutationsPerHour,
      errorRate: errorsPerHour,
      isStable: mutationsPerHour < 10 && errorsPerHour < 5,
    };
  }
}

// Singleton instance
export const stabilityManager = new StabilityManager();

