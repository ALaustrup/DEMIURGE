/**
 * Spirit Breeding
 * 
 * Merge genomes to create new spirits
 */

import type { SpiritGenome } from './genome';

/**
 * Breed two spirits
 */
export function breedSpirits(parent1: SpiritGenome, parent2: SpiritGenome): SpiritGenome {
  // Combine traits (union)
  const combinedTraits = [...new Set([...parent1.traits, ...parent2.traits])];
  
  // Combine goals (union)
  const combinedGoals = [...new Set([...parent1.goals, ...parent2.goals])];
  
  // Average parameters
  const temperature = (parent1.temperature + parent2.temperature) / 2;
  const maxTokens = Math.floor((parent1.maxTokens + parent2.maxTokens) / 2);
  const memoryCapacity = Math.floor((parent1.memoryCapacity + parent2.memoryCapacity) / 2);
  
  // Average fitness
  const fitness = (parent1.fitness + parent2.fitness) / 2;
  
  // New generation
  const generation = Math.max(parent1.generation, parent2.generation) + 1;
  
  return {
    id: `genome:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`,
    traits: combinedTraits,
    goals: combinedGoals,
    constraints: [...new Set([...parent1.constraints, ...parent2.constraints])],
    temperature,
    maxTokens,
    memoryCapacity,
    computeBudget: Math.max(parent1.computeBudget, parent2.computeBudget),
    mutationRate: (parent1.mutationRate + parent2.mutationRate) / 2,
    fitness,
    generation,
    parentIds: [parent1.id, parent2.id],
  };
}

/**
 * Check if two spirits can breed
 */
export function canBreed(spirit1: SpiritGenome, spirit2: SpiritGenome): boolean {
  // Must have different IDs
  if (spirit1.id === spirit2.id) return false;
  
  // Must have minimum fitness
  if (spirit1.fitness < 30 || spirit2.fitness < 30) return false;
  
  // Must not be too closely related (same generation and same parents)
  if (spirit1.generation === spirit2.generation) {
    const commonParents = spirit1.parentIds.filter(id => spirit2.parentIds.includes(id));
    if (commonParents.length > 0) return false;
  }
  
  return true;
}

