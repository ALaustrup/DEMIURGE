/**
 * Grid Peer Identity and Heartbeat
 */

function randomUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
import type { GridPeer, PeerAnnouncement } from './types';
import { getLocalCapabilities } from '../qorvm/executor';

let localPeerId: string | null = null;

/**
 * Get or generate local peer ID
 */
export function getLocalPeerId(): string {
  if (localPeerId) return localPeerId;
  
  // Try to load from localStorage
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('abyssos_grid_peer_id');
    if (stored) {
      localPeerId = stored;
      return localPeerId;
    }
  }
  
  // Generate new peer ID
  localPeerId = `peer:${randomUUID()}`;
  
  // Store in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('abyssos_grid_peer_id', localPeerId);
  }
  
  return localPeerId;
}

/**
 * Get local peer announcement
 */
export function getLocalPeerAnnouncement(): PeerAnnouncement {
  const capabilities = getLocalCapabilities();
  
  return {
    peerId: getLocalPeerId(),
    version: '1.0.0',
    computeScore: capabilities.computeScore,
    freeMemory: capabilities.freeMemory,
    supportedFeatures: capabilities.supportedFeatures,
    timestamp: Date.now(),
  };
}

/**
 * Create peer object from announcement
 */
export function createPeerFromAnnouncement(announcement: PeerAnnouncement): GridPeer {
  return {
    peerId: announcement.peerId,
    version: announcement.version,
    computeScore: announcement.computeScore,
    freeMemory: announcement.freeMemory,
    supportedFeatures: announcement.supportedFeatures,
    lastSeen: announcement.timestamp,
    connectionStatus: 'connected',
  };
}

