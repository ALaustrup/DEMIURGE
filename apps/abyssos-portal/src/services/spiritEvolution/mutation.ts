/**
 * Evolutionary Mutation
 * 
 * Mutation operations for spirit evolution
 */

import type { SpiritGenome } from './genome';

export interface Mutation {
  type: 'trait' | 'goal' | 'parameter' | 'capacity';
  target: string;
  value: any;
}

/**
 * Apply random mutation to genome
 */
export function mutateGenome(genome: SpiritGenome): SpiritGenome {
  const mutated = { ...genome };
  const mutationType = Math.random();
  
  if (mutationType < 0.25) {
    // Mutate traits
    if (mutated.traits.length > 0 && Math.random() < 0.5) {
      // Remove random trait
      const index = Math.floor(Math.random() * mutated.traits.length);
      mutated.traits = mutated.traits.filter((_, i) => i !== index);
    } else {
      // Add new trait
      const newTraits = ['curious', 'analytical', 'creative', 'efficient', 'adaptive'];
      const available = newTraits.filter(t => !mutated.traits.includes(t));
      if (available.length > 0) {
        mutated.traits.push(available[Math.floor(Math.random() * available.length)]);
      }
    }
  } else if (mutationType < 0.5) {
    // Mutate temperature
    mutated.temperature = Math.max(0, Math.min(1, mutated.temperature + (Math.random() - 0.5) * 0.2));
  } else if (mutationType < 0.75) {
    // Mutate memory capacity
    mutated.memoryCapacity = Math.max(100, mutated.memoryCapacity + Math.floor((Math.random() - 0.5) * 200));
  } else {
    // Mutate mutation rate
    mutated.mutationRate = Math.max(0, Math.min(1, mutated.mutationRate + (Math.random() - 0.5) * 0.1));
  }
  
  return mutated;
}

/**
 * Apply targeted mutation
 */
export function applyTargetedMutation(genome: SpiritGenome, mutation: Mutation): SpiritGenome {
  const mutated = { ...genome };
  
  switch (mutation.type) {
    case 'trait':
      if (!mutated.traits.includes(mutation.value)) {
        mutated.traits.push(mutation.value);
      }
      break;
    case 'goal':
      if (!mutated.goals.includes(mutation.value)) {
        mutated.goals.push(mutation.value);
      }
      break;
    case 'parameter':
      if (mutation.target === 'temperature') {
        mutated.temperature = Math.max(0, Math.min(1, mutation.value));
      } else if (mutation.target === 'maxTokens') {
        mutated.maxTokens = Math.max(100, mutation.value);
      }
      break;
    case 'capacity':
      if (mutation.target === 'memory') {
        mutated.memoryCapacity = Math.max(100, mutation.value);
      }
      break;
  }
  
  return mutated;
}

