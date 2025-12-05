/**
 * Compute Meter
 * 
 * Meters LLM + WASM cycles for compute mining
 */

interface ComputeCycle {
  id: string;
  type: 'llm' | 'wasm' | 'zk' | 'vector' | 'spirit';
  cycles: number;
  timestamp: number;
  peerId: string;
  verified: boolean;
}

class ComputeMeter {
  private cycles: ComputeCycle[] = [];
  private totalCycles = 0;
  
  /**
   * Record compute cycles
   */
  recordCycles(
    type: ComputeCycle['type'],
    cycles: number,
    peerId: string,
    verified: boolean = false
  ): string {
    const cycleId = `cycle:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
    
    const cycle: ComputeCycle = {
      id: cycleId,
      type,
      cycles,
      timestamp: Date.now(),
      peerId,
      verified,
    };
    
    this.cycles.push(cycle);
    this.totalCycles += cycles;
    
    return cycleId;
  }
  
  /**
   * Get total cycles
   */
  getTotalCycles(): number {
    return this.totalCycles;
  }
  
  /**
   * Get cycles by type
   */
  getCyclesByType(type: ComputeCycle['type']): number {
    return this.cycles
      .filter(c => c.type === type)
      .reduce((sum, c) => sum + c.cycles, 0);
  }
  
  /**
   * Get verified cycles
   */
  getVerifiedCycles(): number {
    return this.cycles
      .filter(c => c.verified)
      .reduce((sum, c) => sum + c.cycles, 0);
  }
  
  /**
   * Get cycles for time period
   */
  getCyclesInPeriod(startTime: number, endTime: number): ComputeCycle[] {
    return this.cycles.filter(c => c.timestamp >= startTime && c.timestamp <= endTime);
  }
  
  /**
   * Clear old cycles (older than 24 hours)
   */
  clearOldCycles(): void {
    const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
    this.cycles = this.cycles.filter(c => c.timestamp > dayAgo);
    this.totalCycles = this.cycles.reduce((sum, c) => sum + c.cycles, 0);
  }
}

// Singleton instance
export const computeMeter = new ComputeMeter();

// Auto-cleanup old cycles
if (typeof window !== 'undefined') {
  setInterval(() => {
    computeMeter.clearOldCycles();
  }, 60 * 60 * 1000); // Every hour
}

