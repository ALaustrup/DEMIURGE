/**
 * Temporal Traits
 * 
 * Spirits develop future-prediction traits
 */

import type { SpiritGenome } from '../spiritEvolution/genome';

export interface TemporalTrait {
  name: string;
  predictionAccuracy: number; // 0-1
  timeHorizon: number; // milliseconds
  confidence: number; // 0-1
}

/**
 * Add temporal trait to spirit
 */
export function addTemporalTrait(genome: SpiritGenome, trait: TemporalTrait): SpiritGenome {
  return {
    ...genome,
    traits: [...genome.traits, `temporal:${trait.name}`],
  };
}

/**
 * Get temporal traits from genome
 */
export function getTemporalTraits(genome: SpiritGenome): TemporalTrait[] {
  const temporalTraitNames = genome.traits.filter(t => t.startsWith('temporal:'));
  
  return temporalTraitNames.map(name => ({
    name: name.replace('temporal:', ''),
    predictionAccuracy: 0.5,
    timeHorizon: 3600000, // 1 hour default
    confidence: 0.6,
  }));
}

