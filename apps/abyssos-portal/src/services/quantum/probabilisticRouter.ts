/**
 * Probabilistic Router
 * 
 * Routes decisions based on probability fields
 */

import type { ProbabilityField, QuantumState } from './quantumTypes';

class ProbabilisticRouter {
  /**
   * Create probability field for decision
   */
  createProbabilityField(decision: string, amplitude: number, phase: number = 0): ProbabilityField {
    return {
      decision,
      amplitude: Math.max(0, Math.min(1, amplitude)),
      phase: phase % (2 * Math.PI),
    };
  }
  
  /**
   * Route decision probabilistically
   */
  routeDecision(fields: ProbabilityField[]): string {
    if (fields.length === 0) {
      return 'default';
    }
    
    // Calculate probabilities from amplitudes
    const probabilities = fields.map(f => ({
      decision: f.decision,
      probability: f.amplitude * f.amplitude, // Probability = |amplitude|²
    }));
    
    // Normalize probabilities
    const total = probabilities.reduce((sum, p) => sum + p.probability, 0);
    if (total === 0) {
      return fields[0].decision;
    }
    
    const normalized = probabilities.map(p => ({
      decision: p.decision,
      probability: p.probability / total,
    }));
    
    // Select based on probability
    const random = Math.random();
    let cumulative = 0;
    
    for (const p of normalized) {
      cumulative += p.probability;
      if (random <= cumulative) {
        return p.decision;
      }
    }
    
    return normalized[normalized.length - 1].decision;
  }
  
  /**
   * Create quantum state
   */
  createQuantumState(fields: ProbabilityField[]): QuantumState {
    return {
      superpositions: fields,
      collapsed: null,
      measurement: 0,
    };
  }
  
  /**
   * Collapse quantum state
   */
  collapseState(state: QuantumState): string {
    if (state.collapsed) {
      return state.collapsed;
    }
    
    const decision = this.routeDecision(state.superpositions);
    state.collapsed = decision;
    state.measurement = Math.random();
    
    return decision;
  }
}

// Singleton instance
export const probabilisticRouter = new ProbabilisticRouter();

