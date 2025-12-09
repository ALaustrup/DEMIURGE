/**
 * AWE Utilities
 */

import type { WorldState, Vec3 } from './types';

/**
 * Calculate Merkle root of world state
 */
export function calculateWorldMerkleRoot(state: WorldState): string {
  // Simplified Merkle root calculation
  const data = JSON.stringify({
    tick: state.tick,
    entities: Array.from(state.entities.entries()).sort(([a], [b]) => a.localeCompare(b)),
    species: Array.from(state.species.entries()).sort(([a], [b]) => a.localeCompare(b)),
    rules: state.rules.map(r => r.id).sort(),
  });
  
  // In production, use proper Merkle tree
  // For now, use simple hash
  return hashString(data);
}

/**
 * Hash string to hex (synchronous version for utils)
 */
export function hashString(str: string): string {
  // Simplified synchronous hash
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

/**
 * Generate world seed
 */
export function generateWorldSeed(): string {
  return `world_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculate distance between two positions
 */
export function distance(a: Vec3, b: Vec3): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dz = b.z - a.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Normalize vector
 */
export function normalize(v: Vec3): Vec3 {
  const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  if (len === 0) return { x: 0, y: 0, z: 0 };
  return {
    x: v.x / len,
    y: v.y / len,
    z: v.z / len,
  };
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Random number in range
 */
export function randomRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Check if entity is within bounds
 */
export function isWithinBounds(position: Vec3, bounds: { width: number; height: number; depth: number }): boolean {
  return (
    position.x >= -bounds.width / 2 && position.x <= bounds.width / 2 &&
    position.y >= -bounds.height / 2 && position.y <= bounds.height / 2 &&
    position.z >= -bounds.depth / 2 && position.z <= bounds.depth / 2
  );
}

