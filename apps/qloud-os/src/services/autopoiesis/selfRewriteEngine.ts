/**
 * Self-Rewrite Engine
 * 
 * Hot-swappable module loader with rollback support
 */

import { mutationSupervisor } from './mutationSupervisor';
import { fitnessEvaluator } from './fitnessEvaluator';
import { rollbackManager } from './rollbackManager';
import type { ModuleMutation } from './autopoiesisTypes';

class SelfRewriteEngine {
  private modules: Map<string, string> = new Map(); // moduleId -> code
  private moduleVersions: Map<string, number> = new Map(); // moduleId -> version
  
  /**
   * Apply mutation
   */
  async applyMutation(mutation: ModuleMutation): Promise<{ success: boolean; error?: string }> {
    // Create snapshot before mutation
    const snapshot = rollbackManager.createSnapshot(this.modules, {
      version: this.moduleVersions.get(mutation.moduleId) || 0,
    });
    
    // Validate mutation
    const validation = mutationSupervisor.validateMutation(mutation);
    if (!validation.valid) {
      return {
        success: false,
        error: `Mutation validation failed: ${validation.errors.join(', ')}`,
      };
    }
    
    try {
      // Apply mutation
      const currentCode = this.modules.get(mutation.moduleId) || '';
      const newCode = this.mergeCode(currentCode, mutation);
      
      // Evaluate fitness
      const fitness = await fitnessEvaluator.evaluateFitness(
        mutation.moduleId,
        newCode,
        100, // Placeholder execution time
        1000, // Placeholder memory
        0, // Placeholder error count
      );
      
      // Check if fitness meets threshold
      if (!fitnessEvaluator.meetsThreshold(fitness)) {
        // Rollback
        await rollbackManager.restoreSnapshot(snapshot.id);
        return {
          success: false,
          error: `Fitness threshold not met: ${fitness.overall.toFixed(2)}`,
        };
      }
      
      // Apply new code
      this.modules.set(mutation.moduleId, newCode);
      const currentVersion = this.moduleVersions.get(mutation.moduleId) || 0;
      this.moduleVersions.set(mutation.moduleId, currentVersion + 1);
      
      return { success: true };
    } catch (error: any) {
      // Rollback on error
      await rollbackManager.restoreSnapshot(snapshot.id);
      return {
        success: false,
        error: error.message || 'Mutation application failed',
      };
    }
  }
  
  /**
   * Merge code based on mutation type
   */
  private mergeCode(currentCode: string, mutation: ModuleMutation): string {
    switch (mutation.type) {
      case 'rewrite':
        return mutation.code; // Full replacement
      case 'optimize':
        // In production, apply optimizations
        return mutation.code;
      case 'extend':
        return currentCode + '\n\n' + mutation.code;
      case 'refactor':
        return mutation.code; // Refactored version
      default:
        return currentCode;
    }
  }
  
  /**
   * Get module code
   */
  getModule(moduleId: string): string | undefined {
    return this.modules.get(moduleId);
  }
  
  /**
   * Get module version
   */
  getModuleVersion(moduleId: string): number {
    return this.moduleVersions.get(moduleId) || 0;
  }
  
  /**
   * List all modules
   */
  listModules(): string[] {
    return Array.from(this.modules.keys());
  }
}

// Singleton instance
export const selfRewriteEngine = new SelfRewriteEngine();

