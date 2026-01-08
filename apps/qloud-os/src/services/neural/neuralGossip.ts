/**
 * Neural Gossip Protocol
 * 
 * Gossip-based replication for neural mesh
 */

import { vectorStore } from './vectorStore';
import { peerDiscovery } from '../grid/discovery';
import type { NeuralVector } from './neuralTypes';

class NeuralGossip {
  private gossipInterval: ReturnType<typeof setInterval> | null = null;
  private isRunning = false;
  
  /**
   * Start gossip protocol
   */
  start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    
    // Gossip every 30 seconds
    this.gossipInterval = setInterval(() => {
      this.gossip();
    }, 30000);
    
    // Initial gossip
    this.gossip();
  }
  
  /**
   * Stop gossip protocol
   */
  stop(): void {
    if (this.gossipInterval) {
      clearInterval(this.gossipInterval);
      this.gossipInterval = null;
    }
    this.isRunning = false;
  }
  
  /**
   * Gossip vectors to peers
   */
  private async gossip(): Promise<void> {
    const peers = peerDiscovery.getPeers();
    if (peers.length === 0) return;
    
    // Get local vectors
    const localVectors = vectorStore.getAllVectors();
    if (localVectors.length === 0) return;
    
    // Select random peer to gossip with
    const randomPeer = peers[Math.floor(Math.random() * peers.length)];
    
    // Send sample of vectors (in production, use proper gossip protocol)
    const sampleSize = Math.min(10, localVectors.length);
    const sample = localVectors.slice(0, sampleSize);
    
    // In production, send via grid protocol
    console.log(`[NeuralGossip] Gossiping ${sample.length} vectors to ${randomPeer.peerId}`);
  }
  
  /**
   * Receive vectors from peer
   */
  async receiveVectors(peerId: string, vectors: NeuralVector[]): Promise<void> {
    for (const vector of vectors) {
      // Check if we already have this vector
      const existing = vectorStore.getVector(vector.id);
      if (!existing) {
        // Add new vector
        await vectorStore.addVector(vector);
      } else if (vector.metadata.timestamp > existing.metadata.timestamp) {
        // Update if newer
        await vectorStore.addVector(vector);
      }
    }
  }
}

// Singleton instance
export const neuralGossip = new NeuralGossip();

// Auto-start on module load
if (typeof window !== 'undefined') {
  neuralGossip.start();
}

