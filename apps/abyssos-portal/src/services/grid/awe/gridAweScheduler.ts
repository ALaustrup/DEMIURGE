/**
 * Grid AWE Scheduler
 * 
 * Schedules distributed simulation steps across grid peers
 */

import { peerDiscovery } from '../discovery';
import { getLocalPeerId } from '../peer';
import type { AWEComputeRequest, AWEComputeResponse } from './gridAweTypes';

class GridAWEScheduler {
  private pendingRequests: Map<string, {
    resolve: (response: AWEComputeResponse) => void;
    reject: (error: Error) => void;
    timeout: ReturnType<typeof setTimeout>;
  }> = new Map();
  
  /**
   * Request compute from grid
   */
  async requestCompute(request: AWEComputeRequest): Promise<AWEComputeResponse> {
    return new Promise((resolve, reject) => {
      const peers = peerDiscovery.getPeers();
      
      if (peers.length === 0) {
        reject(new Error('No peers available for AWE compute'));
        return;
      }
      
      // Store pending request
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(request.requestId);
        reject(new Error('AWE compute timeout'));
      }, 30000); // 30 second timeout
      
      this.pendingRequests.set(request.requestId, {
        resolve,
        reject,
        timeout,
      });
      
      // Send to best peer (highest compute score)
      const bestPeer = peers
        .filter(p => p.peerId !== getLocalPeerId())
        .sort((a, b) => b.computeScore - a.computeScore)[0];
      
      if (bestPeer) {
        peerDiscovery.sendMessage(bestPeer.peerId, {
          type: 'AWE_REQUEST_COMPUTE',
          from: getLocalPeerId(),
          to: bestPeer.peerId,
          payload: request,
          timestamp: Date.now(),
        });
      } else {
        clearTimeout(timeout);
        this.pendingRequests.delete(request.requestId);
        reject(new Error('No suitable peer found'));
      }
    });
  }
  
  /**
   * Handle compute response
   */
  handleResponse(response: AWEComputeResponse): void {
    const pending = this.pendingRequests.get(response.requestId);
    if (pending) {
      clearTimeout(pending.timeout);
      this.pendingRequests.delete(response.requestId);
      pending.resolve(response);
    }
  }
}

// Singleton instance
export const gridAweScheduler = new GridAWEScheduler();

