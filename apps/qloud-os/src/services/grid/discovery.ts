/**
 * Peer Discovery Service
 * 
 * WebRTC + WebSocket signaling for peer discovery
 */

import type { GridPeer, PeerAnnouncement, GridMessage } from './types';

export type { GridPeer };
import { getLocalPeerAnnouncement, createPeerFromAnnouncement } from './peer';

class PeerDiscovery {
  private peers: Map<string, GridPeer> = new Map();
  private listeners: Set<(peers: GridPeer[]) => void> = new Set();
  private wsConnection: WebSocket | null = null;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  
  /**
   * Start peer discovery
   */
  start(_signalingServer?: string): void {
    // For now, use mock peer discovery
    // In production, connect to signaling server or use WebRTC
    
    // Simulate local peer
    const localAnnouncement = getLocalPeerAnnouncement();
    const localPeer = createPeerFromAnnouncement(localAnnouncement);
    this.peers.set(localPeer.peerId, localPeer);
    
    // Start heartbeat
    this.heartbeatInterval = setInterval(() => {
      this.broadcastAnnouncement();
    }, 5000);
    
    this.notifyListeners();
  }
  
  /**
   * Stop peer discovery
   */
  stop(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
    }
  }
  
  /**
   * Broadcast peer announcement
   */
  private broadcastAnnouncement(): void {
    const announcement = getLocalPeerAnnouncement();
    
    // In production, send via WebSocket/WebRTC
    // For now, just update local peer
    const peer = createPeerFromAnnouncement(announcement);
    this.peers.set(peer.peerId, peer);
    this.notifyListeners();
  }
  
  /**
   * Handle incoming announcement
   */
  handleAnnouncement(announcement: PeerAnnouncement): void {
    const peer = createPeerFromAnnouncement(announcement);
    this.peers.set(peer.peerId, peer);
    this.notifyListeners();
  }
  
  /**
   * Get all known peers
   */
  getPeers(): GridPeer[] {
    return Array.from(this.peers.values());
  }
  
  /**
   * Get peer by ID
   */
  getPeer(peerId: string): GridPeer | undefined {
    return this.peers.get(peerId);
  }
  
  /**
   * Subscribe to peer updates
   */
  onPeersUpdate(callback: (peers: GridPeer[]) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }
  
  /**
   * Notify all listeners
   */
  private notifyListeners(): void {
    const peers = this.getPeers();
    this.listeners.forEach(callback => {
      try {
        callback(peers);
      } catch (error) {
        console.error('Peer update listener error:', error);
      }
    });
  }
  
  /**
   * Send message to peer
   */
  sendMessage(peerId: string, message: GridMessage): void {
    // In production, send via WebSocket/WebRTC
    console.log(`[Grid] Sending message to ${peerId}:`, message);
  }
  
  /**
   * Broadcast message to all peers
   */
  broadcastMessage(message: GridMessage): void {
    this.peers.forEach(peer => {
      if (peer.peerId !== message.from) {
        this.sendMessage(peer.peerId, message);
      }
    });
  }
}

// Singleton instance
export const peerDiscovery = new PeerDiscovery();

// Auto-start on module load
if (typeof window !== 'undefined') {
  peerDiscovery.start();
}

