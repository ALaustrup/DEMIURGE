/**
 * Biology Model
 * 
 * Cellular/agent growth, metabolism, replication
 */

import type { Entity, Species, BioConfig } from '../types';
import { randomRange } from '../utils';

export class BioModel {
  private config: BioConfig;
  
  constructor(config: BioConfig) {
    this.config = config;
  }
  
  /**
   * Update biological processes for all entities
   */
  update(entities: Map<string, Entity>, speciesMap: Map<string, Species>, delta: number): Entity[] {
    const newEntities: Entity[] = [];
    
    for (const entity of entities.values()) {
      // Age entity
      entity.age += delta;
      
      // Energy metabolism
      if (entity.energy !== undefined) {
        entity.energy -= this.config.energyDecay * delta;
        
        // Entity dies if energy depleted or too old
        if (entity.energy <= 0 || entity.age > this.config.maxAge) {
          entities.delete(entity.id);
          continue;
        }
      }
      
      // Replication check
      if (entity.speciesId && entity.energy !== undefined) {
        const entitySpecies = speciesMap.get(entity.speciesId);
        if (entitySpecies && entity.energy >= this.config.replicationThreshold) {
          const offspring = this.replicate(entity, entitySpecies);
          if (offspring) {
            newEntities.push(offspring);
          }
        }
      }
    }
    
    return newEntities;
  }
  
  /**
   * Replicate entity
   */
  private replicate(entity: Entity, species: Species): Entity | null {
    if (entity.energy === undefined) return null;
    
    // Consume energy for replication
    entity.energy -= this.config.replicationThreshold * 0.5;
    
    // Create offspring
    const offspringId = `entity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const offspring: Entity = {
      id: offspringId,
      position: {
        x: entity.position.x + randomRange(-1, 1),
        y: entity.position.y + randomRange(-1, 1),
        z: entity.position.z + randomRange(-1, 1),
      },
      velocity: {
        x: randomRange(-0.5, 0.5),
        y: randomRange(-0.5, 0.5),
        z: randomRange(-0.5, 0.5),
      },
      mass: entity.mass,
      speciesId: entity.speciesId,
      properties: { ...entity.properties },
      age: 0,
      energy: this.config.replicationThreshold * 0.5,
    };
    
    // Apply mutation
    if (Math.random() < this.config.mutationRate) {
      this.mutate(offspring, species);
    }
    
    return offspring;
  }
  
  /**
   * Mutate entity
   */
  private mutate(entity: Entity, species: Species): void {
    // Random property mutation
    const propertyKeys = Object.keys(entity.properties);
    if (propertyKeys.length > 0) {
      const key = propertyKeys[Math.floor(Math.random() * propertyKeys.length)];
      const currentValue = entity.properties[key];
      
      if (typeof currentValue === 'number') {
        entity.properties[key] = currentValue + randomRange(-0.1, 0.1);
      }
    }
    
    // Mass mutation
    entity.mass = Math.max(0.1, entity.mass + randomRange(-0.1, 0.1));
  }
  
  /**
   * Create new species
   */
  createSpecies(name: string, parentSpeciesId?: string): Species {
    const speciesId = `species_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      id: speciesId,
      name,
      traits: {},
      genome: [],
      population: 0,
      fitness: 0,
      createdAt: Date.now(),
      parentSpeciesId,
    };
  }
  
  /**
   * Update species fitness
   */
  updateSpeciesFitness(speciesData: Species, entities: Map<string, Entity>): void {
    const members = Array.from(entities.values()).filter(e => e.speciesId === speciesData.id);
    speciesData.population = members.length;
    
    // Calculate fitness based on population and average energy
    if (members.length > 0) {
      const avgEnergy = members.reduce((sum, e) => sum + (e.energy || 0), 0) / members.length;
      speciesData.fitness = speciesData.population * 0.5 + avgEnergy * 0.5;
    } else {
      speciesData.fitness = 0;
    }
  }
}

