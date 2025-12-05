/**
 * Spirit Genome
 * 
 * Represents a spirit's traits and parameters
 */

export interface SpiritGenome {
  id: string;
  traits: string[];
  goals: string[];
  constraints: string[];
  temperature: number; // 0-1
  maxTokens: number;
  memoryCapacity: number;
  computeBudget: number;
  mutationRate: number; // 0-1
  fitness: number; // 0-100
  generation: number;
  parentIds: string[]; // If bred from other spirits
}

/**
 * Create initial genome
 */
export function createGenome(
  traits: string[],
  goals: string[],
  constraints: string[] = []
): SpiritGenome {
  return {
    id: `genome:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`,
    traits,
    goals,
    constraints,
    temperature: 0.7,
    maxTokens: 2000,
    memoryCapacity: 1000,
    computeBudget: 100,
    mutationRate: 0.1,
    fitness: 50, // Initial fitness
    generation: 0,
    parentIds: [],
  };
}

/**
 * Clone genome
 */
export function cloneGenome(genome: SpiritGenome): SpiritGenome {
  return {
    ...genome,
    id: `genome:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`,
    parentIds: [genome.id],
  };
}

