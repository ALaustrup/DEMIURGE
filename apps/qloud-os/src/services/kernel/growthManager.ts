/**
 * Growth Manager
 * 
 * Encourages self-directed expansion
 */

import { seedGenerator } from '../autopoiesis/seedGenerator';
import { coreHeuristics } from './coreHeuristics';
import { stabilityManager } from './stabilityManager';
import { metaCompiler } from '../metaCompiler';

class GrowthManager {
  /**
   * Propose growth path
   */
  async proposeGrowth(): Promise<{
    seeds: any[];
    decision: any;
    canProceed: boolean;
  }> {
    // Get evolution decision
    const decision = await coreHeuristics.decideEvolutionPath();
    
    // Check stability
    const stabilityCheck = await stabilityManager.isMutationSafe();
    
    // Generate seeds
    const seeds = await seedGenerator.generateAllSeeds();
    
    // Filter and prioritize seeds
    const prioritizedSeeds = seeds
      .map(seed => ({
        ...seed,
        priority: coreHeuristics.evaluateSeedPriority(seed),
      }))
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 5); // Top 5 seeds
    
    return {
      seeds: prioritizedSeeds,
      decision,
      canProceed: stabilityCheck.safe && decision.priority >= 50,
    };
  }
  
  /**
   * Execute growth
   */
  async executeGrowth(seed: any): Promise<{ success: boolean; moduleId?: string; error?: string }> {
    // Check stability again
    const stabilityCheck = await stabilityManager.isMutationSafe();
    if (!stabilityCheck.safe) {
      return {
        success: false,
        error: stabilityCheck.reason || 'Growth blocked for stability',
      };
    }
    
    try {
      // Propose module
      const proposal = await metaCompiler.proposeModule(seed);
      if (!proposal.success || !proposal.module) {
        return {
          success: false,
          error: proposal.error || 'Module proposal failed',
        };
      }
      
      // Compile module
      const compilation = await metaCompiler.compileModule(proposal.module);
      if (!compilation.success) {
        return {
          success: false,
          error: compilation.error || 'Compilation failed',
        };
      }
      
      // Deploy module
      const deployment = await metaCompiler.deployModule(compilation.module!);
      if (!deployment.success) {
        return {
          success: false,
          error: deployment.error || 'Deployment failed',
        };
      }
      
      // Record mutation
      stabilityManager.recordMutation();
      
      return {
        success: true,
        moduleId: compilation.module!.id,
      };
    } catch (error: any) {
      stabilityManager.recordError();
      return {
        success: false,
        error: error.message || 'Growth execution failed',
      };
    }
  }
}

// Singleton instance
export const growthManager = new GrowthManager();

