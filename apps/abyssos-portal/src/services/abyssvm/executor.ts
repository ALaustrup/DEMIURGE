/**
 * Local WASM Executor
 * 
 * Executes WASM modules locally with sandboxing
 */

import { wasmVM } from '../runtime/wasmVM';
import type { VMJob, VMExecutionResult, VMABI, ExecutionReceipt } from './types';
import { generateReceipt } from './receipts';

/**
 * Execute WASM job locally
 */
export async function executeLocally(
  job: VMJob,
  abi: VMABI,
  peerId: string
): Promise<VMExecutionResult> {
  const startTime = Date.now();
  const logs: string[] = [];
  
  try {
    // Load module if not already loaded
    const module = wasmVM['modules'].get(job.wasmModuleId);
    if (!module) {
      throw new Error(`Module ${job.wasmModuleId} not found`);
    }
    
    // Create DNS ABI if not provided
    let dnsABI = abi.dns;
    if (!dnsABI) {
      const { createDNSABI } = await import('../runtime/abi/dns');
      dnsABI = createDNSABI();
    }
    
    // Create enhanced ABI with logging and DNS
    const enhancedABI = {
      ...abi,
      log: (message: string) => {
        logs.push(message);
        abi.log(message);
      },
      dns: dnsABI,
    };
    
    // Execute WASM
    const result = await wasmVM.execute(job.wasmModuleId, enhancedABI);
    
    const executionTime = Date.now() - startTime;
    
    // Generate receipt if requested
    let receipt: ExecutionReceipt | undefined;
    if (job.options?.requireReceipt) {
      receipt = generateReceipt(
        job.jobId,
        job.input,
        result.output || {},
        logs,
        executionTime,
        peerId
      );
    }
    
    return {
      success: result.success,
      output: result.output,
      logs,
      error: result.error,
      receipt,
      executionTime,
      peerId,
    };
  } catch (error: any) {
    const executionTime = Date.now() - startTime;
    
    return {
      success: false,
      logs,
      error: error.message || 'Execution failed',
      executionTime,
      peerId,
    };
  }
}

/**
 * Get local VM capabilities
 */
export function getLocalCapabilities(): {
  computeScore: number;
  freeMemory: number;
  supportedFeatures: string[];
  maxConcurrentJobs: number;
} {
  // Estimate compute score based on available resources
  const freeMemory = (performance as any).memory 
    ? (performance as any).memory.jsHeapSizeLimit - (performance as any).memory.usedJSHeapSize
    : 100 * 1024 * 1024; // Default 100MB
    
  // Simple compute score (0-100)
  const computeScore = Math.min(100, Math.floor(freeMemory / (10 * 1024 * 1024)));
  
  return {
    computeScore,
    freeMemory,
    supportedFeatures: ['wasm', 'sign', 'drc369', 'storage'],
    maxConcurrentJobs: 10,
  };
}

