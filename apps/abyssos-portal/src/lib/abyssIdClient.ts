/**
 * AbyssID Client
 * 
 * Handles account creation, authentication, and key management.
 * Integrates with the secure vault for encrypted private key storage.
 */

import { vault, isVaultInitialized } from './vault';

export interface AbyssAccount {
  username: string;
  publicKey: string;
  /** @deprecated Secret is now stored in encrypted vault */
  abyssIdSecret?: string;
}

const STORAGE_KEY_ACCOUNTS = 'abyssos_accounts';
const STORAGE_KEY_AUTH = 'abyssos_auth';

/**
 * Generate a deterministic public key from a secret using SHA-256
 */
async function derivePublicKey(secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(secret.trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return `0x${hashHex.padStart(64, '0')}`;
}

/**
 * Synchronous fallback for public key derivation
 */
function derivePublicKeySync(secret: string): string {
  let hash = 0;
  const normalized = secret.trim();
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const absHash = Math.abs(hash);
  const hex = absHash.toString(16);
  let fullHash = hex;
  for (let i = 0; i < 3; i++) {
    const nextHash = ((absHash * (i + 1)) + hash).toString(16);
    fullHash += nextHash;
  }
  return `0x${fullHash.padStart(64, '0').slice(0, 64)}`;
}

/**
 * Generate a secure random secret code (24 characters)
 */
function generateSecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const randomValues = new Uint8Array(24);
    crypto.getRandomValues(randomValues);
    for (let i = 0; i < 24; i++) {
      result += chars[randomValues[i] % chars.length];
    }
  } else {
    for (let i = 0; i < 24; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }
  
  return result;
}

/**
 * Check if vault is available and unlocked
 */
async function isVaultReady(): Promise<boolean> {
  try {
    const initialized = await isVaultInitialized();
    return initialized && vault.isUnlocked();
  } catch {
    return false;
  }
}

