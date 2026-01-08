/**
 * Time Anchors
 * 
 * Spirits store memory linked to future events
 */

import type { AbyssSpirit } from '../spiritTypes';

export interface TimeAnchor {
  id: string;
  spiritId: string;
  futureTimestamp: number;
  memory: string;
  linkedEvent: string;
  createdAt: number;
}

class TimeAnchorManager {
  private anchors: Map<string, TimeAnchor[]> = new Map(); // spiritId -> anchors[]
  
  /**
   * Create time anchor
   */
  createAnchor(
    spiritId: string,
    futureTimestamp: number,
    memory: string,
    linkedEvent: string
  ): TimeAnchor {
    const anchor: TimeAnchor = {
      id: `anchor:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`,
      spiritId,
      futureTimestamp,
      memory,
      linkedEvent,
      createdAt: Date.now(),
    };
    
    if (!this.anchors.has(spiritId)) {
      this.anchors.set(spiritId, []);
    }
    
    this.anchors.get(spiritId)!.push(anchor);
    
    return anchor;
  }
  
  /**
   * Get anchors for spirit
   */
  getAnchors(spiritId: string): TimeAnchor[] {
    return this.anchors.get(spiritId) || [];
  }
  
  /**
   * Get anchors for future timestamp
   */
  getAnchorsForFuture(spiritId: string, timestamp: number, tolerance: number = 3600000): TimeAnchor[] {
    const anchors = this.getAnchors(spiritId);
    return anchors.filter(a => 
      Math.abs(a.futureTimestamp - timestamp) <= tolerance
    );
  }
  
  /**
   * Check if anchor has been reached
   */
  checkAnchors(spiritId: string, currentTimestamp: number): TimeAnchor[] {
    const anchors = this.getAnchors(spiritId);
    return anchors.filter(a => a.futureTimestamp <= currentTimestamp);
  }
}

// Singleton instance
export const timeAnchorManager = new TimeAnchorManager();

