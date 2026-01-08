/**
 * Evolutionary Environment
 * 
 * Environmental pressure sources for spirit evolution
 */

import { spiritManager } from '../spirits/spiritManager';
import { computeMeter } from '../mining/computeMeter';
import type { SpiritGenome } from './genome';

export interface EnvironmentalPressure {
  computeScarcity: number; // 0-1, higher = more pressure
  competition: number; // 0-1, number of competing spirits
  resourceDemand: number; // 0-1, demand for spirit services
  gridLoad: number; // 0-1, grid utilization
}

/**
 * Get current environmental pressure
 */
export function getEnvironmentalPressure(): EnvironmentalPressure {
  const spirits = spiritManager.getAllSpirits();
  const totalCycles = computeMeter.getTotalCycles();
  const activeSpirits = spirits.filter(s => s.status === 'active').length;
  
  // Compute scarcity (inverse of available cycles)
  const computeScarcity = Math.min(1, 1 - (totalCycles / 10000));
  
  // Competition (based on active spirits)
  const competition = Math.min(1, activeSpirits / 10);
  
  // Resource demand (based on running tasks)
  const runningTasks = spirits.reduce((sum, s) => sum + s.tasks.filter(t => t.status === 'running').length, 0);
  const resourceDemand = Math.min(1, runningTasks / 20);
  
  // Grid load (placeholder)
  const gridLoad = 0.5;
  
  return {
    computeScarcity,
    competition,
    resourceDemand,
    gridLoad,
  };
}

/**
 * Apply environmental pressure to genome
 */
export function applyEnvironmentalPressure(genome: SpiritGenome, pressure: EnvironmentalPressure): SpiritGenome {
  const mutated = { ...genome };
  
  // High competition -> increase efficiency
  if (pressure.competition > 0.7) {
    mutated.computeBudget = Math.max(50, mutated.computeBudget - 10);
  }
  
  // High demand -> increase capacity
  if (pressure.resourceDemand > 0.7) {
    mutated.memoryCapacity = Math.min(5000, mutated.memoryCapacity + 100);
  }
  
  // Compute scarcity -> optimize
  if (pressure.computeScarcity > 0.7) {
    mutated.maxTokens = Math.max(1000, mutated.maxTokens - 200);
  }
  
  return mutated;
}

