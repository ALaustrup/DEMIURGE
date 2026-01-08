/**
 * Society Model
 * 
 * Economic and social agent interactions
 */

import type { Entity, SocietyConfig } from '../types';
import { distance } from '../utils';

export interface Trade {
  from: string;
  to: string;
  resource: string;
  amount: number;
  timestamp: number;
}

export interface Treaty {
  parties: string[];
  terms: Record<string, any>;
  timestamp: number;
}

export class SocietyModel {
  private config: SocietyConfig;
  private trades: Trade[] = [];
  private treaties: Treaty[] = [];
  private socialGraph: Map<string, Set<string>> = new Map();
  
  constructor(config: SocietyConfig) {
    this.config = config;
  }
  
  /**
   * Update social interactions
   */
  update(entities: Map<string, Entity>, _delta: number): void {
    if (!this.config.socialGraphEnabled) return;
    
    const entityArray = Array.from(entities.values());
    
    // Build social graph based on proximity
    for (let i = 0; i < entityArray.length; i++) {
      const a = entityArray[i];
      if (!a.speciesId) continue;
      
      if (!this.socialGraph.has(a.id)) {
        this.socialGraph.set(a.id, new Set());
      }
      
      for (let j = i + 1; j < entityArray.length; j++) {
        const b = entityArray[j];
        if (!b.speciesId) continue;
        
        const dist = distance(a.position, b.position);
        const interactionRadius = 5; // Interaction distance
        
        if (dist < interactionRadius) {
          // Add to social graph
          if (!this.socialGraph.has(b.id)) {
            this.socialGraph.set(b.id, new Set());
          }
          
          this.socialGraph.get(a.id)!.add(b.id);
          this.socialGraph.get(b.id)!.add(a.id);
          
          // Trade if enabled
          if (this.config.tradeEnabled && Math.random() < 0.01) {
            this.executeTrade(a, b);
          }
        }
      }
    }
    
    // Form treaties if enabled
    if (this.config.treatyEnabled && Math.random() < 0.001) {
      this.formTreaty(entities);
    }
  }
  
  /**
   * Execute trade between entities
   */
  private executeTrade(a: Entity, b: Entity): void {
    if (!a.properties.resources || !b.properties.resources) return;
    
    // Simple resource exchange
    const aResources = a.properties.resources as Record<string, number>;
    const bResources = b.properties.resources as Record<string, number>;
    
    const resourceKeys = Object.keys(aResources);
    if (resourceKeys.length === 0) return;
    
    const resource = resourceKeys[Math.floor(Math.random() * resourceKeys.length)];
    const amount = Math.min(aResources[resource] || 0, 10);
    
    if (amount > 0) {
      aResources[resource] = (aResources[resource] || 0) - amount;
      bResources[resource] = (bResources[resource] || 0) + amount;
      
      this.trades.push({
        from: a.id,
        to: b.id,
        resource,
        amount,
        timestamp: Date.now(),
      });
    }
  }
  
  /**
   * Form treaty between entities
   */
  private formTreaty(entities: Map<string, Entity>): void {
    const entityArray = Array.from(entities.values()).filter(e => e.speciesId);
    if (entityArray.length < 2) return;
    
    // Select random entities
    const parties = entityArray
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(3, entityArray.length))
      .map(e => e.id);
    
    if (parties.length >= 2) {
      this.treaties.push({
        parties,
        terms: {
          cooperation: true,
          resourceSharing: true,
        },
        timestamp: Date.now(),
      });
    }
  }
  
  /**
   * Get social graph
   */
  getSocialGraph(): Map<string, Set<string>> {
    return this.socialGraph;
  }
  
  /**
   * Get trades
   */
  getTrades(): Trade[] {
    return this.trades;
  }
  
  /**
   * Get treaties
   */
  getTreaties(): Treaty[] {
    return this.treaties;
  }
}

