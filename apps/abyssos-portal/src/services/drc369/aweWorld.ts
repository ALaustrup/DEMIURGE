/**
 * DRC-369 AWE World Helpers
 */

import { abyssIdSDK } from '../abyssid/sdk';
import { exportToDRC369, exportWorldSnapshot } from '../../awe/io/exporters';
import { importFromDRC369 } from '../../awe/io/importers';
import type { DRC369 } from './schema';
import type { WorldState } from '../../awe/types';

/**
 * Publish world snapshot as DRC-369 asset
 */
export async function publishWorldSnapshot(
  state: WorldState,
  owner?: string
): Promise<{ assetId: string; txHash: string }> {
  return await exportToDRC369(state, owner);
}

/**
 * Load world from DRC-369 asset
 */
export async function loadWorldFromDRC369(assetId: string): Promise<WorldState | null> {
  return await importFromDRC369(assetId);
}

/**
 * Check if DRC-369 asset is an AWE world
 */
export function isAWEWorld(asset: DRC369): boolean {
  return asset.contentType === 'awe-world';
}

/**
 * Extract world metadata from DRC-369 asset
 */
export function extractWorldMetadata(asset: DRC369): {
  seed: string;
  rulesetHash: string;
  physicsProfile: any;
  speciesCount: number;
  totalTicks: number;
  exportTime: number;
  snapshotMerkleRoot: string;
} | null {
  if (!isAWEWorld(asset)) {
    return null;
  }
  
  const attrs = asset.attributes as any;
  if (!attrs || !attrs.snapshot) {
    return null;
  }
  
  return attrs.snapshot;
}

