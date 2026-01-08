/**
 * World Exporters
 * 
 * Export worlds to JSON, DVFS, DRC-369
 */

import type { WorldState } from '../types';
import { hashString } from '../utils';

/**
 * Export world to JSON
 */
export function exportToJSON(state: WorldState): string {
  const exportData = {
    id: state.id,
    seed: state.seed,
    tick: state.tick,
    entities: Array.from(state.entities.entries()),
    species: Array.from(state.species.entries()),
    rules: state.rules,
    physics: state.physics,
    bio: state.bio,
    society: state.society,
    evolution: state.evolution,
    timestamp: state.timestamp,
    merkleRoot: state.merkleRoot || hashString(JSON.stringify(state)),
  };
  
  return JSON.stringify(exportData, null, 2);
}

/**
 * Export world snapshot for DRC-369
 */
export function exportWorldSnapshot(state: WorldState): {
  seed: string;
  rulesetHash: string;
  physicsProfile: any;
  speciesCount: number;
  totalTicks: number;
  exportTime: number;
  snapshotMerkleRoot: string;
} {
  // Calculate ruleset hash
  const rulesetData = JSON.stringify(state.rules.map(r => ({ id: r.id, condition: r.condition, action: r.action })));
  const rulesetHash = hashString(rulesetData);
  
  return {
    seed: state.seed,
    rulesetHash,
    physicsProfile: state.physics,
    speciesCount: state.species.size,
    totalTicks: state.tick,
    exportTime: Date.now(),
    snapshotMerkleRoot: state.merkleRoot || hashString(JSON.stringify(state)),
  };
}

/**
 * Export to DVFS path
 */
export async function exportToDVFS(state: WorldState, path: string): Promise<void> {
  const { fs } = await import('../../services/vfs');
  const json = exportToJSON(state);
  await fs.write(path, json, { mime: 'application/json' });
}

/**
 * Export to DRC-369 asset
 */
export async function exportToDRC369(state: WorldState, owner?: string): Promise<{ assetId: string; txHash: string }> {
  const { abyssIdSDK } = await import('../../services/qorid/sdk');
  const snapshot = exportWorldSnapshot(state);
  const json = exportToJSON(state);
  
  // Store world data in attributes
  const asset = await abyssIdSDK.drc369.publishNative({
    uri: `awe://world/${state.id}`,
    contentType: 'awe-world',
    owner,
    name: `World: ${state.id}`,
    description: `AWE World - ${state.species.size} species, ${state.tick} ticks`,
    attributes: {
      worldId: state.id,
      seed: state.seed,
      tick: state.tick,
      snapshot: JSON.stringify(snapshot),
      worldData: json, // Full world state
    },
  });
  
  return {
    assetId: asset.id,
    txHash: asset.txHash || '',
  };
}

