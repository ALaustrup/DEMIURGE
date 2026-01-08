/**
 * Shared Intent
 * 
 * Unified goals formulated across the swarm
 */

import type { SharedIntent } from './swarmMindTypes';
import { peerDiscovery } from '../grid/discovery';
import { getLocalPeerId } from '../grid/peer';

class SharedIntentManager {
  private intents: Map<string, SharedIntent> = new Map();
  
  /**
   * Propose shared intent
   */
  proposeIntent(goal: string, priority: number): SharedIntent {
    const peers = peerDiscovery.getPeers();
    const instanceIds = [getLocalPeerId(), ...peers.map(p => p.peerId)];
    
    const intent: SharedIntent = {
      id: `intent:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`,
      goal,
      priority,
      consensus: 0.5, // Would be calculated from peer agreement
      instanceIds,
      createdAt: Date.now(),
    };
    
    this.intents.set(intent.id, intent);
    
    return intent;
  }
  
  /**
   * Get shared intents
   */
  getSharedIntents(): SharedIntent[] {
    return Array.from(this.intents.values())
      .sort((a, b) => b.priority - a.priority);
  }
  
  /**
   * Update consensus for intent
   */
  updateConsensus(intentId: string, consensus: number): void {
    const intent = this.intents.get(intentId);
    if (intent) {
      intent.consensus = Math.max(0, Math.min(1, consensus));
    }
  }
}

// Singleton instance
export const sharedIntentManager = new SharedIntentManager();

