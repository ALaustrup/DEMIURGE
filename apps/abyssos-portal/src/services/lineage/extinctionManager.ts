/**
 * Extinction Manager
 * 
 * Retires unfit lineages
 */

import { lineageGraph } from './lineageGraph';
import { heritageMap } from '../reproduction/heritageMap';

class ExtinctionManager {
  private extinctionThreshold = 30; // Fitness below this = extinction risk
  
  /**
   * Check for extinction candidates
   */
  checkExtinction(): string[] {
    const candidates: string[] = [];
    const nodes = lineageGraph.getAllNodes().filter(n => n.status === 'active');
    
    for (const node of nodes) {
      if (node.fitness < this.extinctionThreshold) {
        // Check if has active children (if yes, don't mark extinct yet)
        const hasActiveChildren = node.children.some(childId => {
          const child = lineageGraph.getNode(childId);
          return child && child.status === 'active';
        });
        
        if (!hasActiveChildren) {
          candidates.push(node.instanceId);
        }
      }
    }
    
    return candidates;
  }
  
  /**
   * Mark lineage as extinct
   */
  markExtinct(instanceId: string): void {
    lineageGraph.markExtinct(instanceId);
    heritageMap.markExtinct(instanceId);
  }
  
  /**
   * Get extinction risk for instance
   */
  getExtinctionRisk(instanceId: string): number {
    const node = lineageGraph.getNode(instanceId);
    if (!node || node.status !== 'active') return 0;
    
    if (node.fitness < this.extinctionThreshold) {
      return 1 - (node.fitness / this.extinctionThreshold);
    }
    
    return 0;
  }
}

// Singleton instance
export const extinctionManager = new ExtinctionManager();

