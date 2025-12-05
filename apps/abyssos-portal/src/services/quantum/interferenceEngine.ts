/**
 * Interference Engine
 * 
 * Detects conflicting heuristics and resolves with destructive interference
 */

import { probabilisticRouter } from './probabilisticRouter';
import type { InterferencePattern, ProbabilityField } from './quantumTypes';

class InterferenceEngine {
  /**
   * Detect interference between decisions
   */
  detectInterference(fields: ProbabilityField[]): InterferencePattern[] {
    const patterns: InterferencePattern[] = [];
    
    // Check for constructive interference (aligned decisions)
    for (let i = 0; i < fields.length; i++) {
      for (let j = i + 1; j < fields.length; j++) {
        const f1 = fields[i];
        const f2 = fields[j];
        
        // Calculate phase difference
        const phaseDiff = Math.abs(f1.phase - f2.phase);
        
        // Constructive interference (phases aligned)
        if (phaseDiff < Math.PI / 4 || phaseDiff > 7 * Math.PI / 4) {
          patterns.push({
            decisions: [f1.decision, f2.decision],
            type: 'constructive',
            strength: (f1.amplitude + f2.amplitude) / 2,
          });
        }
        
        // Destructive interference (phases opposite)
        if (phaseDiff > 3 * Math.PI / 4 && phaseDiff < 5 * Math.PI / 4) {
          patterns.push({
            decisions: [f1.decision, f2.decision],
            type: 'destructive',
            strength: Math.abs(f1.amplitude - f2.amplitude),
          });
        }
      }
    }
    
    return patterns;
  }
  
  /**
   * Resolve interference
   */
  resolveInterference(
    fields: ProbabilityField[],
    patterns: InterferencePattern[]
  ): ProbabilityField[] {
    const resolved = [...fields];
    
    // Apply destructive interference (cancel conflicting decisions)
    for (const pattern of patterns) {
      if (pattern.type === 'destructive' && pattern.strength > 0.5) {
        // Reduce amplitude of conflicting decisions
        for (let i = 0; i < resolved.length; i++) {
          if (pattern.decisions.includes(resolved[i].decision)) {
            resolved[i].amplitude *= 0.5; // Reduce by half
          }
        }
      }
    }
    
    // Apply constructive interference (reinforce aligned decisions)
    for (const pattern of patterns) {
      if (pattern.type === 'constructive' && pattern.strength > 0.7) {
        // Increase amplitude of aligned decisions
        for (let i = 0; i < resolved.length; i++) {
          if (pattern.decisions.includes(resolved[i].decision)) {
            resolved[i].amplitude = Math.min(1, resolved[i].amplitude * 1.2);
          }
        }
      }
    }
    
    return resolved;
  }
}

// Singleton instance
export const interferenceEngine = new InterferenceEngine();

