/**
 * Demiurge Chain Client
 * 
 * Provides functions for interacting with the Demiurge blockchain via JSON-RPC.
 * 
 * This is a stub/preparation module for future on-chain DRC-369 minting and CGT operations.
 * Currently, it provides basic chain info and transaction submission capabilities.
 */

const RPC_URL = import.meta.env.VITE_DEMIURGE_RPC_URL || 'https://rpc.demiurge.cloud/rpc';

interface ChainInfo {
  height: number;
  // Add more fields as needed
}

interface JsonRpcRequest {
  jsonrpc: '2.0';
  method: string;
  params: any[];
  id: number | string;
}

interface JsonRpcResponse<T = any> {
  jsonrpc: '2.0';
  result?: T;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
  id: number | string;
}

async function rpcRequest<T>(method: string, params: any[] = []): Promise<T> {
  const request: JsonRpcRequest = {
    jsonrpc: '2.0',
    method,
    params,
    id: Date.now(),
  };

  const response = await fetch(RPC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const json: JsonRpcResponse<T> = await response.json();

  if (json.error) {
    throw new Error(`RPC error: ${json.error.message}`);
  }

  if (json.result === undefined) {
    throw new Error('RPC response missing result');
  }

  return json.result;
}

/**
 * Get current chain information
 */
export async function getChainInfo(): Promise<ChainInfo> {
  return rpcRequest<ChainInfo>('cgt_getChainInfo', []);
}

/**
 * Send a raw transaction to the chain
 * 
 * @param tx - Transaction bytes (Uint8Array) or hex string
 * @returns Transaction hash
 */
export async function sendRawTransaction(tx: Uint8Array | string): Promise<string> {
  const txHex = typeof tx === 'string' ? tx : Array.from(tx)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  return rpcRequest<string>('cgt_sendRawTransaction', [txHex]);
}

/**
 * Encode a DRC-369 mint transaction
 * 
 * TODO: Implement actual transaction encoding based on Demiurge transaction format
 * This is a placeholder that will be implemented when on-chain DRC-369 minting is ready.
 * 
 * @param asset - DRC-369 asset to mint
 * @param signerPublicKey - Public key of the signer
 * @returns Encoded transaction bytes
 */
export async function encodeDrc369Mint(
  _asset: {
    uri: string;
    name?: string;
    description?: string;
    metadata?: Record<string, any>;
  },
  _signerPublicKey: string
): Promise<Uint8Array> {
  // Placeholder: This will encode a proper Demiurge transaction
  // For now, return empty bytes
  console.warn('encodeDrc369Mint is not yet implemented - on-chain minting coming soon');
  
  // TODO: Implement transaction encoding:
  // 1. Create transaction structure with module_id = 'drc369' (or appropriate module)
  // 2. Encode payload with asset data
  // 3. Sign transaction (this will be done by the caller with the private key)
  // 4. Return encoded bytes
  
  return new Uint8Array(0);
}

/**
 * Get balance for an address
 * 
 * @param address - Address or public key
 * @returns Balance in CGT (smallest unit)
 */
export async function getBalance(address: string): Promise<bigint> {
  // TODO: Implement when balance query is available
  return rpcRequest<bigint>('cgt_getBalance', [address]);
}

/**
 * Submit execution receipt to chain
 */
export async function submitExecutionReceipt(receipt: {
  receiptId: string;
  jobId: string;
  inputHash: string;
  outputHash: string;
  proof?: string;
  pubInputsRoot?: string;
  outputRoot?: string;
  timestamp: number;
  peerId: string;
}): Promise<string> {
  return rpcRequest<string>('submitExecutionReceipt', [receipt]);
}

/**
 * Fetch execution receipt from chain
 */
export async function fetchReceipt(receiptId: string): Promise<any> {
  return rpcRequest('getExecutionReceipt', [receiptId]);
}

/**
 * Stake for compute provider
 */
export async function stakeForProvider(peerId: string, amount: number): Promise<string> {
  return rpcRequest<string>('stakeForComputeProvider', [peerId, amount]);
}

/**
 * Slash provider
 */
export async function slashProvider(peerId: string, reason: string): Promise<string> {
  return rpcRequest<string>('slashStaker', [peerId, reason]);
}

/**
 * Submit neural snapshot to chain
 */
export async function submitNeuralSnapshot(rootHash: string): Promise<string> {
  return rpcRequest<string>('submitNeuralSnapshot', [rootHash]);
}

/**
 * Record compute contribution
 */
export async function recordComputeContribution(cycles: number, zkProofCount: number): Promise<string> {
  return rpcRequest<string>('recordComputeContribution', [cycles, zkProofCount]);
}

/**
 * Get mining rewards
 */
export async function getMiningRewards(address: string): Promise<{ totalReward: number; claimCount: number }> {
  return rpcRequest('getMiningRewards', [address]);
}

/**
 * Submit autopoiesis receipt
 */
export async function submitAutopoiesisReceipt(receipt: {
  moduleId: string;
  mutationType: string;
  fitness: number;
  timestamp: number;
}): Promise<string> {
  return rpcRequest<string>('submitAutopoiesisReceipt', [receipt]);
}

/**
 * Submit evolution receipt
 */
export async function submitEvolutionReceipt(receipt: {
  spiritId: string;
  parentIds: string[];
  generation: number;
  fitness: number;
  timestamp: number;
}): Promise<string> {
  return rpcRequest<string>('submitEvolutionReceipt', [receipt]);
}

/**
 * Get kernel state
 */
export async function getKernelState(): Promise<any> {
  return rpcRequest('getKernelState', []);
}

/**
 * Submit temporal root
 */
export async function submitTemporalRoot(root: {
  rootHash: string;
  timestamp: number;
  branchHashes: string[];
}): Promise<string> {
  return rpcRequest<string>('submitTemporalRoot', [root]);
}

/**
 * Predictive query (query predicted chain state N blocks ahead)
 */
export async function predictiveQuery(blocksAhead: number): Promise<any> {
  return rpcRequest('predictiveQuery', [blocksAhead]);
}

/**
 * Anchor branch execution path to chain
 */
export async function anchorBranch(branchId: string, executionPath: string[]): Promise<string> {
  return rpcRequest<string>('anchorBranch', [branchId, executionPath]);
}

/**
 * Merge temporal histories
 */
export async function mergeTemporalHistories(histories: any[]): Promise<string> {
  return rpcRequest<string>('mergeTemporalHistories', [histories]);
}

