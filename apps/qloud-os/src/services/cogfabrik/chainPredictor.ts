/**
 * Chain Predictor
 * 
 * Heuristics and predictions for chain behavior
 */

import { getChainInfo } from '../demiurgeChainClient';

interface ChainPrediction {
  nextBlockTime: number;
  estimatedHeight: number;
  transactionVolume: number;
  confidence: number;
}

class ChainPredictor {
  private history: { height: number; timestamp: number }[] = [];
  
  /**
   * Record block
   */
  recordBlock(height: number, timestamp: number): void {
    this.history.push({ height, timestamp });
    
    // Keep only last 100 blocks
    if (this.history.length > 100) {
      this.history.shift();
    }
  }
  
  /**
   * Predict next block time
   */
  predictNextBlockTime(): number {
    if (this.history.length < 2) {
      return Date.now() + 10000; // Default 10s
    }
    
    // Calculate average block time
    const intervals: number[] = [];
    for (let i = 1; i < this.history.length; i++) {
      intervals.push(this.history[i].timestamp - this.history[i - 1].timestamp);
    }
    
    const avgInterval = intervals.reduce((sum, t) => sum + t, 0) / intervals.length;
    return Date.now() + avgInterval;
  }
  
  /**
   * Predict chain state
   */
  async predictChainState(): Promise<ChainPrediction> {
    const chainInfo = await getChainInfo();
    const nextBlockTime = this.predictNextBlockTime();
    
    return {
      nextBlockTime,
      estimatedHeight: chainInfo.height + 1,
      transactionVolume: 0, // Placeholder
      confidence: 0.7,
    };
  }
}

// Singleton instance
export const chainPredictor = new ChainPredictor();

