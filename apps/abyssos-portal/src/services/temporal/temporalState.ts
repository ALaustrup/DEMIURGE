/**
 * Temporal State
 * 
 * Stores past, present, predicted, and counterfactual states
 */

import type { TemporalState, TimeSlice, TemporalEvent } from './temporalTypes';

class TemporalStateManager {
  private state: TemporalState;
  private maxPastSlices = 100;
  private maxFutureSlices = 50;
  
  constructor() {
    this.state = {
      past: [],
      now: this.createTimeSlice(Date.now()),
      future: [],
      branches: [],
    };
  }
  
  /**
   * Create time slice
   */
  createTimeSlice(timestamp: number, state?: any): TimeSlice {
    return {
      id: `slice:${timestamp}:${Math.random().toString(36).substr(2, 9)}`,
      timestamp,
      state: state || {},
      events: [],
      embeddings: [],
    };
  }
  
  /**
   * Record current state
   */
  recordNow(state: any): void {
    // Move current to past
    this.state.past.push(this.state.now);
    
    // Keep only last N past slices
    if (this.state.past.length > this.maxPastSlices) {
      this.state.past.shift();
    }
    
    // Create new "now"
    this.state.now = this.createTimeSlice(Date.now(), state);
  }
  
  /**
   * Add predicted future slice
   */
  addFutureSlice(slice: TimeSlice): void {
    this.state.future.push(slice);
    
    // Keep only last N future slices
    if (this.state.future.length > this.maxFutureSlices) {
      this.state.future.shift();
    }
  }
  
  /**
   * Add counterfactual branch
   */
  addBranch(branch: TimeSlice[]): void {
    this.state.branches.push(branch);
    
    // Keep only last 10 branches
    if (this.state.branches.length > 10) {
      this.state.branches.shift();
    }
  }
  
  /**
   * Get temporal state
   */
  getState(): TemporalState {
    return { ...this.state };
  }
  
  /**
   * Get past slice by timestamp
   */
  getPastSlice(timestamp: number): TimeSlice | undefined {
    return this.state.past.find(s => s.timestamp === timestamp);
  }
  
  /**
   * Get future slice by timestamp
   */
  getFutureSlice(timestamp: number): TimeSlice | undefined {
    return this.state.future.find(s => s.timestamp === timestamp);
  }
  
  /**
   * Replay from past slice
   */
  replayFrom(sliceId: string): TimeSlice[] {
    const slice = [...this.state.past, this.state.now].find(s => s.id === sliceId);
    if (!slice) return [];
    
    // Return all slices after this one
    const index = this.state.past.findIndex(s => s.id === sliceId);
    if (index === -1) return [this.state.now];
    
    return [...this.state.past.slice(index + 1), this.state.now];
  }
}

// Singleton instance
export const temporalStateManager = new TemporalStateManager();

