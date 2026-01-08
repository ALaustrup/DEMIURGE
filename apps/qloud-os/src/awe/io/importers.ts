/**
 * World Importers
 * 
 * Load worlds from JSON, DVFS, DRC-369
 */

import type { WorldState, Entity, Species, EntityID, SpeciesID } from '../types';
import { StateManager } from '../engine/stateManager';

const stateManager = new StateManager();

/**
 * Import world from JSON
 */
export function importFromJSON(json: string): WorldState {
  const data = JSON.parse(json);
  
  // Reconstruct Maps from arrays with proper typing
  const entities = new Map<EntityID, Entity>((data.entities || []) as [EntityID, Entity][]);
  const species = new Map<SpeciesID, Species>((data.species || []) as [SpeciesID, Species][]);
  
  return {
    id: data.id,
    seed: data.seed,
    tick: data.tick || 0,
    entities,
    species,
    rules: data.rules || [],
    physics: data.physics || {
      gravity: 9.8,
      friction: 0.1,
      collisionEnabled: true,
      bounds: { width: 100, height: 100, depth: 100 },
    },
    bio: data.bio || {
      metabolismRate: 0.1,
      replicationThreshold: 50,
      mutationRate: 0.01,
      energyDecay: 1,
      maxAge: 1000,
    },
    society: data.society || {
      tradeEnabled: true,
      treatyEnabled: true,
      socialGraphEnabled: true,
      currencyEnabled: false,
    },
    evolution: data.evolution || {
      selectionPressure: 0.5,
      mutationRate: 0.01,
      speciationThreshold: 10,
      extinctionThreshold: 0.1,
    },
    timestamp: data.timestamp || Date.now(),
    merkleRoot: data.merkleRoot,
  };
}

/**
 * Import world from DVFS
 */
export async function importFromDVFS(path: string): Promise<WorldState> {
  const { fs } = await import('../../services/vfs');
  const node = await fs.read(path);
  if (!node || node.type !== 'file' || !node.data) {
    throw new Error(`World not found: ${path}`);
  }
  const json = typeof node.data === 'string' ? node.data : new TextDecoder().decode(node.data);
  return importFromJSON(json);
}

/**
 * Import world from DRC-369 asset
 */
export async function importFromDRC369(assetId: string): Promise<WorldState | null> {
  const { abyssIdSDK } = await import('../../services/qorid/sdk');
  
  try {
    const owned = await abyssIdSDK.drc369.getOwned({});
    const asset = owned.find(a => a.id === assetId);
    
    if (!asset || asset.contentType !== 'awe-world') {
      return null;
    }
    
    const attributes = asset.attributes as any;
    if (!attributes || !attributes.worldData) {
      return null;
    }
    
    return importFromJSON(attributes.worldData);
  } catch (error) {
    console.error('[AWE] Failed to import from DRC-369:', error);
    return null;
  }
}

/**
 * Create world from seed
 */
export function createWorldFromSeed(seed: string, config?: Partial<WorldState>): WorldState {
  return stateManager.createWorld(seed, config);
}

