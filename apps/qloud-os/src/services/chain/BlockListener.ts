/**
 * Real-Time Block Listener
 * 
 * WebSocket / long-poll fallback for live blockchain updates
 */

export interface BlockEvent {
  height: number;
  timestamp: number;
  hash?: string;
}

export interface TransactionEvent {
  hash: string;
  blockHeight: number;
  blockHash?: string;
}

export type BlockListenerCallback = (event: BlockEvent) => void;
export type TransactionListenerCallback = (event: TransactionEvent) => void;

class BlockListener {
  private ws: WebSocket | null = null;
  private pollInterval: ReturnType<typeof setInterval> | null = null;
  private lastBlockHeight: number = 0;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  
  private blockCallbacks: Set<BlockListenerCallback> = new Set();
  private txCallbacks: Set<TransactionListenerCallback> = new Set();
  
  private rpcUrl: string;
  private wsUrl: string;
  
  constructor() {
    this.rpcUrl = import.meta.env.VITE_DEMIURGE_RPC_URL || 'https://rpc.demiurge.cloud/rpc';
    this.wsUrl = this.rpcUrl.replace(/^https?:\/\//, 'wss://').replace(/\/rpc$/, '/ws');
  }
  
  /**
   * Start listening for blocks
   */
  start(): void {
    this.connectWebSocket();
  }
  
  /**
   * Stop listening
   */
  stop(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    this.isConnected = false;
  }
  
  /**
   * Subscribe to new block events
   */
  onBlock(callback: BlockListenerCallback): () => void {
    this.blockCallbacks.add(callback);
    return () => this.blockCallbacks.delete(callback);
  }
  
  /**
   * Subscribe to transaction confirmation events
   */
  onTransaction(callback: TransactionListenerCallback): () => void {
    this.txCallbacks.add(callback);
    return () => this.txCallbacks.delete(callback);
  }
  
  /**
   * Attempt WebSocket connection
   */
  private connectWebSocket(): void {
    try {
      this.ws = new WebSocket(this.wsUrl);
      
      this.ws.onopen = () => {
        console.log('[BlockListener] WebSocket connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        
        // Subscribe to new blocks
        this.ws?.send(JSON.stringify({
          method: 'subscribe',
          params: ['newBlock'],
          id: 1,
        }));
      };
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.method === 'newBlock') {
            const blockEvent: BlockEvent = {
              height: data.params.height || data.params.blockHeight,
              timestamp: data.params.timestamp || Date.now(),
              hash: data.params.hash || data.params.blockHash,
            };
            
            if (blockEvent.height > this.lastBlockHeight) {
              this.lastBlockHeight = blockEvent.height;
              this.blockCallbacks.forEach(cb => cb(blockEvent));
            }
          }
          
          if (data.method === 'transactionConfirmed') {
            const txEvent: TransactionEvent = {
              hash: data.params.hash || data.params.txHash,
              blockHeight: data.params.blockHeight || data.params.block,
              blockHash: data.params.blockHash,
            };
            this.txCallbacks.forEach(cb => cb(txEvent));
          }
        } catch (error) {
          console.error('[BlockListener] Failed to parse WebSocket message:', error);
        }
      };
      
      this.ws.onerror = (error) => {
        console.warn('[BlockListener] WebSocket error, falling back to polling:', error);
        this.fallbackToPolling();
      };
      
      this.ws.onclose = () => {
        this.isConnected = false;
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(`[BlockListener] WebSocket closed, reconnecting (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
          setTimeout(() => this.connectWebSocket(), 2000 * this.reconnectAttempts);
        } else {
          console.log('[BlockListener] Max reconnect attempts reached, falling back to polling');
          this.fallbackToPolling();
        }
      };
    } catch (error) {
      console.warn('[BlockListener] WebSocket not available, using polling:', error);
      this.fallbackToPolling();
    }
  }
  
  /**
   * Fallback to long-polling
   */
  private fallbackToPolling(): void {
    if (this.pollInterval) return;
    
    console.log('[BlockListener] Starting long-poll fallback');
    
    const poll = async () => {
      try {
        const response = await fetch(this.rpcUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'cgt_getChainInfo',
            params: [],
            id: Date.now(),
          }),
        });
        
        const json = await response.json();
        if (json.result?.height) {
          const currentHeight = json.result.height;
          
          if (currentHeight > this.lastBlockHeight) {
            const blockEvent: BlockEvent = {
              height: currentHeight,
              timestamp: Date.now(),
            };
            
            this.lastBlockHeight = currentHeight;
            this.blockCallbacks.forEach(cb => cb(blockEvent));
          }
        }
      } catch (error) {
        console.error('[BlockListener] Polling error:', error);
      }
    };
    
    // Initial poll
    poll();
    
    // Poll every 5 seconds
    this.pollInterval = setInterval(poll, 5000);
  }
  
  /**
   * Get current connection status
   */
  getStatus(): 'connected' | 'polling' | 'disconnected' {
    if (this.isConnected && this.ws?.readyState === WebSocket.OPEN) {
      return 'connected';
    }
    if (this.pollInterval) {
      return 'polling';
    }
    return 'disconnected';
  }
}

// Singleton instance
export const blockListener = new BlockListener();

