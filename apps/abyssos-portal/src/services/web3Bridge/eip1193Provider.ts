/**
 * EIP-1193 Compliant Provider
 * 
 * Implements the Ethereum Provider JavaScript API (EIP-1193)
 * for compatibility with standard Web3 dApps.
 * 
 * @see https://eips.ethereum.org/EIPS/eip-1193
 */

export const EIP1193_PROVIDER_SCRIPT = `
(function() {
  // Skip if already injected
  if (typeof window.ethereum !== 'undefined' && window.ethereum.isAbyss) {
    return;
  }

  // ============================================================================
  // Configuration
  // ============================================================================
  
  const CHAIN_CONFIG = {
    chainId: '0x44454D49', // 'DEMI' in hex
    chainName: 'Demiurge Network',
    nativeCurrency: {
      name: 'Creator God Token',
      symbol: 'CGT',
      decimals: 8,
    },
    rpcUrls: ['https://rpc.demiurge.cloud/rpc'],
    blockExplorerUrls: ['https://explorer.demiurge.cloud'],
  };

  // ============================================================================
  // Event Emitter
  // ============================================================================
  
  class EventEmitter {
    constructor() {
      this._events = new Map();
    }

    on(event, listener) {
      if (!this._events.has(event)) {
        this._events.set(event, []);
      }
      this._events.get(event).push(listener);
      return this;
    }

    once(event, listener) {
      const onceWrapper = (...args) => {
        listener(...args);
        this.removeListener(event, onceWrapper);
      };
      return this.on(event, onceWrapper);
    }

    emit(event, ...args) {
      const listeners = this._events.get(event);
      if (listeners) {
        listeners.forEach(listener => {
          try {
            listener(...args);
          } catch (e) {
            console.error('Event listener error:', e);
          }
        });
      }
      return this;
    }

    removeListener(event, listener) {
      const listeners = this._events.get(event);
      if (listeners) {
        const index = listeners.indexOf(listener);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
      return this;
    }

    removeAllListeners(event) {
      if (event) {
        this._events.delete(event);
      } else {
        this._events.clear();
      }
      return this;
    }
  }

  // ============================================================================
  // Request Handler
  // ============================================================================
  
  let requestIdCounter = 0;
  const pendingRequests = new Map();

  function sendToParent(action, payload) {
    return new Promise((resolve, reject) => {
      const requestId = ++requestIdCounter;
      const request = {
        type: 'ABYSS_REQUEST',
        action,
        payload,
        requestId,
      };

      pendingRequests.set(requestId, { resolve, reject });
      window.parent.postMessage(request, '*');

      // Timeout
      setTimeout(() => {
        if (pendingRequests.has(requestId)) {
          pendingRequests.delete(requestId);
          reject(new ProviderRpcError(4100, 'Request timeout'));
        }
      }, 60000);
    });
  }

  // Listen for responses
  window.addEventListener('message', (event) => {
    if (event.data?.type === 'ABYSS_RESPONSE') {
      const { requestId, payload, error } = event.data;
      const pending = pendingRequests.get(requestId);
      
      if (pending) {
        pendingRequests.delete(requestId);
        if (error) {
          pending.reject(new ProviderRpcError(4100, error));
        } else {
          pending.resolve(payload);
        }
      }
    }
  });

  // ============================================================================
  // Provider RPC Error (EIP-1193)
  // ============================================================================
  
  class ProviderRpcError extends Error {
    constructor(code, message, data) {
      super(message);
      this.code = code;
      this.data = data;
      this.name = 'ProviderRpcError';
    }
  }

  // Standard error codes
  const RPC_ERRORS = {
    PARSE_ERROR: { code: -32700, message: 'Parse error' },
    INVALID_REQUEST: { code: -32600, message: 'Invalid request' },
    METHOD_NOT_FOUND: { code: -32601, message: 'Method not found' },
    INVALID_PARAMS: { code: -32602, message: 'Invalid params' },
    INTERNAL_ERROR: { code: -32603, message: 'Internal error' },
    USER_REJECTED: { code: 4001, message: 'User rejected the request' },
    UNAUTHORIZED: { code: 4100, message: 'Unauthorized' },
    UNSUPPORTED_METHOD: { code: 4200, message: 'Unsupported method' },
    DISCONNECTED: { code: 4900, message: 'Disconnected' },
    CHAIN_DISCONNECTED: { code: 4901, message: 'Chain disconnected' },
  };

  // ============================================================================
  // Provider State
  // ============================================================================
  
  let accounts = [];
  let chainId = CHAIN_CONFIG.chainId;
  let isConnected = false;

  // ============================================================================
  // EIP-1193 Provider
  // ============================================================================
  
  const provider = new EventEmitter();

  // Provider properties
  provider.isAbyss = true;
  provider.isMetaMask = false; // Some dApps check this
  provider.chainId = chainId;
  provider.networkVersion = parseInt(chainId, 16).toString();
  provider.selectedAddress = null;

  /**
   * EIP-1193 request method
   * The primary JSON-RPC request method
   */
  provider.request = async function({ method, params = [] }) {
    console.log('[Abyss Provider]', method, params);

    try {
      switch (method) {
        // ====================================================================
        // Connection Methods
        // ====================================================================
        
        case 'eth_requestAccounts':
        case 'eth_accounts': {
          if (accounts.length === 0) {
            // Request connection through Abyss
            const identity = await sendToParent('IDENTITY');
            if (identity?.sessionPublicKey) {
              // Convert to Ethereum-style address (take first 20 bytes)
              const abyssKey = identity.sessionPublicKey;
              const ethAddress = '0x' + abyssKey.slice(0, 40).toLowerCase();
              accounts = [ethAddress];
              provider.selectedAddress = ethAddress;
              isConnected = true;
              provider.emit('connect', { chainId });
              provider.emit('accountsChanged', accounts);
            }
          }
          return accounts;
        }

        // ====================================================================
        // Chain Methods
        // ====================================================================
        
        case 'eth_chainId':
          return chainId;

        case 'net_version':
          return parseInt(chainId, 16).toString();

        case 'wallet_switchEthereumChain': {
          const requestedChainId = params[0]?.chainId;
          if (requestedChainId !== chainId) {
            throw new ProviderRpcError(
              4902,
              'Unrecognized chain ID. Abyss Explorer only supports Demiurge Network.'
            );
          }
          return null;
        }

        case 'wallet_addEthereumChain': {
          // Accept if it's our chain
          const chain = params[0];
          if (chain?.chainId === chainId) {
            return null;
          }
          throw new ProviderRpcError(4200, 'Cannot add external chains');
        }

        // ====================================================================
        // Signing Methods
        // ====================================================================
        
        case 'eth_sign':
        case 'personal_sign': {
          const message = method === 'eth_sign' ? params[1] : params[0];
          const result = await sendToParent('SIGN_MESSAGE', { message });
          return result?.signature || '0x';
        }

        case 'eth_signTypedData':
        case 'eth_signTypedData_v3':
        case 'eth_signTypedData_v4': {
          const typedData = typeof params[1] === 'string' ? JSON.parse(params[1]) : params[1];
          const result = await sendToParent('SIGN_MESSAGE', { 
            message: JSON.stringify(typedData),
            type: 'typed_data'
          });
          return result?.signature || '0x';
        }

        // ====================================================================
        // Transaction Methods
        // ====================================================================
        
        case 'eth_sendTransaction': {
          const tx = params[0];
          const result = await sendToParent('SEND_TRANSACTION', { transaction: tx });
          return result?.txHash || '0x';
        }

        case 'eth_getTransactionReceipt': {
          // Query from RPC
          const response = await fetch(CHAIN_CONFIG.rpcUrls[0], {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'eth_getTransactionReceipt',
              params,
              id: 1,
            }),
          });
          const data = await response.json();
          return data.result;
        }

        // ====================================================================
        // Block & Balance Methods
        // ====================================================================
        
        case 'eth_blockNumber': {
          const status = await sendToParent('CHAIN_STATUS');
          return '0x' + (status?.height || 0).toString(16);
        }

        case 'eth_getBalance': {
          const address = params[0];
          const response = await fetch(CHAIN_CONFIG.rpcUrls[0], {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'cgt_getBalance',
              params: { address: address.replace('0x', '') },
              id: 1,
            }),
          });
          const data = await response.json();
          const balance = data.result?.balance || '0';
          return '0x' + BigInt(balance).toString(16);
        }

        case 'eth_getBlockByNumber':
        case 'eth_getBlockByHash':
        case 'eth_call':
        case 'eth_estimateGas':
        case 'eth_gasPrice': {
          // Proxy to RPC
          const response = await fetch(CHAIN_CONFIG.rpcUrls[0], {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method,
              params,
              id: 1,
            }),
          });
          const data = await response.json();
          if (data.error) {
            throw new ProviderRpcError(data.error.code, data.error.message);
          }
          return data.result;
        }

        // ====================================================================
        // Wallet Methods
        // ====================================================================
        
        case 'wallet_requestPermissions': {
          const result = await sendToParent('REQUEST_PERMISSIONS', { 
            permissions: params[0] 
          });
          return result?.permissions || [];
        }

        case 'wallet_getPermissions': {
          return [{ parentCapability: 'eth_accounts' }];
        }

        // ====================================================================
        // Unsupported Methods
        // ====================================================================
        
        default:
          console.warn('[Abyss Provider] Unsupported method:', method);
          throw new ProviderRpcError(
            RPC_ERRORS.METHOD_NOT_FOUND.code,
            \`Method \${method} not supported\`
          );
      }
    } catch (error) {
      if (error instanceof ProviderRpcError) {
        throw error;
      }
      throw new ProviderRpcError(
        RPC_ERRORS.INTERNAL_ERROR.code,
        error.message || 'Unknown error'
      );
    }
  };

  // Legacy methods (deprecated but still used by some dApps)
  provider.enable = async function() {
    return provider.request({ method: 'eth_requestAccounts' });
  };

  provider.send = function(methodOrPayload, paramsOrCallback) {
    // Handle different call signatures
    if (typeof methodOrPayload === 'string') {
      return provider.request({ method: methodOrPayload, params: paramsOrCallback || [] });
    }
    
    // Legacy format with callback
    if (typeof paramsOrCallback === 'function') {
      provider.request(methodOrPayload)
        .then(result => paramsOrCallback(null, { result }))
        .catch(error => paramsOrCallback(error, null));
      return;
    }

    return provider.request(methodOrPayload);
  };

  provider.sendAsync = function(payload, callback) {
    provider.request(payload)
      .then(result => callback(null, { id: payload.id, jsonrpc: '2.0', result }))
      .catch(error => callback(error, null));
  };

  // Connection status
  provider.isConnected = function() {
    return isConnected;
  };

  // ============================================================================
  // Expose Provider
  // ============================================================================
  
  // Set as window.ethereum
  Object.defineProperty(window, 'ethereum', {
    value: provider,
    writable: false,
    configurable: false,
  });

  // Also set on window.web3 for legacy support
  if (!window.web3) {
    window.web3 = { currentProvider: provider };
  }

  // Announce provider (EIP-6963)
  window.dispatchEvent(new CustomEvent('eip6963:announceProvider', {
    detail: {
      info: {
        uuid: 'abyss-explorer-' + Date.now(),
        name: 'Abyss Explorer',
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌊</text></svg>',
        rdns: 'cloud.demiurge.abyssexplorer',
      },
      provider,
    },
  }));

  console.log('[Abyss Provider] EIP-1193 provider injected');
})();
`;

