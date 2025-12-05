/**
 * Predictive Model
 * 
 * Chain + grid + cognitive forecasting
 */

import { getChainInfo } from '../demiurgeChainClient';
import { chainPredictor } from '../cogfabrik/chainPredictor';
import { getCognitionState } from '../cogfabrik/cognitionState';
import { peerDiscovery } from '../grid/discovery';

export interface Prediction {
  timeframe: 'short' | 'medium' | 'long';
  chainHeight?: number;
  gridLoad?: number;
  cognitiveLoad?: number;
  confidence: number; // 0-1
  timestamp: number;
}

class PredictiveModel {
  private history: Prediction[] = [];
  
  /**
   * Predict future state
   */
  async predict(timeframe: 'short' | 'medium' | 'long' = 'short'): Promise<Prediction> {
    const chainInfo = await getChainInfo();
    const cognitionState = await getCognitionState();
    const peers = peerDiscovery.getPeers();
    
    // Short-term: next 5 minutes
    // Medium-term: next hour
    // Long-term: next day
    const timeMultipliers = {
      short: 1,
      medium: 12,
      long: 288,
    };
    
    const multiplier = timeMultipliers[timeframe];
    
    // Predict chain height
    const chainHeight = chainInfo.height + (multiplier * 6); // ~6 blocks per 5 min
    
    // Predict grid load
    const currentLoad = peers.length / 10; // Normalize to 0-1
    const gridLoad = Math.min(1, currentLoad * (1 + multiplier * 0.1));
    
    // Predict cognitive load
    const cognitiveLoad = Math.min(1, (cognitionState.runningTasks / 20) * (1 + multiplier * 0.05));
    
    // Confidence decreases with timeframe
    const confidence = {
      short: 0.9,
      medium: 0.7,
      long: 0.5,
    }[timeframe];
    
    const prediction: Prediction = {
      timeframe,
      chainHeight,
      gridLoad,
      cognitiveLoad,
      confidence,
      timestamp: Date.now(),
    };
    
    this.history.push(prediction);
    
    // Keep only last 100 predictions
    if (this.history.length > 100) {
      this.history.shift();
    }
    
    return prediction;
  }
  
  /**
   * Get prediction history
   */
  getHistory(): Prediction[] {
    return [...this.history];
  }
}

// Singleton instance
export const predictiveModel = new PredictiveModel();