export const abyssIdClient = {
  /**
   * Create a new AbyssID account
   * 
   * If vault is unlocked, stores the secret securely in the vault.
   * Otherwise, falls back to localStorage (less secure).
   */
  async signup(username: string, vaultPassword?: string): Promise<AbyssAccount> {
    const normalizedUsername = username.toLowerCase();

    if (normalizedUsername === 'taken') {
      throw new Error('Username is already taken');
    }

    const secret = generateSecret();
    const publicKey = await derivePublicKey(secret);

    const account: AbyssAccount = {
      username,
      publicKey,
    };

    // Store account metadata
    const accounts = this.getAllAccounts();
    accounts[normalizedUsername] = account;
    localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));

    // Try to store secret in vault if available
    const vaultReady = await isVaultReady();
    
    if (vaultReady) {
      // Store secret securely in vault
      try {
        await vault.addAccount(secret, publicKey.slice(2), normalizedUsername);
      } catch (error) {
        console.error('Failed to store secret in vault:', error);
        // Fall back to localStorage
        account.abyssIdSecret = secret;
        accounts[normalizedUsername] = account;
        localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
      }
    } else if (vaultPassword) {
      // Initialize vault with password and store
      try {
        const initialized = await isVaultInitialized();
        if (!initialized) {
          await vault.create(vaultPassword);
        } else {
          await vault.unlock(vaultPassword);
        }
        await vault.addAccount(secret, publicKey.slice(2), normalizedUsername);
      } catch (error) {
        console.error('Failed to initialize vault:', error);
        // Fall back to localStorage
        account.abyssIdSecret = secret;
        accounts[normalizedUsername] = account;
        localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
      }
    } else {
      // No vault available, store in localStorage (less secure)
      account.abyssIdSecret = secret;
      accounts[normalizedUsername] = account;
      localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
    }

    // Update secret map for fast lookups
    const secretMap = this.getSecretMap();
    secretMap[secret] = normalizedUsername;
    localStorage.setItem('abyssos_secret_map', JSON.stringify(secretMap));

    // Auto-login
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(account));

    return account;
  },

  /**
   * Login with username (public key optional verification)
   */
  async login(username: string, publicKey?: string): Promise<AbyssAccount | null> {
    const normalizedUsername = username.toLowerCase();
    const accounts = this.getAllAccounts();
    const account = accounts[normalizedUsername];

    if (!account) {
      return null;
    }

    if (publicKey && account.publicKey !== publicKey) {
      return null;
    }

    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(account));
    return account;
  },

  /**
   * Login with secret code
   * 
   * Checks vault first, then falls back to localStorage.
   */
  async loginWithSecret(secret: string): Promise<AbyssAccount | null> {
    if (!secret || !secret.trim()) {
      return null;
    }

    const normalizedSecret = secret.trim();
    const publicKey = await derivePublicKey(normalizedSecret);
    const address = publicKey.slice(2); // Remove 0x prefix

    // Check if secret is in vault
    const vaultReady = await isVaultReady();
    if (vaultReady) {
      try {
        const hasInVault = await vault.hasAccount(address);
        if (hasInVault) {
          const storedSecret = vault.getDecryptedKey(address);
          if (storedSecret === normalizedSecret) {
            // Find account by public key
            const accounts = this.getAllAccounts();
            for (const [username, account] of Object.entries(accounts)) {
              if (account.publicKey === publicKey) {
                localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(account));
                return account;
              }
            }
          }
        }
      } catch (error) {
        console.error('Vault lookup failed:', error);
      }
    }

    // Fall back to localStorage lookup
    const secretMap = this.getSecretMap();
    const username = secretMap[normalizedSecret];
    
    if (username) {
      const accounts = this.getAllAccounts();
      const account = accounts[username];
      if (account && account.abyssIdSecret === normalizedSecret) {
        const derivedPublicKey = derivePublicKeySync(normalizedSecret);
        if (account.publicKey === derivedPublicKey) {
          localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(account));
          return account;
        }
      }
    }

    // Search all accounts
    const syncPublicKey = derivePublicKeySync(normalizedSecret);
    const accounts = this.getAllAccounts();
    for (const [username, account] of Object.entries(accounts)) {
      if (account.publicKey === syncPublicKey && account.abyssIdSecret === normalizedSecret) {
        secretMap[normalizedSecret] = username;
        localStorage.setItem('abyssos_secret_map', JSON.stringify(secretMap));
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(account));
        return account;
      }
    }

    return null;
  },

  /**
   * Get the secret map for fast lookups
   */
  getSecretMap(): Record<string, string> {
    try {
      const data = localStorage.getItem('abyssos_secret_map');
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  /**
   * Get currently authenticated account
   */
  async getCurrentAccount(): Promise<AbyssAccount | null> {
    try {
      const authData = localStorage.getItem(STORAGE_KEY_AUTH);
      if (!authData) {
        return null;
      }
      return JSON.parse(authData) as AbyssAccount;
    } catch {
      return null;
    }
  },

  /**
   * Logout current account
   */
  async logout(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY_AUTH);
  },

  /**
   * Get all stored accounts
   */
  getAllAccounts(): Record<string, AbyssAccount> {
    try {
      const data = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  /**
   * Check if a username is available
   */
  checkUsernameAvailability(username: string): boolean {
    const normalizedUsername = username.toLowerCase();
    const accounts = this.getAllAccounts();
    return !accounts[normalizedUsername];
  },

  /**
   * Get the secret for an account (from vault or localStorage)
   * 
   * @param publicKey - The account's public key
   * @returns The secret if available, null otherwise
   */
  async getAccountSecret(publicKey: string): Promise<string | null> {
    const address = publicKey.startsWith('0x') ? publicKey.slice(2) : publicKey;
    
    // Try vault first
    const vaultReady = await isVaultReady();
    if (vaultReady) {
      try {
        const hasInVault = await vault.hasAccount(address);
        if (hasInVault) {
          return vault.getDecryptedKey(address);
        }
      } catch (error) {
        console.error('Failed to get secret from vault:', error);
      }
    }
    
    // Fall back to localStorage
    const accounts = this.getAllAccounts();
    for (const account of Object.values(accounts)) {
      if (account.publicKey === publicKey || account.publicKey === `0x${address}`) {
        return account.abyssIdSecret || null;
      }
    }
    
    return null;
  },

  /**
   * Migrate account secrets from localStorage to vault
   * 
   * @param vaultPassword - Password for the vault
   * @returns Number of accounts migrated
   */
  async migrateToVault(vaultPassword: string): Promise<number> {
    const initialized = await isVaultInitialized();
    
    if (!initialized) {
      await vault.create(vaultPassword);
    } else {
      await vault.unlock(vaultPassword);
    }
    
    let migrated = 0;
    const accounts = this.getAllAccounts();
    
    for (const [username, account] of Object.entries(accounts)) {
      if (account.abyssIdSecret) {
        const address = account.publicKey.startsWith('0x') 
          ? account.publicKey.slice(2) 
          : account.publicKey;
        
        try {
          const hasInVault = await vault.hasAccount(address);
          if (!hasInVault) {
            await vault.addAccount(account.abyssIdSecret, address, username);
            migrated++;
          }
        } catch (error) {
          console.error(`Failed to migrate account ${username}:`, error);
        }
      }
    }
    
    // Optionally remove secrets from localStorage after migration
    // (keeping for now for backwards compatibility)
    
    return migrated;
  },

  /**
   * Remove account secret from localStorage (after vault migration)
   */
  async removeLocalSecret(username: string): Promise<void> {
    const normalizedUsername = username.toLowerCase();
    const accounts = this.getAllAccounts();
    const account = accounts[normalizedUsername];
    
    if (account && account.abyssIdSecret) {
      // Verify it's in the vault before removing
      const address = account.publicKey.startsWith('0x')
        ? account.publicKey.slice(2)
        : account.publicKey;
      
      const vaultReady = await isVaultReady();
      if (vaultReady && await vault.hasAccount(address)) {
        delete account.abyssIdSecret;
        accounts[normalizedUsername] = account;
        localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
        
        // Also remove from secret map
        const secretMap = this.getSecretMap();
        for (const [secret, user] of Object.entries(secretMap)) {
          if (user === normalizedUsername) {
            delete secretMap[secret];
          }
        }
        localStorage.setItem('abyssos_secret_map', JSON.stringify(secretMap));
      }
    }
  },

  /**
   * Clear all account data (for testing/reset)
   */
  async clearAllData(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY_ACCOUNTS);
    localStorage.removeItem(STORAGE_KEY_AUTH);
    localStorage.removeItem('abyssos_secret_map');
    
    // Also clear vault if available
    try {
      await vault.reset('DESTROY');
    } catch {
      // Vault might not be initialized
    }
  },
};
