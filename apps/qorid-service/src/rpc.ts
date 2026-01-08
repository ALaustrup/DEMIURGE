/**
 * Demiurge RPC Client
 * 
 * Universal backend → chain gateway for JSON-RPC calls
 */

import axios from 'axios';

const RPC_URL = process.env.DEMIURGE_RPC_URL || 'https://rpc.demiurge.cloud/rpc';

export interface JsonRpcRequest {
  jsonrpc: '2.0';
  method: string;
  params: any[];
  id: number | string;
}

export interface JsonRpcResponse<T = any> {
  jsonrpc: '2.0';
  result?: T;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
  id: number | string;
}

/**
 * Send a JSON-RPC request to the Demiurge chain
 * 
 * @param method - RPC method name (e.g., 'cgt_sendRawTransaction')
 * @param params - Method parameters
 * @returns Promise resolving to the result
 */
export async function rpcSend<T = any>(method: string, params: any[] = []): Promise<T> {
  const request: JsonRpcRequest = {
    jsonrpc: '2.0',
    method,
    params,
    id: Date.now(),
  };

  try {
    const response = await axios.post<JsonRpcResponse<T>>(RPC_URL, request, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 second timeout
    });

    if (response.data.error) {
      throw new Error(`RPC error: ${response.data.error.message} (code: ${response.data.error.code})`);
    }

    if (response.data.result === undefined) {
      throw new Error('RPC response missing result');
    }

    return response.data.result;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(`RPC request failed: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Get chain info
 */
export async function getChainInfo(): Promise<{ height: number }> {
  return rpcSend<{ height: number }>('cgt_getChainInfo', []);
}

/**
 * Send a raw transaction to the chain
 * 
 * @param rawTxHex - Raw transaction as hex string
 * @returns Transaction hash
 */
export async function sendRawTransaction(rawTxHex: string): Promise<string> {
  return rpcSend<string>('cgt_sendRawTransaction', [rawTxHex]);
}

