/**
 * Retro Reinforcement
 * 
 * Reward spirits for accurate predictions
 */

import { spiritManager } from '../spiritManager';
import { futurePredictor } from '../../retrocausality/futurePredictor';
import type { AbyssSpirit } from '../spiritTypes';

class RetroReinforcement {
  private predictions: Map<string, {
    prediction: any;
    timestamp: number;
    actual?: any;
  }> = new Map();
  
  /**
   * Record prediction
   */
  recordPrediction(spiritId: string, prediction: any): void {
    this.predictions.set(spiritId, {
      prediction,
      timestamp: Date.now(),
    });
  }
  
  /**
   * Verify prediction and reward
   */
  async verifyPrediction(spiritId: string, actual: any): Promise<{
    accurate: boolean;
    reward: number;
  }> {
    const record = this.predictions.get(spiritId);
    if (!record) {
      return { accurate: false, reward: 0 };
    }
    
    // Calculate accuracy (simplified)
    const accuracy = this.calculateAccuracy(record.prediction, actual);
    const accurate = accuracy > 0.7;
    
    // Reward based on accuracy
    const reward = accurate ? accuracy * 10 : 0;
    
    // Update spirit fitness if accurate
    if (accurate) {
      const spirit = spiritManager.getSpirit(spiritId);
      if (spirit) {
        // In production, would update fitness
        console.log(`[RetroReinforcement] Rewarding ${spiritId} for accurate prediction`);
      }
    }
    
    return { accurate, reward };
  }
  
  /**
   * Calculate prediction accuracy
   */
  private calculateAccuracy(prediction: any, actual: any): number {
    // Simplified accuracy calculation
    if (typeof prediction === 'number' && typeof actual === 'number') {
      const diff = Math.abs(prediction - actual);
      const max = Math.max(Math.abs(prediction), Math.abs(actual), 1);
      return Math.max(0, 1 - (diff / max));
    }
    
    // For objects, compare key values
    if (typeof prediction === 'object' && typeof actual === 'object') {
      const keys = new Set([...Object.keys(prediction), ...Object.keys(actual)]);
      let matches = 0;
      let total = 0;
      
      for (const key of keys) {
        if (prediction[key] === actual[key]) {
          matches++;
        }
        total++;
      }
      
      return total > 0 ? matches / total : 0;
    }
    
    return prediction === actual ? 1 : 0;
  }
}

// Singleton instance
export const retroReinforcement = new RetroReinforcement();

