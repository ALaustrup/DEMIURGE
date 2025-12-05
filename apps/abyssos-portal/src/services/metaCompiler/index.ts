/**
 * Meta-Compiler
 * 
 * Unified interface for self-writing code compiler
 */

import { extractComprehensiveSpec } from './specExtractor';
import { generateModule } from './codeGenerator';
import { generateTests, validateTests } from './testSynthesizer';
import { compileToWASM, validateWASM } from './vmCompiler';
import { moduleLinker } from './linker';
import type { ModuleSeed } from '../autopoiesis/autopoiesisTypes';
import type { GeneratedModule } from './codeGenerator';

export interface CompilationResult {
  success: boolean;
  module?: GeneratedModule;
  tests?: string[];
  testCoverage?: number;
  error?: string;
}

/**
 * Propose module from seed
 */
export async function proposeModule(seed: ModuleSeed): Promise<CompilationResult> {
  try {
    // Extract comprehensive spec
    const spec = await extractComprehensiveSpec(seed);
    
    // Generate module
    const module = await generateModule(spec, 'typescript');
    
    // Generate tests
    const tests = await generateTests(module);
    const testValidation = validateTests(tests, module);
    
    return {
      success: true,
      module,
      tests,
      testCoverage: testValidation.coverage,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Module proposal failed',
    };
  }
}

/**
 * Compile module
 */
export async function compileModule(module: GeneratedModule): Promise<CompilationResult> {
  try {
    // Compile to WASM if needed
    if (module.language === 'typescript') {
      const wasmBytes = await compileToWASM(module);
      const validation = await validateWASM(wasmBytes);
      
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error || 'WASM compilation failed',
        };
      }
    }
    
    return {
      success: true,
      module,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Compilation failed',
    };
  }
}

/**
 * Deploy module
 */
export async function deployModule(module: GeneratedModule): Promise<CompilationResult> {
  try {
    // Link module into OS
    const linkResult = await moduleLinker.linkModule(module);
    
    if (!linkResult.success) {
      return {
        success: false,
        error: linkResult.error || 'Deployment failed',
      };
    }
    
    return {
      success: true,
      module,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Deployment failed',
    };
  }
}

// Export singleton for convenience
export const metaCompiler = {
  proposeModule,
  compileModule,
  deployModule,
};

