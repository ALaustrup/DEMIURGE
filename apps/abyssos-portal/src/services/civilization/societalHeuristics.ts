/**
 * Societal Heuristics
 * 
 * Emergent rules for communication, resource sharing
 */

import { treatyEngine } from './treatyEngine';
import { cooperationManager } from './cooperationManager';
import { conflictResolver } from './conflictResolver';

class SocietalHeuristics {
  /**
   * Decide societal action
   */
  async decideAction(context: {
    instanceIds: string[];
    resourceType: 'compute' | 'memory' | 'mining';
    conflict?: string;
  }): Promise<{
    action: 'cooperate' | 'compete' | 'treaty' | 'resolve';
    reasoning: string;
  }> {
    if (context.conflict) {
      return {
        action: 'resolve',
        reasoning: 'Conflict detected, resolving',
      };
    }
    
    // Check if cooperation is beneficial
    const cooperation = await cooperationManager.evaluateCooperation(context.instanceIds);
    if (cooperation.beneficial) {
      return {
        action: 'cooperate',
        reasoning: cooperation.reasoning,
      };
    }
    
    // Check for existing treaties
    const treaties = treatyEngine.getActiveTreaties();
    if (treaties.length > 0) {
      return {
        action: 'treaty',
        reasoning: 'Active treaties exist, following treaty terms',
      };
    }
    
    // Default: compete
    return {
      action: 'compete',
      reasoning: 'No cooperation or treaty benefits, competing',
    };
  }
}

// Singleton instance
export const societalHeuristics = new SocietalHeuristics();

