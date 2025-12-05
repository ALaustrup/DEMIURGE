/**
 * Linker
 * 
 * Integrates compiled modules into the OS
 */

import { wasmVM } from '../runtime/wasmVM';
import type { GeneratedModule } from './codeGenerator';

class ModuleLinker {
  private linkedModules: Map<string, GeneratedModule> = new Map();
  
  /**
   * Link module into OS
   */
  async linkModule(module: GeneratedModule): Promise<{ success: boolean; error?: string }> {
    try {
      // Validate module
      if (!module.code || module.code.length === 0) {
        return { success: false, error: 'Module code is empty' };
      }
      
      // Check dependencies
      for (const dep of module.metadata.dependencies) {
        if (!this.isDependencyAvailable(dep)) {
          return { success: false, error: `Missing dependency: ${dep}` };
        }
      }
      
      // Link module
      this.linkedModules.set(module.id, module);
      
      // If WASM, load into VM
      if (module.language === 'wasm') {
        // In production, load WASM bytes into VM
        console.log(`[Linker] Would load WASM module ${module.id} into VM`);
      }
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Linking failed' };
    }
  }
  
  /**
   * Check if dependency is available
   */
  private isDependencyAvailable(dep: string): boolean {
    // In production, check actual dependencies
    // For now, allow common dependencies
    const allowed = ['react', 'react-dom', 'zustand', '@noble/curves', '@noble/hashes'];
    return allowed.some(a => dep.includes(a)) || dep.startsWith('./') || dep.startsWith('../');
  }
  
  /**
   * Unlink module
   */
  unlinkModule(moduleId: string): boolean {
    return this.linkedModules.delete(moduleId);
  }
  
  /**
   * Get linked module
   */
  getLinkedModule(moduleId: string): GeneratedModule | undefined {
    return this.linkedModules.get(moduleId);
  }
  
  /**
   * List all linked modules
   */
  listLinkedModules(): GeneratedModule[] {
    return Array.from(this.linkedModules.values());
  }
}

// Singleton instance
export const moduleLinker = new ModuleLinker();

