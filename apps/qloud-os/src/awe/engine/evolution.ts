/**
 * Evolution Model
 * 
 * Mutation, selection, speciation
 */

import type { Species, EvolutionConfig } from '../types';

export class EvolutionModel {
  private config: EvolutionConfig;
  
  constructor(config: EvolutionConfig) {
    this.config = config;
  }
  
  /**
   * Run evolution cycle
   */
  runCycle(species: Map<string, Species>): Species[] {
    const newSpecies: Species[] = [];
    
    // Update fitness for all species
    for (const speciesData of species.values()) {
      // Fitness already updated by BioModel
    }
    
    // Natural selection - remove low fitness species
    const speciesArray = Array.from(species.values());
    for (const speciesItem of speciesArray) {
      if (speciesItem.fitness < this.config.extinctionThreshold && speciesItem.population === 0) {
        species.delete(speciesItem.id);
      }
    }
    
    // Speciation - create new species from high fitness ones
    for (const speciesData of speciesArray) {
      if (speciesData.fitness > this.config.speciationThreshold && Math.random() < 0.1) {
        const newSpeciesData = this.speciate(speciesData);
        if (newSpeciesData) {
          newSpecies.push(newSpeciesData);
        }
      }
    }
    
    // Mutation - mutate existing species traits
    for (const speciesData of species.values()) {
      if (Math.random() < this.config.mutationRate) {
        this.mutateSpecies(speciesData);
      }
    }
    
    return newSpecies;
  }
  
  /**
   * Speciate - create new species from parent
   */
  private speciate(parent: Species): Species | null {
    const newSpecies: Species = {
      id: `species_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `${parent.name} variant`,
      traits: { ...parent.traits },
      genome: [...parent.genome],
      population: 0,
      fitness: 0,
      createdAt: Date.now(),
      parentSpeciesId: parent.id,
    };
    
    // Apply mutations to new species
    for (const key in newSpecies.traits) {
      if (Math.random() < 0.5) {
        newSpecies.traits[key] += (Math.random() - 0.5) * 0.2;
      }
    }
    
    return newSpecies;
  }
  
  /**
   * Mutate species
   */
  private mutateSpecies(species: Species): void {
    // Mutate traits
    for (const key in species.traits) {
      if (Math.random() < 0.3) {
        species.traits[key] += (Math.random() - 0.5) * 0.1;
      }
    }
    
    // Mutate genome
    if (species.genome.length > 0 && Math.random() < 0.2) {
      const index = Math.floor(Math.random() * species.genome.length);
      species.genome[index] = Math.random().toString(36).substr(2, 8);
    }
  }
  
  /**
   * Get evolution tree (lineage)
   */
  getEvolutionTree(species: Map<string, Species>): Map<string, string[]> {
    const tree = new Map<string, string[]>();
    
    for (const speciesData of species.values()) {
      const lineage: string[] = [];
      let current: Species | undefined = speciesData;
      
      while (current) {
        lineage.unshift(current.id);
        if (current.parentSpeciesId) {
          current = species.get(current.parentSpeciesId);
        } else {
          break;
        }
      }
      
      tree.set(speciesData.id, lineage);
    }
    
    return tree;
  }
}

