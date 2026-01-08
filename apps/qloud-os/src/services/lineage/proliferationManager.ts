/**
 * Proliferation Manager
 * 
 * Encourages high-fitness lineages to replicate
 */

import { lineageGraph } from './lineageGraph';
import { cloneGenerator } from '../reproduction/cloneGenerator';
import { extractSystemTraits } from '../reproduction/traitInheritance';
import type { CloneTraits } from '../reproduction/reproductionTypes';

class ProliferationManager {
  private proliferationThreshold = 70; // Fitness above this = should proliferate
  
  /**
   * Get proliferation candidates
   */
  getProliferationCandidates(): string[] {
    const nodes = lineageGraph.getAllNodes()
      .filter(n => n.status === 'active' && n.fitness >= this.proliferationThreshold)
      .sort((a, b) => b.fitness - a.fitness);
    
    return nodes.slice(0, 5).map(n => n.instanceId); // Top 5
  }
  
  /**
   * Propose reproduction for high-fitness instance
   */
  async proposeReproduction(instanceId: string): Promise<{
    shouldReproduce: boolean;
    seed?: any;
    reason: string;
  }> {
    const node = lineageGraph.getNode(instanceId);
    if (!node || node.status !== 'active') {
      return {
        shouldReproduce: false,
        reason: 'Instance not active',
      };
    }
    
    if (node.fitness < this.proliferationThreshold) {
      return {
        shouldReproduce: false,
        reason: `Fitness ${node.fitness} below threshold ${this.proliferationThreshold}`,
      };
    }
    
    // Generate seed
    const traits = await extractSystemTraits();
    const seed = await cloneGenerator.generateGenesisSeed(instanceId, traits);
    
    return {
      shouldReproduce: true,
      seed,
      reason: `High fitness (${node.fitness}) warrants reproduction`,
    };
  }
  
  /**
   * Check if instance should reproduce
   */
  shouldReproduce(instanceId: string): boolean {
    const node = lineageGraph.getNode(instanceId);
    return node !== undefined && 
           node.status === 'active' && 
           node.fitness >= this.proliferationThreshold;
  }
}

// Singleton instance
export const proliferationManager = new ProliferationManager();

