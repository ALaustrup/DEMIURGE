/**
 * Cognition State
 * 
 * Global cognitive state for Demiurge
 */

import { vectorStore } from '../neural/vectorStore';
import { spiritCoordinator } from './spiritCoordinator';
import { chainPredictor } from './chainPredictor';

export interface CognitionState {
  vectorCount: number;
  activeSpirits: number;
  runningTasks: number;
  totalCycles: number;
  lastUpdate: number;
}

/**
 * Get current cognition state
 */
export async function getCognitionState(): Promise<CognitionState> {
  const vectors = vectorStore.getAllVectors();
  const coordination = spiritCoordinator.getCoordinationStatus();
  
  return {
    vectorCount: vectors.length,
    activeSpirits: coordination.activeSpirits,
    runningTasks: coordination.runningTasks,
    totalCycles: 0, // Placeholder - would come from computeMeter
    lastUpdate: Date.now(),
  };
}

