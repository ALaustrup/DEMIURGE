/**
 * Execution Receipt Generator
 * 
 * Creates provable execution receipts for WASM jobs
 */

import type { ExecutionReceipt } from './types';
import type { ZKProof } from './zk/zkTypes';

function randomUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Hash data using SHA-256 (synchronous hash for receipts)
 */
function hashDataSync(data: any): string {
  // Use a simple hash for sync operations (not cryptographically secure, but sufficient for receipts)
  const json = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < json.length; i++) {
    const char = json.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
}

/**
 * Generate execution receipt
 */
export function generateReceipt(
  jobId: string,
  input: any,
  output: any,
  logs: string[],
  executionTime: number,
  peerId: string,
  blockHeight?: number,
  zkProof?: ZKProof
): ExecutionReceipt {
  const inputHash = hashDataSync(input);
  const outputHash = hashDataSync(output);
  
  // Create Merkle proof (simplified - in production, use proper Merkle tree)
  const merkleProof = hashDataSync({
    inputHash,
    outputHash,
    logsHash: hashDataSync(logs),
    timestamp: Date.now(),
  });
  
  return {
    receiptId: `receipt:${randomUUID()}`,
    jobId,
    inputHash,
    outputHash,
    logs,
    timestamp: Date.now(),
    peerId,
    executionTime,
    blockHeight,
    merkleProof,
    // ZK proof fields (if provided)
    proof: zkProof?.proof,
    pubInputsRoot: zkProof?.pubInputsRoot,
    outputRoot: zkProof?.outputRoot,
    jobsHash: zkProof?.jobsHash,
  };
}

/**
 * Verify receipt integrity
 */
export function verifyReceipt(receipt: ExecutionReceipt, input: any, output: any): boolean {
  const inputHash = hashDataSync(input);
  const outputHash = hashDataSync(output);
  
  return (
    receipt.inputHash === inputHash &&
    receipt.outputHash === outputHash
  );
}

/**
 * Serialize receipt for storage/transmission
 */
export function serializeReceipt(receipt: ExecutionReceipt): string {
  return JSON.stringify(receipt);
}

/**
 * Deserialize receipt
 */
export function deserializeReceipt(data: string): ExecutionReceipt {
  return JSON.parse(data);
}
