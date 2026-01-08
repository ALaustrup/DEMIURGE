/**
 * AWE VM Hooks
 * 
 * VM hooks for simulation control
 */

import type { WorldEngine } from '../engine/worldEngine';

let currentEngine: WorldEngine | null = null;

/**
 * Set current world engine
 */
export function setCurrentEngine(engine: WorldEngine | null): void {
  currentEngine = engine;
}

/**
 * Get current world engine
 */
export function getCurrentEngine(): WorldEngine | null {
  return currentEngine;
}

/**
 * VM hook: Get world state
 */
export async function vmGetWorldState(): Promise<any> {
  if (!currentEngine) {
    throw new Error('No world engine active');
  }
  
  return currentEngine.getState();
}

/**
 * VM hook: Set world state (partial)
 */
export async function vmSetWorldState(partial: any): Promise<boolean> {
  if (!currentEngine) {
    return false;
  }
  
  try {
    currentEngine.setState(partial);
    return true;
  } catch {
    return false;
  }
}

/**
 * VM hook: Spawn entity
 */
export async function vmSpawnEntity(position: any, mass?: number, properties?: any): Promise<string | null> {
  if (!currentEngine) {
    return null;
  }
  
  try {
    return currentEngine.spawnEntity(position, mass, properties);
  } catch {
    return null;
  }
}

/**
 * VM hook: Apply force
 */
export async function vmApplyForce(entityId: string, force: any): Promise<boolean> {
  if (!currentEngine) {
    return false;
  }
  
  try {
    currentEngine.applyForce(entityId, force);
    return true;
  } catch {
    return false;
  }
}

/**
 * VM hook: Run evolution cycle
 */
export async function vmRunEvolutionCycle(): Promise<boolean> {
  if (!currentEngine) {
    return false;
  }
  
  try {
    currentEngine.runEvolutionCycle();
    return true;
  } catch {
    return false;
  }
}

/**
 * VM hook: Export world
 */
export async function vmExportWorld(): Promise<string | null> {
  if (!currentEngine) {
    return null;
  }
  
  try {
    const { exportToJSON } = await import('../io/exporters');
    return exportToJSON(currentEngine.getState());
  } catch {
    return null;
  }
}

