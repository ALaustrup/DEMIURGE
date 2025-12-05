/**
 * Clone Generator
 * 
 * Packages a complete system clone into a genesis seed
 */

import { getMetaState } from '../kernel/metaState';
import { spiritManager } from '../spirits/spiritManager';
import { vectorStore } from '../neural/vectorStore';
import { createNeuralSnapshot } from '../neural/neuralSnapshot';
import { selfRewriteEngine } from '../autopoiesis/selfRewriteEngine';
import { rollbackManager } from '../autopoiesis/rollbackManager';
import type { GenesisSeed, CloneTraits } from './reproductionTypes';
import { getLocalPeerId } from '../grid/peer';

class CloneGenerator {
  /**
   * Generate genesis seed for new clone
   */
  async generateGenesisSeed(
    parentId: string,
    traits: CloneTraits
  ): Promise<GenesisSeed> {
    // Get current system state
    const metaState = await getMetaState();
    
    // Get all spirits
    const spirits = spiritManager.getAllSpirits();
    const spiritTemplates = spirits.map(s => ({
      name: s.name,
      personality: s.personality,
      permissions: s.permissions,
    }));
    
    // Get neural snapshots
    const neuralSnapshot = await createNeuralSnapshot();
    
    // Get kernel config
    const kernelConfig = {
      heuristics: metaState.growth.decision,
      stability: metaState.stability,
      prediction: metaState.prediction,
    };
    
    // Get module state
    const modules = selfRewriteEngine.listModules();
    const moduleState = modules.map(id => ({
      id,
      version: selfRewriteEngine.getModuleVersion(id),
      code: selfRewriteEngine.getModule(id),
    }));
    
    // Create system state
    const systemState = {
      metaState,
      spiritTemplates,
      neuralSnapshot,
      kernelConfig,
      moduleState,
    };
    
    // Calculate Merkle root
    const merkleRoot = this.calculateMerkleRoot(JSON.stringify(systemState));
    
    return {
      id: `seed:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`,
      parentId,
      systemState,
      kernelConfig,
      spiritTemplates,
      neuralSnapshots: [neuralSnapshot],
      timestamp: Date.now(),
      merkleRoot,
    };
  }
  
  /**
   * Calculate Merkle root
   */
  private calculateMerkleRoot(data: string): string {
    // Simple hash (in production, use proper Merkle tree)
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(16, '0');
  }
  
  /**
   * Serialize genesis seed for transmission
   */
  serializeSeed(seed: GenesisSeed): string {
    return JSON.stringify(seed);
  }
  
  /**
   * Deserialize genesis seed
   */
  deserializeSeed(data: string): GenesisSeed {
    return JSON.parse(data);
  }
}

// Singleton instance
export const cloneGenerator = new CloneGenerator();

