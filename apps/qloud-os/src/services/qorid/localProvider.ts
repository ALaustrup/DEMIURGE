import type { QorIDProvider, QorIDSession } from './types';
import { qorIdClient } from '../../lib/qorIdClient';

const STORAGE_KEY_SESSION = 'abyssid_session';

// Simple deterministic signature for mock purposes
async function mockSignMessage(message: Uint8Array | string): Promise<string> {
  const msgStr = typeof message === 'string' ? message : new TextDecoder().decode(message);
  const encoder = new TextEncoder();
  const data = encoder.encode(msgStr);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const localQorIDProvider: QorIDProvider = {
  async getSession(): Promise<QorIDSession | null> {
    try {
      const sessionData = localStorage.getItem(STORAGE_KEY_SESSION);
      if (sessionData) {
        return JSON.parse(sessionData) as QorIDSession;
      }

      // Fallback to existing auth system
      const account = await qorIdClient.getCurrentAccount();
      if (account) {
        const session: QorIDSession = {
          username: account.username,
          publicKey: account.publicKey,
        };
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
        return session;
      }

      return null;
    } catch {
      return null;
    }
  },

  async login(username?: string, secret?: string): Promise<QorIDSession> {
    // If secret is provided, try to login with secret
    if (secret) {
      const account = await qorIdClient.loginWithSecret(secret);
      if (account) {
        const session: QorIDSession = {
          username: account.username,
          publicKey: account.publicKey,
        };
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
        return session;
      }
      throw new Error('Invalid secret code');
    }

    if (username) {
      // Normalize username to lowercase
      const normalizedUsername = username.toLowerCase();
      // Try to get existing account
      const accounts = qorIdClient.getAllAccounts();
      const account = accounts[normalizedUsername];

      if (account) {
        const session: QorIDSession = {
          username: account.username,
          publicKey: account.publicKey,
        };
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
        return session;
      }

      throw new Error('Account not found. Please sign up first.');
    }

    // If no username, try to get existing session
    const existing = await this.getSession();
    if (existing) {
      return existing;
    }

    throw new Error('No username or secret provided and no existing session');
  },

  async logout(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY_SESSION);
    await qorIdClient.logout();
  },

  async signMessage(message: Uint8Array | string): Promise<string> {
    const session = await this.getSession();
    if (!session) {
      throw new Error('No active session');
    }

    // For now, return mock signature
    // In production, this would use the actual keypair
    const signature = await mockSignMessage(message);
    return signature;
  },
};

