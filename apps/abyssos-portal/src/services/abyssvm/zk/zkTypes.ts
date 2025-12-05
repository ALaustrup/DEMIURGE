/**
 * ZK-WASM Types
 * 
 * Types for zero-knowledge WASM execution verification
 */

export interface ZKProof {
  proof: string; // Base64 encoded proof
  publicInputs: string[]; // Public inputs to the circuit
  pubInputsRoot: string; // Merkle root of public inputs
  outputRoot: string; // Merkle root of execution output
  jobsHash: string; // Hash of the WASM job specification
}

export interface ZKReceipt {
  jobId: string;
  inputHash: string;
  outputHash: string;
  proof: string;
  pubInputsRoot: string;
  outputRoot: string;
  jobsHash: string;
  timestamp: number;
  peerId: string;
  executionTime: number;
  blockHeight?: number;
}

export interface ZKVerificationResult {
  valid: boolean;
  error?: string;
  verifiedAt: number;
}

export interface ZKProverConfig {
  wasmBytes: Uint8Array;
  input: any;
  output: any;
  executionTrace?: any[];
}

