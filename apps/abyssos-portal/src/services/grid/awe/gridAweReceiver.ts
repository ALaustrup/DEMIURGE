/**
 * Grid AWE Receiver
 * 
 * Receives and processes AWE messages from peers
 */

import { gridAweScheduler } from './gridAweScheduler';
import type { GridMessage } from '../types';
import type { AWEStateSync, AWEStateDelta, AWEComputeRequest } from './gridAweTypes';

class GridAWEReceiver {
  private stateSyncListeners: Set<(sync: AWEStateSync) => void> = new Set();
  private stateDeltaListeners: Set<(delta: AWEStateDelta) => void> = new Set();
  
  /**
   * Initialize receiver
   */
  init(): void {
    // In production, would register with grid protocol message router
    console.log('[GridAWE] Receiver initialized');
  }
  
  /**
   * Handle incoming grid message
   */
  handleMessage(message: GridMessage): void {
    switch (message.type) {
      case 'AWE_STATE_SYNC':
        this.handleStateSync(message.payload as AWEStateSync);
        break;
        
      case 'AWE_STATE_DELTA':
        this.handleStateDelta(message.payload as AWEStateDelta);
        break;
        
      case 'AWE_COMPUTE_RESPONSE':
        gridAweScheduler.handleResponse(message.payload as any);
        break;
        
      case 'AWE_REQUEST_COMPUTE':
        this.handleComputeRequest(message as any);
        break;
    }
  }
  
  /**
   * Handle state sync
   */
  private handleStateSync(sync: AWEStateSync): void {
    this.stateSyncListeners.forEach(listener => {
      try {
        listener(sync);
      } catch (error) {
        console.error('[GridAWE] State sync listener error:', error);
      }
    });
  }
  
  /**
   * Handle state delta
   */
  private handleStateDelta(delta: AWEStateDelta): void {
    this.stateDeltaListeners.forEach(listener => {
      try {
        listener(delta);
      } catch (error) {
        console.error('[GridAWE] State delta listener error:', error);
      }
    });
  }
  
  /**
   * Handle compute request
   */
  private async handleComputeRequest(message: GridMessage & { payload: AWEComputeRequest }): Promise<void> {
    // In production, would execute simulation step and send response
    // For now, just acknowledge
    console.log('[GridAWE] Received compute request:', message.payload);
  }
  
  /**
   * Subscribe to state sync
   */
  onStateSync(callback: (sync: AWEStateSync) => void): () => void {
    this.stateSyncListeners.add(callback);
    return () => this.stateSyncListeners.delete(callback);
  }
  
  /**
   * Subscribe to state delta
   */
  onStateDelta(callback: (delta: AWEStateDelta) => void): () => void {
    this.stateDeltaListeners.add(callback);
    return () => this.stateDeltaListeners.delete(callback);
  }
}

// Singleton instance
export const gridAweReceiver = new GridAWEReceiver();

// Auto-initialize
if (typeof window !== 'undefined') {
  gridAweReceiver.init();
}