/**
 * Combined injection script (Abyss API + EIP-1193)
 */
export const COMBINED_WEB3_INJECTION = `
${EIP1193_PROVIDER_SCRIPT}

// Also inject Abyss-specific API for extended functionality
(function() {
  if (typeof window.abyss !== 'undefined') return;

  window.abyss = {
    // Identity
    get address() { return window.ethereum?.selectedAddress; },
    chainId: 'demiurge-mainnet',
    
    // Standard methods (proxy to ethereum)
    requestPermissions: (p) => window.ethereum.request({ method: 'wallet_requestPermissions', params: [p] }),
    getAddress: () => window.ethereum.request({ method: 'eth_accounts' }).then(a => a[0]),
    signMessage: (msg) => window.ethereum.request({ method: 'personal_sign', params: [msg] }),
    sendTransaction: (tx) => window.ethereum.request({ method: 'eth_sendTransaction', params: [tx] }),
    
    // DRC-369 (Demiurge-specific)
    drc369: {
      list: async () => {
        const identity = await window.ethereum.request({ method: 'eth_accounts' });
        if (!identity[0]) return [];
        const response = await fetch('https://rpc.demiurge.cloud/rpc', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'drc369_getByOwner',
            params: { owner: identity[0].replace('0x', '') },
            id: 1,
          }),
        });
        const data = await response.json();
        return data.result?.assets || [];
      },
      mint: async (asset) => {
        return window.parent.postMessage({
          type: 'ABYSS_REQUEST',
          action: 'MINT_DRC369',
          payload: { asset },
        }, '*');
      },
    },
    
    // Chain status
    getChainStatus: async () => {
      const height = await window.ethereum.request({ method: 'eth_blockNumber' });
      return { connected: true, height: parseInt(height, 16) };
    },
    
    // Events
    on: (event, handler) => window.ethereum.on(event, handler),
    off: (event, handler) => window.ethereum.removeListener(event, handler),
  };

  console.log('[Abyss API] Extended API injected');
})();
`;
