/**
 * Grid AWE Dispatcher
 * 
 * Dispatches AWE state sync and delta messages
 */

import { peerDiscovery } from '../discovery';
import { getLocalPeerId } from '../peer';
import type { AWEStateSync, AWEStateDelta } from './gridAweTypes';

class GridAWEDispatcher {
  /**
   * Broadcast state sync
   */
  broadcastStateSync(sync: AWEStateSync): void {
    const peers = peerDiscovery.getPeers();
    
    for (const peer of peers) {
      if (peer.peerId !== getLocalPeerId()) {
        peerDiscovery.sendMessage(peer.peerId, {
          type: 'AWE_STATE_SYNC',
          from: getLocalPeerId(),
          to: peer.peerId,
          payload: sync,
          timestamp: Date.now(),
        });
      }
    }
  }
  
  /**
   * Broadcast state delta
   */
  broadcastStateDelta(delta: AWEStateDelta): void {
    const peers = peerDiscovery.getPeers();
    
    for (const peer of peers) {
      if (peer.peerId !== getLocalPeerId()) {
        peerDiscovery.sendMessage(peer.peerId, {
          type: 'AWE_STATE_DELTA',
          from: getLocalPeerId(),
          to: peer.peerId,
          payload: delta,
          timestamp: Date.now(),
        });
      }
    }
  }
}

// Singleton instance
export const gridAweDispatcher = new GridAWEDispatcher();

