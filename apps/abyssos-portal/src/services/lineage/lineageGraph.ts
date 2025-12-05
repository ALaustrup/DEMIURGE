/**
 * Lineage Graph
 * 
 * DAG of all Demiurge instances + mutation paths
 */

import { heritageMap } from '../reproduction/heritageMap';
import type { HeritageRecord } from '../reproduction/reproductionTypes';

export interface LineageNode {
  instanceId: string;
  parentId: string | null;
  generation: number;
  lineage: string;
  divergence: number;
  fitness: number; // 0-100
  children: string[];
  status: 'active' | 'extinct' | 'merged';
}

class LineageGraph {
  private nodes: Map<string, LineageNode> = new Map();
  
  /**
   * Add node to graph
   */
  addNode(record: HeritageRecord, fitness: number = 50): void {
    const node: LineageNode = {
      instanceId: record.instanceId,
      parentId: record.parentId,
      generation: record.generation,
      lineage: record.lineage,
      divergence: record.divergence,
      fitness,
      children: [],
      status: record.status,
    };
    
    this.nodes.set(record.instanceId, node);
    
    // Update parent's children list
    if (record.parentId) {
      const parent = this.nodes.get(record.parentId);
      if (parent) {
        parent.children.push(record.instanceId);
      }
    }
  }
  
  /**
   * Get node
   */
  getNode(instanceId: string): LineageNode | undefined {
    return this.nodes.get(instanceId);
  }
  
  /**
   * Get all nodes
   */
  getAllNodes(): LineageNode[] {
    return Array.from(this.nodes.values());
  }
  
  /**
   * Get root nodes (generation 0)
   */
  getRootNodes(): LineageNode[] {
    return Array.from(this.nodes.values()).filter(n => n.generation === 0);
  }
  
  /**
   * Get subtree (instance and all descendants)
   */
  getSubtree(instanceId: string): LineageNode[] {
    const subtree: LineageNode[] = [];
    const node = this.nodes.get(instanceId);
    if (!node) return subtree;
    
    subtree.push(node);
    
    for (const childId of node.children) {
      subtree.push(...this.getSubtree(childId));
    }
    
    return subtree;
  }
  
  /**
   * Get path between two nodes
   */
  getPath(fromId: string, toId: string): LineageNode[] | null {
    const path: LineageNode[] = [];
    let current: LineageNode | undefined = this.nodes.get(toId);
    
    while (current) {
      path.unshift(current);
      if (current.instanceId === fromId) {
        return path;
      }
      if (current.parentId) {
        current = this.nodes.get(current.parentId);
      } else {
        break;
      }
    }
    
    return null;
  }
  
  /**
   * Update fitness
   */
  updateFitness(instanceId: string, fitness: number): void {
    const node = this.nodes.get(instanceId);
    if (node) {
      node.fitness = fitness;
    }
  }
  
  /**
   * Mark as extinct
   */
  markExtinct(instanceId: string): void {
    const node = this.nodes.get(instanceId);
    if (node) {
      node.status = 'extinct';
    }
  }
}

// Singleton instance
export const lineageGraph = new LineageGraph();

