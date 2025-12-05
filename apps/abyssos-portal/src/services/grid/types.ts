/**
 * Abyss Grid Protocol Types
 */

export interface GridPeer {
  peerId: string;
  version: string;
  computeScore: number;
  freeMemory: number;
  supportedFeatures: string[];
  lastSeen: number;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
}

export interface GridMessage {
  type: string;
  from: string;
  to?: string; // If undefined, broadcast
  payload: any;
  timestamp: number;
  signature?: string;
}

export interface GridJobRequest {
  jobId: string;
  wasmModuleId: string;
  input: any;
  options?: {
    memoryLimit?: number;
    instructionLimit?: number;
    timeout?: number;
  };
}

export interface GridJobResponse {
  jobId: string;
  status: 'accepted' | 'rejected' | 'completed' | 'failed';
  result?: any;
  error?: string;
  receipt?: any;
}

export interface PeerAnnouncement {
  peerId: string;
  version: string;
  computeScore: number;
  freeMemory: number;
  supportedFeatures: string[];
  timestamp: number;
}

export interface DNSQueryMessage extends GridMessage {
  type: 'DNS_QUERY';
  payload: {
    domain: string;
    recordType: string;
    requestId: string;
  };
}

export interface DNSResponseMessage extends GridMessage {
  type: 'DNS_RESPONSE';
  payload: {
    requestId: string;
    domain: string;
    recordType: string;
    records: Array<{
      value: string | string[];
      ttl: number;
      source: string;
    }>;
  };
}

export interface DNSChainRecordMessage extends GridMessage {
  type: 'DNS_CHAIN_RECORD';
  payload: {
    domain: string;
    assetId: string;
    records: any;
    txHash: string;
  };
}

