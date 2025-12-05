/**
 * Hivemind Sync
 * 
 * Synchronizes cognitive fabric between instances
 */

import { vectorStore } from '../neural/vectorStore';
import { neuralGossip } from '../neural/neuralGossip';
import { getCognitionState } from '../cogfabrik/cognitionState';
import { peerDiscovery } from '../grid/discovery';

class HivemindSync {
  private syncInterval: ReturnType<typeof setInterval> | null = null;
  private isRunning = false;
  
  /**
   * Start hivemind sync
   */
  start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    
    // Sync every 30 seconds
    this.syncInterval = setInterval(() => {
      this.sync();
    }, 30000);
    
    // Initial sync
    this.sync();
  }
  
  /**
   * Stop hivemind sync
   */
  stop(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    this.isRunning = false;
  }
  
  /**
   * Sync cognitive fabric with peers
   */
  private async sync(): Promise<void> {
    const peers = peerDiscovery.getPeers();
    if (peers.length === 0) return;
    
    // Get local cognition state
    const cognitionState = await getCognitionState();
    
    // Get local vectors
    const localVectors = vectorStore.getAllVectors();
    
    // In production, would sync with peers via grid protocol
    console.log(`[HivemindSync] Syncing with ${peers.length} peers`);
    console.log(`[HivemindSync] Local vectors: ${localVectors.length}`);
    console.log(`[HivemindSync] Cognition state:`, cognitionState);
  }
  
  /**
   * Receive sync from peer
   */
  async receiveSync(peerId: string, data: {
    vectors: any[];
    cognitionState: any;
  }): Promise<void> {
    // Merge vectors
    for (const vector of data.vectors) {
      await vectorStore.addVector(vector);
    }
    
    // Merge cognition state (in production, would merge more intelligently)
    console.log(`[HivemindSync] Received sync from ${peerId}`);
  }
}

// Singleton instance
export const hivemindSync = new HivemindSync();

// Auto-start on module load
if (typeof window !== 'undefined') {
  hivemindSync.start();
}

