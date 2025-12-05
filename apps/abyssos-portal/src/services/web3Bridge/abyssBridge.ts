/**
 * AbyssOS Web3 Bridge
 * 
 * Provides postMessage-based communication between AbyssBrowser
 * and embedded Web3-aware dApps.
 */

export interface AbyssRequest {
  type: 'ABYSS_REQUEST';
  action: 'IDENTITY' | 'SIGN_MESSAGE' | 'CHAIN_STATUS' | 'REQUEST_PERMISSIONS' | 'SEND_TRANSACTION' | 'GET_DRC369_OWNED' | 'MINT_DRC369';
  payload?: any;
  requestId?: number | string;
}

export interface AbyssResponse {
  type: 'ABYSS_RESPONSE';
  action: string;
  payload?: any;
  error?: string;
  devMode?: boolean;
  requestId?: number | string;
}

export interface AbyssIdentity {
  username: string;
  abyssId: string;
  sessionPublicKey: string;
}

export interface AbyssChainStatus {
  connected: boolean;
  chainId?: string;
  height?: number;
}

/**
 * Listens for ABYSS_REQUEST messages from iframe content
 * and responds with appropriate AbyssOS context.
 */
export class AbyssBridge {
  private session: { username: string; publicKey: string } | null = null;
  private chainStatus: { status: string; info: any } | null = null;
  private signMessageFn: ((message: string) => Promise<string>) | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('message', this.handleMessage.bind(this));
    }
  }

  setSession(session: { username: string; publicKey: string } | null) {
    this.session = session;
  }

  setChainStatus(status: { status: string; info: any } | null) {
    this.chainStatus = status;
  }

  setSignMessageFn(fn: (message: string) => Promise<string>) {
    this.signMessageFn = fn;
  }

  private async handleMessage(event: MessageEvent) {
    // Security: Only accept messages from same origin or trusted sources
    // In production, you might want to validate event.origin
    if (event.data?.type !== 'ABYSS_REQUEST') {
      return;
    }

    const request = event.data as AbyssRequest;
    let response: AbyssResponse;

    try {
      switch (request.action) {
        case 'IDENTITY':
          response = await this.handleIdentityRequest();
          break;
        case 'SIGN_MESSAGE':
          response = await this.handleSignMessageRequest(request.payload);
          break;
        case 'CHAIN_STATUS':
          response = this.handleChainStatusRequest();
          break;
        case 'REQUEST_PERMISSIONS':
          response = await this.handleRequestPermissions(event.origin, request.payload);
          break;
        case 'SEND_TRANSACTION':
          response = await this.handleSendTransaction(request.payload);
          break;
        case 'GET_DRC369_OWNED':
          response = await this.handleGetDrc369Owned();
          break;
        case 'MINT_DRC369':
          response = await this.handleMintDrc369(request.payload);
          break;
        default:
          response = {
            type: 'ABYSS_RESPONSE',
            action: request.action,
            error: `Unknown action: ${request.action}`,
          };
      }
    } catch (error) {
      response = {
        type: 'ABYSS_RESPONSE',
        action: request.action,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }

    // Include requestId in response
    response.requestId = request.requestId;

    // Send response back to iframe
    if (event.source && 'postMessage' in event.source) {
      (event.source as Window).postMessage(response, event.origin);
    }
  }

  private async handleIdentityRequest(): Promise<AbyssResponse> {
    if (!this.session) {
      return {
        type: 'ABYSS_RESPONSE',
        action: 'IDENTITY',
        payload: null,
      };
    }

    return {
      type: 'ABYSS_RESPONSE',
      action: 'IDENTITY',
      payload: {
        username: this.session.username,
        abyssId: this.session.publicKey, // Placeholder for stable ID
        sessionPublicKey: this.session.publicKey,
      } as AbyssIdentity,
    };
  }

  private async handleSignMessageRequest(payload: any): Promise<AbyssResponse> {
    if (!this.session || !this.signMessageFn) {
      return {
        type: 'ABYSS_RESPONSE',
        action: 'SIGN_MESSAGE',
        error: 'Not authenticated',
      };
    }

    const message = payload?.message;
    if (!message || typeof message !== 'string') {
      return {
        type: 'ABYSS_RESPONSE',
        action: 'SIGN_MESSAGE',
        error: 'Invalid message',
      };
    }

    try {
      const signature = await this.signMessageFn(message);
      return {
        type: 'ABYSS_RESPONSE',
        action: 'SIGN_MESSAGE',
        payload: {
          signature,
          algo: 'mock-sha256', // Placeholder
          devMode: true,
        },
      };
    } catch (error) {
      return {
        type: 'ABYSS_RESPONSE',
        action: 'SIGN_MESSAGE',
        error: error instanceof Error ? error.message : 'Signing failed',
      };
    }
  }

  private handleChainStatusRequest(): AbyssResponse {
    return {
      type: 'ABYSS_RESPONSE',
      action: 'CHAIN_STATUS',
      payload: {
        connected: this.chainStatus?.status === 'online',
        height: this.chainStatus?.info?.height,
      } as AbyssChainStatus,
    };
  }

  private async handleRequestPermissions(origin: string, payload: any): Promise<AbyssResponse> {
    const { permissions } = payload || {};
    
    // Import permissions system
    const { grantPermissions, hasPermission, extractDomain } = await import('./permissions');
    const domain = extractDomain(origin);
    
    // Check if already has permissions
    const hasAll = Array.isArray(permissions) && permissions.every((p: string) => hasPermission(domain, p as any));
    
    if (hasAll) {
      return {
        type: 'ABYSS_RESPONSE',
        action: 'REQUEST_PERMISSIONS',
        payload: { granted: true, permissions },
      };
    }
    
    // In a real implementation, show a permission modal
    // For now, auto-grant in dev mode
    if (Array.isArray(permissions)) {
      grantPermissions(domain, permissions);
    }
    
    return {
      type: 'ABYSS_RESPONSE',
      action: 'REQUEST_PERMISSIONS',
      payload: { granted: true, permissions },
    };
  }
  
  private async handleSendTransaction(payload: any): Promise<AbyssResponse> {
    if (!this.session || !this.signMessageFn) {
      return {
        type: 'ABYSS_RESPONSE',
        action: 'SEND_TRANSACTION',
        error: 'Not authenticated',
      };
    }
    
    // Import wallet service
    const { sendCgt } = await import('../wallet/demiurgeWallet');
    
    try {
      const { to, amount } = payload?.transaction || {};
      if (!to || !amount) {
        throw new Error('Invalid transaction: to and amount required');
      }
      
      const result = await sendCgt({
        from: this.session.publicKey,
        to,
        amount: parseFloat(amount),
      });
      
      return {
        type: 'ABYSS_RESPONSE',
        action: 'SEND_TRANSACTION',
        payload: { txHash: result.txHash },
      };
    } catch (error: any) {
      return {
        type: 'ABYSS_RESPONSE',
        action: 'SEND_TRANSACTION',
        error: error.message || 'Transaction failed',
      };
    }
  }
  
  private async handleGetDrc369Owned(): Promise<AbyssResponse> {
    if (!this.session) {
      return {
        type: 'ABYSS_RESPONSE',
        action: 'GET_DRC369_OWNED',
        payload: [],
      };
    }
    
    const { abyssIdSDK } = await import('../abyssid/sdk');
    const assets = await abyssIdSDK.drc369.getOwned({ owner: this.session.publicKey });
    
    return {
      type: 'ABYSS_RESPONSE',
      action: 'GET_DRC369_OWNED',
      payload: assets,
    };
  }
  
  private async handleMintDrc369(payload: any): Promise<AbyssResponse> {
    if (!this.session) {
      return {
        type: 'ABYSS_RESPONSE',
        action: 'MINT_DRC369',
        error: 'Not authenticated',
      };
    }
    
    const { abyssIdSDK } = await import('../abyssid/sdk');
    
    try {
      const asset = await abyssIdSDK.drc369.publishNative({
        uri: payload?.asset?.uri || '',
        contentType: payload?.asset?.contentType || 'other',
        owner: this.session.publicKey,
        name: payload?.asset?.name,
        description: payload?.asset?.description,
        attributes: payload?.asset?.attributes || {},
      });
      
      return {
        type: 'ABYSS_RESPONSE',
        action: 'MINT_DRC369',
        payload: asset,
      };
    } catch (error: any) {
      return {
        type: 'ABYSS_RESPONSE',
        action: 'MINT_DRC369',
        error: error.message || 'Mint failed',
      };
    }
  }
  
  destroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('message', this.handleMessage.bind(this));
    }
  }
}

// Singleton instance
let bridgeInstance: AbyssBridge | null = null;

export function getAbyssBridge(): AbyssBridge {
  if (!bridgeInstance) {
    bridgeInstance = new AbyssBridge();
  }
  return bridgeInstance;
}

