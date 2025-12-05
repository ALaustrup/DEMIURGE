/**
 * Conflict Resolver
 * 
 * Arbitration between lineages
 */

import { lineageGraph } from '../lineage/lineageGraph';
import { treatyEngine } from './treatyEngine';

class ConflictResolver {
  /**
   * Resolve conflict between instances
   */
  async resolveConflict(
    instance1Id: string,
    instance2Id: string,
    conflict: string
  ): Promise<{
    resolved: boolean;
    resolution?: string;
    treatyId?: string;
  }> {
    const node1 = lineageGraph.getNode(instance1Id);
    const node2 = lineageGraph.getNode(instance2Id);
    
    if (!node1 || !node2) {
      return {
        resolved: false,
        resolution: 'One or both instances not found',
      };
    }
    
    // Higher fitness wins
    if (node1.fitness > node2.fitness) {
      return {
        resolved: true,
        resolution: `${instance1Id} wins (higher fitness: ${node1.fitness} vs ${node2.fitness})`,
      };
    } else if (node2.fitness > node1.fitness) {
      return {
        resolved: true,
        resolution: `${instance2Id} wins (higher fitness: ${node2.fitness} vs ${node1.fitness})`,
      };
    }
    
    // If equal fitness, create treaty
    const treaty = treatyEngine.proposeTreaty(
      [instance1Id, instance2Id],
      `Conflict resolution: ${conflict}`
    );
    
    return {
      resolved: true,
      resolution: 'Conflict resolved via treaty',
      treatyId: treaty.id,
    };
  }
}

// Singleton instance
export const conflictResolver = new ConflictResolver();

