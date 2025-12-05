/**
 * Lineage Heuristics
 * 
 * Evaluate which traits persist across branches
 */

import { lineageGraph } from './lineageGraph';
import type { LineageNode } from './lineageGraph';
import type { CloneTraits } from '../reproduction/reproductionTypes';

export interface TraitPersistence {
  trait: string;
  persistence: number; // 0-1, how often it appears in lineage
  averageFitness: number; // Average fitness of instances with this trait
}

class LineageHeuristics {
  /**
   * Analyze trait persistence across lineage
   */
  analyzeTraitPersistence(lineage: string, traitKey: keyof CloneTraits): TraitPersistence[] {
    const nodes = lineageGraph.getAllNodes().filter(n => n.lineage === lineage);
    const traitMap = new Map<string, { count: number; fitnessSum: number }>();
    
    // In production, would extract actual traits from nodes
    // For now, return placeholder
    return [];
  }
  
  /**
   * Get most successful traits
   */
  getMostSuccessfulTraits(lineage: string): string[] {
    const nodes = lineageGraph.getAllNodes()
      .filter(n => n.lineage === lineage && n.status === 'active')
      .sort((a, b) => b.fitness - a.fitness)
      .slice(0, 5);
    
    // In production, would extract traits from top performers
    return nodes.map(n => `trait:${n.instanceId}`);
  }
  
  /**
   * Predict trait success
   */
  predictTraitSuccess(trait: string, lineage: string): number {
    // Simple heuristic: traits in high-fitness nodes are more successful
    const nodes = lineageGraph.getAllNodes()
      .filter(n => n.lineage === lineage && n.status === 'active');
    
    if (nodes.length === 0) return 0.5;
    
    const avgFitness = nodes.reduce((sum, n) => sum + n.fitness, 0) / nodes.length;
    return avgFitness / 100; // Normalize to 0-1
  }
}

// Singleton instance
export const lineageHeuristics = new LineageHeuristics();

