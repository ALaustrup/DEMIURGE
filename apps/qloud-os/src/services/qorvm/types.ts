/**
 * AbyssVM Types
 * 
 * Core types for the Demiurge Virtual Machine
 */

export interface VMJob {
  jobId: string;
  wasmModuleId: string;
  input: any;
  options?: VMJobOptions;
}

export interface VMJobOptions {
  memoryLimit?: number; // bytes
  instructionLimit?: number;
  timeout?: number; // ms
  executeRemotely?: boolean;
  targetPeerId?: string;
  requireReceipt?: boolean;
}

export interface VMExecutionResult {
  success: boolean;
  output?: any;
  logs: string[];
  error?: string;
  receipt?: ExecutionReceipt;
  executionTime: number; // ms
  peerId: string; // Which peer executed this
}

export interface ExecutionReceipt {
  receiptId: string;
  jobId: string;
  inputHash: string;
  outputHash: string;
  logs: string[];
  timestamp: number;
  peerId: string;
  executionTime: number;
  blockHeight?: number; // If anchored on-chain
  merkleProof?: string; // Merkle proof of execution
  // ZK proof fields (optional)
  proof?: string; // Base64 encoded zk proof
  pubInputsRoot?: string; // Merkle root of public inputs
  outputRoot?: string; // Merkle root of execution output
  jobsHash?: string; // Hash of WASM job specification
}

export interface VMCapabilities {
  computeScore: number; // 0-100
  freeMemory: number; // bytes
  supportedFeatures: string[]; // ["wasm", "sign", "drc369", "storage"]
  maxConcurrentJobs: number;
}

export interface VMJobStatus {
  jobId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress?: number; // 0-100
  peerId?: string;
  startedAt?: number;
  completedAt?: number;
  error?: string;
}

export interface VMABI {
  log: (message: string) => void;
  getWalletAddress: () => Promise<string | null>;
  signMessage: (message: string) => Promise<string | null>;
  rpcCall: (method: string, params: any[]) => Promise<any>;
  readFile: (path: string) => Promise<Uint8Array | null>;
  writeFile: (path: string, data: Uint8Array) => Promise<boolean>;
  getJobId: () => string;
  getPeerId: () => string;
  dns?: {
    lookup: (domain: string, type?: string) => Promise<any[]>;
    resolveAll: (domain: string) => Promise<any>;
    getChainRecord: (domain: string) => Promise<any | null>;
    clearCache: () => Promise<boolean>;
  };
}

