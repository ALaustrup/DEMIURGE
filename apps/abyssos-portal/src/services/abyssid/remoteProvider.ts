import type { AbyssIDProvider, AbyssIDSession } from './types';

const STORAGE_KEY_SESSION_ID = 'abyssos.abyssid.sessionId';

interface AbyssIdConfig {
  mode: 'local' | 'remote';
  apiBaseUrl?: string;
}

const config: AbyssIdConfig = {
  mode: (import.meta.env.VITE_ABYSSID_MODE === 'remote' ? 'remote' : 'local') as 'local' | 'remote',
  apiBaseUrl: import.meta.env.VITE_ABYSSID_API_URL || 'https://demiurge.cloud/api/abyssid',
};

interface SessionInitResponse {
  challengeId: string;
  challenge: string;
  expiresAt: string;
}

interface SessionConfirmResponse {
  sessionId: string;
  user: {
    id: number;
    username: string;
    publicKey: string;
    avatarUrl: string | null;
    displayName: string | null;
  };
}

interface UserProfile {
  id: number;
  username: string;
  publicKey: string;
  avatarUrl: string | null;
  displayName: string | null;
  createdAt: string;
  lastLoginAt: string | null;
  keys: Array<{ publicKey: string; label: string | null }>;
  stats: {
    assetCount: number;
  };
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  if (!config.apiBaseUrl) {
    throw new Error('AbyssID API URL not configured');
  }

  const response = await fetch(`${config.apiBaseUrl}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
    throw new Error(error.error?.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export const remoteAbyssIDProvider: AbyssIDProvider = {
  async getSession(): Promise<AbyssIDSession | null> {
    try {
      const sessionId = localStorage.getItem(STORAGE_KEY_SESSION_ID);
      if (!sessionId) {
        return null;
      }

      // Verify session is still valid by calling /me
      const profile = await apiRequest<UserProfile>('/me', {
        headers: {
          Authorization: `Bearer ${sessionId}`,
        },
      });

      return {
        username: profile.username,
        publicKey: profile.publicKey,
      };
    } catch (error) {
      // Session invalid or expired, clear it
      localStorage.removeItem(STORAGE_KEY_SESSION_ID);
      console.warn('Failed to restore session:', error);
      return null;
    }
  },

  async login(username?: string, secret?: string): Promise<AbyssIDSession> {
    if (!username) {
      // Try to restore existing session
      const existing = await this.getSession();
      if (existing) {
        return existing;
      }
      throw new Error('No username provided and no existing session');
    }

    // Step 1: Initialize session (get challenge)
    const initResponse = await apiRequest<SessionInitResponse>('/session/init', {
      method: 'POST',
      body: JSON.stringify({ username }),
    });

    // Step 2: Sign challenge (for now, use mock signature)
    // TODO: Use real cryptographic signature
    const message = `${username}:${initResponse.challenge}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    // Step 3: Confirm session
    const confirmResponse = await apiRequest<SessionConfirmResponse>('/session/confirm', {
      method: 'POST',
      body: JSON.stringify({
        challengeId: initResponse.challengeId,
        username,
        publicKey: '0x' + signature.substring(0, 64), // Mock public key
        signature,
      }),
    });

    // Store session ID
    localStorage.setItem(STORAGE_KEY_SESSION_ID, confirmResponse.sessionId);

    return {
      username: confirmResponse.user.username,
      publicKey: confirmResponse.user.publicKey,
    };
  },

  async logout(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY_SESSION_ID);
  },

  async signMessage(message: Uint8Array | string): Promise<string> {
    const session = await this.getSession();
    if (!session) {
      throw new Error('No active session');
    }

    // For now, return mock signature
    // TODO: Use real cryptographic signature with user's keypair
    const msgStr = typeof message === 'string' ? message : new TextDecoder().decode(message);
    const encoder = new TextEncoder();
    const data = encoder.encode(`${session.username}:${msgStr}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  },
};

