/**
 * Web3 Injection Script
 * 
 * Injects window.abyss and window.ethereum (EIP-1193) into iframe content
 */

// Re-export the combined injection for full EIP-1193 + Abyss support
export { COMBINED_WEB3_INJECTION as ABYSS_WEB3_INJECTION_SCRIPT } from './eip1193Provider';

// Legacy injection script (kept for reference)
export const ABYSS_LEGACY_INJECTION_SCRIPT = `
(function() {
  if (typeof window.abyss !== 'undefined') {
    return; // Already injected
  }

  let requestIdCounter = 0;
  const pendingRequests = new Map();

  // Send request to parent window
  function sendRequest(action, payload) {
    return new Promise((resolve, reject) => {
      const requestId = ++requestIdCounter;
      const request = {
        type: 'ABYSS_REQUEST',
        action,
        payload,
        requestId,
      };

      pendingRequests.set(requestId, { resolve, reject });

      // Send to parent
      window.parent.postMessage(request, '*');

      // Timeout after 30 seconds
      setTimeout(() => {
        if (pendingRequests.has(requestId)) {
          pendingRequests.delete(requestId);
          reject(new Error('Request timeout'));
        }
      }, 30000);
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
          pending.reject(new Error(error));
        } else {
          pending.resolve(payload);
        }
      }
    }
  });

  // Request permissions
  async function requestPermissions(permissions) {
    const result = await sendRequest('REQUEST_PERMISSIONS', { permissions });
    return result;
  }

  // Get wallet address
  async function getAddress() {
    const identity = await sendRequest('IDENTITY');
    return identity?.sessionPublicKey || null;
  }

  // Sign message
  async function signMessage(message) {
    const result = await sendRequest('SIGN_MESSAGE', { message });
    return result?.signature || null;
  }

  // Send transaction
  async function sendTransaction(transaction) {
    const result = await sendRequest('SEND_TRANSACTION', { transaction });
    return result;
  }

  // Get DRC-369 owned assets
  async function getDrc369Owned() {
    const result = await sendRequest('GET_DRC369_OWNED');
    return result || [];
  }

  // Mint DRC-369 asset
  async function mintDrc369(asset) {
    const result = await sendRequest('MINT_DRC369', { asset });
    return result;
  }

  // Get chain status
  async function getChainStatus() {
    const result = await sendRequest('CHAIN_STATUS');
    return result;
  }

  // Expose window.abyss API
  window.abyss = {
    // Identity
    address: null, // Will be populated on first access
    chainId: 'demiurge-devnet',
    
    // Methods
    requestPermissions,
    getAddress: async () => {
      if (!window.qor.address) {
        window.qor.address = await getAddress();
      }
      return window.qor.address;
    },
    signMessage,
    sendTransaction,
    
    // DRC-369
    drc369: {
      list: getDrc369Owned,
      mint: mintDrc369,
    },
    
    // Chain
    getChainStatus,
    
    // Events (stub for future)
    on: () => {},
    off: () => {},
  };

  // Initialize address
  getAddress().then(addr => {
    window.qor.address = addr;
  }).catch(() => {
    // Silent fail
  });
})();
`;
