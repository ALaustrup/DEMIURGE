/**
 * QorID SDK - DRC-369 Extension
 * 
 * Provides DRC-369 asset management methods for the QorID SDK.
 * 
 * Supports both local (localStorage) and remote (backend API) modes.
 * 
 * Storage keys (local mode only):
 * - abyssos.drc369.published - Native Demiurge DRC-369 assets
 * - abyssos.drc369.imported - External chain assets (bridge-wrapped)
 * 
 * NOTE: In remote mode, all operations call the backend API.
 * In local mode, operations use localStorage.
 */

import type { DRC369 } from "../drc369/schema";

// Configuration
const config = {
  mode: (import.meta.env.VITE_QORID_MODE === 'remote' ? 'remote' : 'local') as 'local' | 'remote',
  apiBaseUrl: import.meta.env.VITE_QORID_API_URL || 'https://demiurge.cloud/api/abyssid',
};

// Helper to get session ID for API calls
function getSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('abyssos.abyssid.sessionId');
}

// Remote API helpers
async function remoteApiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const sessionId = getSessionId();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  
  if (sessionId) {
    headers['Authorization'] = `Bearer ${sessionId}`;
  }

  const response = await fetch(`${config.apiBaseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
    throw new Error(error.error?.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export interface DRC369Query {
  owner?: string;              // QorID or wallet (for local mode)
  username?: string;            // Username (for remote mode)
  chain?: string;
  standard?: string;
  limit?: number;
}

export interface PublishNativeInput {
  uri: string;
  contentType: string;
  attributes?: Record<string, string | number>;
  owner?: string;
  name?: string;
  description?: string;
  priceCgt?: number;
}

export interface ImportExternalInput {
  chain: string;
  contractOrMint: string;
  tokenId?: string;
  owner?: string;
}

export interface MusicMetadata {
  trackNumber?: number;
  trackName: string;
  albumName?: string;
  artistName: string;
  genre?: string;
  releaseDate?: string;
  duration: number;
  fractal1Hash?: string;
  beatmapHash?: string;
  segmentRoot?: string;
}

const STORAGE_KEY_PUBLISHED = "abyssos.drc369.published";
const STORAGE_KEY_IMPORTED = "abyssos.drc369.imported";
// const STORAGE_KEY_DRAFTS = "abyssos.drc369.drafts"; // Reserved for future drafts feature

function loadPublished(): DRC369[] {
  try {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(STORAGE_KEY_PUBLISHED);
    return raw ? (JSON.parse(raw) as DRC369[]) : [];
  } catch {
    return [];
  }
}

function savePublished(items: DRC369[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_PUBLISHED, JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save published DRC-369 assets:", error);
  }
}

function loadImported(): DRC369[] {
  try {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(STORAGE_KEY_IMPORTED);
    return raw ? (JSON.parse(raw) as DRC369[]) : [];
  } catch {
    return [];
  }
}

function saveImported(items: DRC369[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_IMPORTED, JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save imported DRC-369 assets:", error);
  }
}

/**
 * Get all DRC-369 assets (published + imported)
 */
function loadAllDRC369(): DRC369[] {
  return [...loadPublished(), ...loadImported()];
}

// Type for backend API response
interface BackendDRC369Asset {
  id: string;
  chain: string;
  standard: string;
  owner: number;
  name: string | null;
  description: string | null;
  uri: string | null;
  contentType: string | null;
  bridgeWrapped: boolean;
  attributes: Record<string, any>;
  createdAt: string;
  onChain?: boolean;
  txHash?: string;
  blockHeight?: number;
}

export const drc369Api = {
  /**
   * Query DRC-369 assets by owner, chain, or standard
   */
  async getOwned(query?: DRC369Query): Promise<DRC369[]> {
    if (config.mode === 'remote' && config.apiBaseUrl) {
      try {
        const params = new URLSearchParams();
        if (query?.username) params.append('username', query.username);
        if (query?.chain) params.append('chain', query.chain);
        if (query?.standard) params.append('standard', query.standard);
        if (query?.limit) params.append('limit', query.limit.toString());
        
        const assets = await remoteApiRequest<BackendDRC369Asset[]>(`/drc369/assets/owned?${params.toString()}`);
        
        // Convert backend format to DRC369
        return assets.map(asset => ({
          id: asset.id,
          chain: asset.chain as any,
          standard: asset.standard as any,
          owner: asset.owner.toString(), // Convert to string
          uri: asset.uri || '',
          contentType: asset.contentType as any,
          bridgeWrapped: asset.bridgeWrapped,
          attributes: asset.attributes,
          name: asset.name ?? undefined,
          description: asset.description ?? undefined,
          onChain: asset.onChain ?? false,
          txHash: asset.txHash,
          blockHeight: asset.blockHeight,
        }));
      } catch (error) {
        console.warn('Failed to fetch owned assets from backend, falling back to local:', error);
        // Fall through to local mode
      }
    }
    
    // Local mode
    const all = loadAllDRC369();
    if (!query) return all;
    
    let filtered = all;
    
    if (query.owner) {
      filtered = filtered.filter((item) => item.owner === query.owner);
    }
    if (query.chain) {
      filtered = filtered.filter((item) => item.chain === query.chain);
    }
    if (query.standard) {
      filtered = filtered.filter((item) => item.standard === query.standard);
    }
    
    if (query.limit) {
      filtered = filtered.slice(0, query.limit);
    }
    
    return filtered;
  },

  /**
   * Import an external NFT as a DRC-369 asset
   */
  async importExternal(input: ImportExternalInput): Promise<DRC369> {
    if (config.mode === 'remote' && config.apiBaseUrl) {
      try {
        const asset = await remoteApiRequest<BackendDRC369Asset>('/drc369/assets/import', {
          method: 'POST',
          body: JSON.stringify({
            originChain: input.chain,
            standard: 'ERC-721', // Default, can be refined
            externalId: `${input.contractOrMint}:${input.tokenId ?? '0'}`,
            metadata: {},
            rawPayload: {},
          }),
        });
        
        return {
          id: asset.id,
          chain: asset.chain as any,
          standard: asset.standard as any,
          owner: asset.owner.toString(),
          uri: asset.uri || '',
          contentType: asset.contentType as any,
          bridgeWrapped: asset.bridgeWrapped,
          originalChain: input.chain,
          originalContract: input.contractOrMint,
          originalTokenId: input.tokenId ?? '0',
          attributes: asset.attributes,
          name: asset.name ?? undefined,
          description: asset.description ?? undefined,
        };
      } catch (error) {
        console.warn('Failed to import asset via backend, falling back to local:', error);
        // Fall through to local mode
      }
    }
    
    // Local mode
    const items = loadImported();
    const id = `external:${input.chain}:${input.contractOrMint}:${input.tokenId ?? "0"}`;
    
    // Check if already imported
    const existing = items.find((item) => item.id === id);
    if (existing) {
      return existing;
    }
    
    const drc: DRC369 = {
      id,
      chain: input.chain as any,
      standard: "DRC-369",
      owner: input.owner || "external-owner",
      uri: "https://example.com/external-nft.json",
      contentType: "image",
      bridgeWrapped: true,
      originalChain: input.chain,
      originalContract: input.contractOrMint,
      originalTokenId: input.tokenId ?? "0",
      attributes: {
        source: "local-mock-import",
      },
    };
    
    items.push(drc);
    saveImported(items);
    return drc;
  },

  /**
   * Publish a native Demiurge DRC-369 asset
   */
  async publishNative(input: PublishNativeInput): Promise<DRC369> {
    if (config.mode === 'remote' && config.apiBaseUrl) {
      try {
        const asset = await remoteApiRequest<BackendDRC369Asset>('/drc369/assets/native', {
          method: 'POST',
          body: JSON.stringify({
            name: input.name || 'Untitled',
            description: input.description,
            uri: input.uri,
            contentType: input.contentType,
            originChain: 'DEMIURGE',
            standard: 'DRC-369',
            metadata: {
              ...(input.attributes || {}),
              ...(input.priceCgt && { priceCgt: input.priceCgt }),
            },
          }),
        });
        
        return {
          id: asset.id,
          chain: asset.chain as any,
          standard: asset.standard as any,
          owner: asset.owner.toString(),
          uri: asset.uri || '',
          contentType: asset.contentType as any,
          bridgeWrapped: asset.bridgeWrapped,
          attributes: asset.attributes,
          name: asset.name ?? undefined,
          description: asset.description ?? undefined,
          priceCgt: asset.attributes.priceCgt,
          createdAt: asset.createdAt,
          onChain: asset.onChain ?? false,
          txHash: asset.txHash,
          blockHeight: asset.blockHeight,
        };
      } catch (error) {
        console.warn('Failed to publish asset via backend, falling back to local:', error);
        // Fall through to local mode
      }
    }
    
    // Local mode
    const items = loadPublished();
    const id = `native:${Date.now()}`;
    
    const drc: DRC369 = {
      id,
      chain: "DEMIURGE",
      standard: "DRC-369",
      owner: input.owner || "abyssid-local",
      uri: input.uri,
      contentType: (input.contentType as any) ?? "other",
      attributes: {
        ...(input.attributes || {}),
        ...(input.name && { name: input.name }),
        ...(input.description && { description: input.description }),
      },
      name: input.name,
      description: input.description,
      priceCgt: input.priceCgt,
      createdAt: new Date().toISOString(),
    };
    
    items.push(drc);
    savePublished(items);
    return drc;
  },

  /**
   * Get all public DRC-369 assets (for Network tab)
   */
  async getPublic(query?: { chain?: string; standard?: string; limit?: number }): Promise<DRC369[]> {
    if (config.mode === 'remote' && config.apiBaseUrl) {
      try {
        const params = new URLSearchParams();
        if (query?.chain) params.append('chain', query.chain);
        if (query?.standard) params.append('standard', query.standard);
        if (query?.limit) params.append('limit', query.limit.toString());
        
        const assets = await remoteApiRequest<BackendDRC369Asset[]>(`/drc369/assets/network?${params.toString()}`);
        
        // Convert backend format to DRC369
        return assets.map(asset => ({
          id: asset.id,
          chain: asset.chain as any,
          standard: asset.standard as any,
          owner: asset.owner.toString(),
          uri: asset.uri || '',
          contentType: asset.contentType as any,
          bridgeWrapped: asset.bridgeWrapped,
          attributes: asset.attributes,
          name: asset.name ?? undefined,
          description: asset.description ?? undefined,
        }));
      } catch (error) {
        console.warn('Failed to fetch public assets from backend, falling back to local:', error);
        // Fall through to local mode
      }
    }
    
    // Local mode
    const all = loadAllDRC369();
    
    let filtered = all;
    
    if (query?.chain) {
      filtered = filtered.filter((item) => item.chain === query.chain);
    }
    if (query?.standard) {
      filtered = filtered.filter((item) => item.standard === query.standard);
    }
    
    if (query?.limit) {
      filtered = filtered.slice(0, query.limit);
    }
    
    return filtered;
  },

  /**
   * Mint a Music NFT with Fractal-1 encoded audio
   */
  async mintMusicNFT(metadata: MusicMetadata, fractal1Data: Uint8Array): Promise<DRC369> {
    // Calculate hashes
    const fractal1Hash = await this.hashUint8Array(fractal1Data);
    
    // Extract beatmap hash from fractal1 data if available
    const beatmapHash = metadata.beatmapHash || '';
    const segmentRoot = metadata.segmentRoot || '';
    
    const musicInput: PublishNativeInput = {
      uri: `fractal1://${fractal1Hash}`,
      contentType: 'audio',
      name: metadata.trackName,
      description: `${metadata.artistName} - ${metadata.albumName || 'Single'}`,
      attributes: {
        ...metadata,
        fractal1Hash,
        beatmapHash,
        segmentRoot,
      },
    };
    
    const asset = await this.publishNative(musicInput);
    
    // Add music-specific fields
    return {
      ...asset,
      music: {
        trackNumber: metadata.trackNumber,
        trackName: metadata.trackName,
        albumName: metadata.albumName,
        artistName: metadata.artistName,
        genre: metadata.genre,
        releaseDate: metadata.releaseDate,
        duration: metadata.duration,
        fractal1Hash,
        beatmapHash,
        segmentRoot,
      },
    };
  },

  /**
   * Hash Uint8Array using SHA-256
   */
  async hashUint8Array(data: Uint8Array): Promise<string> {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data as BufferSource);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },
};

/**
 * Migrate old DemiNFT localStorage data to DRC-369 format
 */
export function migrateOldDemiNFTData(): void {
  if (typeof window === "undefined") return;
  
  try {
    const oldKey = "demi_nft_assets";
    const old = localStorage.getItem(oldKey);
    if (!old) return;
    
    const parsed = JSON.parse(old);
    const existing = loadAllDRC369();
    
    // Convert old format to DRC369 if needed
    if (Array.isArray(parsed)) {
      const migrated: DRC369[] = parsed.map((item: any) => {
        if (item.id && item.chain) {
          return item as DRC369;
        }
        // Convert legacy format
        return {
          id: item.id || `legacy:${Date.now()}`,
          chain: "DEMIURGE",
          standard: "DRC-369",
          owner: item.owner || "unknown",
          uri: item.uri || item.mediaUrl || "",
          contentType: "other",
          name: item.name,
          description: item.description,
          attributes: item.attributes || {},
        };
      });
      
      // Merge with existing, avoiding duplicates
      const allIds = new Set(existing.map((item) => item.id));
      const newItems = migrated.filter((item) => !allIds.has(item.id));
      
      if (newItems.length > 0) {
        savePublished([...loadPublished(), ...newItems]);
        localStorage.removeItem(oldKey);
        console.log(`Migrated ${newItems.length} legacy NFT items to DRC-369`);
      }
    }
  } catch (error) {
    console.warn("Failed to migrate old DemiNFT data:", error);
  }
}
