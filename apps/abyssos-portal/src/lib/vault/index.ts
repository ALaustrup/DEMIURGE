/**
 * AbyssID Vault - High-Level API
 * 
 * Secure encrypted storage for AbyssID private keys.
 * 
 * Usage:
 * ```ts
 * import { vault } from './lib/vault';
 * 
 * // Create a new vault (first time)
 * await vault.create('mySecurePassword');
 * 
 * // Add an account
 * await vault.addAccount(privateKey, 'My Main Account');
 * 
 * // Lock when not in use
 * vault.lock();
 * 
 * // Unlock to access keys
 * await vault.unlock('mySecurePassword');
 * 
 * // Get decrypted key
 * const key = vault.getDecryptedKey(address);
 * ```
 */

import { encrypt, decrypt, verifyPassword, type EncryptedData } from './crypto';
import {
  openVaultDB,
  closeVaultDB,
  saveAccount,
  getAccount,
  deleteAccount,
  listAccounts,
  getAccountCount,
  touchAccount,
  saveMetadata,
  getMetadata,
  clearVault,
  isVaultInitialized,
  exportAllData,
  importAllData,
  type StoredAccount,
} from './storage';

// Re-export types
export type { StoredAccount, EncryptedData };

/**
 * Vault state
 */
export interface VaultState {
  isInitialized: boolean;
  isUnlocked: boolean;
  accountCount: number;
  autoLockTimeout: number; // milliseconds, 0 = disabled
}

/**
 * Account info (without sensitive data)
 */
export interface AccountInfo {
  address: string;
  label?: string;
  createdAt: number;
  lastAccessedAt: number;
}

/**
 * Vault backup format
 */
export interface VaultBackup {
  version: number;
  createdAt: number;
  data: EncryptedData;
}

// In-memory state (cleared on lock)
let decryptedKeys: Map<string, string> = new Map();
let currentPassword: string | null = null;
let autoLockTimer: ReturnType<typeof setTimeout> | null = null;
let autoLockTimeout = 5 * 60 * 1000; // Default: 5 minutes

// Callbacks for state changes
type StateChangeCallback = (state: VaultState) => void;
const stateChangeCallbacks: Set<StateChangeCallback> = new Set();

/**
 * Notify listeners of state changes
 */
async function notifyStateChange(): Promise<void> {
  const state = await vault.getState();
  for (const callback of stateChangeCallbacks) {
    try {
      callback(state);
    } catch (error) {
      console.error('Vault state change callback error:', error);
    }
  }
}

/**
 * Reset the auto-lock timer
 */
function resetAutoLockTimer(): void {
  if (autoLockTimer) {
    clearTimeout(autoLockTimer);
    autoLockTimer = null;
  }
  
  if (autoLockTimeout > 0 && currentPassword) {
    autoLockTimer = setTimeout(() => {
      vault.lock();
    }, autoLockTimeout);
  }
}

/**
 * The main vault singleton
 */
export const vault = {
  /**
   * Create a new vault with a master password
   * 
   * @param password - Master password for the vault
   * @throws Error if vault already exists
   */
  async create(password: string): Promise<void> {
    if (await isVaultInitialized()) {
      throw new Error('Vault already exists. Use unlock() or reset() instead.');
    }
    
    if (!password || password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    
    // Create a verifier that we can check against later
    const verifier = await encrypt('vault-password-verifier', password);
    await saveMetadata('passwordVerifier', verifier);
    await saveMetadata('createdAt', Date.now());
    await saveMetadata('version', 1);
    
    currentPassword = password;
    resetAutoLockTimer();
    await notifyStateChange();
  },
  
  /**
   * Unlock the vault with the master password
   * 
   * @param password - Master password
   * @returns true if unlock successful
   * @throws Error if vault not initialized or wrong password
   */
  async unlock(password: string): Promise<boolean> {
    if (!(await isVaultInitialized())) {
      throw new Error('Vault not initialized. Use create() first.');
    }
    
    const verifier = await getMetadata<EncryptedData>('passwordVerifier');
    if (!verifier) {
      throw new Error('Vault corrupted: missing password verifier');
    }
    
    const isValid = await verifyPassword(verifier, password);
    if (!isValid) {
      throw new Error('Incorrect password');
    }
    
    // Decrypt all stored keys into memory
    const accounts = await listAccounts();
    for (const account of accounts) {
      try {
        const privateKey = await decrypt(account.encryptedKey, password);
        decryptedKeys.set(account.address, privateKey);
      } catch (error) {
        console.error(`Failed to decrypt key for ${account.address}:`, error);
      }
    }
    
    currentPassword = password;
    resetAutoLockTimer();
    await notifyStateChange();
    
    return true;
  },
  
  /**
   * Lock the vault (clear all decrypted keys from memory)
   */
  lock(): void {
    // Clear sensitive data
    for (const key of decryptedKeys.values()) {
      // Can't truly clear strings in JS, but we can help GC
    }
    decryptedKeys.clear();
    currentPassword = null;
    
    if (autoLockTimer) {
      clearTimeout(autoLockTimer);
      autoLockTimer = null;
    }
    
    notifyStateChange();
  },
  
  /**
   * Check if the vault is currently unlocked
   */
  isUnlocked(): boolean {
    return currentPassword !== null;
  },
  
  /**
   * Add a new account to the vault
   * 
   * @param privateKey - The private key to store (hex string)
   * @param label - Optional display name for the account
   * @returns The derived address
   * @throws Error if vault is locked
   */
  async addAccount(privateKey: string, address: string, label?: string): Promise<string> {
    if (!currentPassword) {
      throw new Error('Vault is locked. Unlock first.');
    }
    
    // Normalize private key (remove 0x prefix if present)
    const normalizedKey = privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey;
    
    // Normalize address
    const normalizedAddress = address.startsWith('0x') ? address.slice(2) : address;
    
    // Encrypt the private key
    const encryptedKey = await encrypt(normalizedKey, currentPassword);
    
    const account: StoredAccount = {
      address: normalizedAddress,
      encryptedKey,
      label,
      createdAt: Date.now(),
      lastAccessedAt: Date.now(),
    };
    
    await saveAccount(account);
    decryptedKeys.set(normalizedAddress, normalizedKey);
    
    resetAutoLockTimer();
    await notifyStateChange();
    
    return normalizedAddress;
  },
  
  /**
   * Remove an account from the vault
   * 
   * @param address - The account address to remove
   */
  async removeAccount(address: string): Promise<void> {
    const normalizedAddress = address.startsWith('0x') ? address.slice(2) : address;
    
    await deleteAccount(normalizedAddress);
    decryptedKeys.delete(normalizedAddress);
    
    await notifyStateChange();
  },
  
  /**
   * Get a decrypted private key (vault must be unlocked)
   * 
   * @param address - The account address
   * @returns The decrypted private key or null if not found
   * @throws Error if vault is locked
   */
  getDecryptedKey(address: string): string | null {
    if (!currentPassword) {
      throw new Error('Vault is locked. Unlock first.');
    }
    
    const normalizedAddress = address.startsWith('0x') ? address.slice(2) : address;
    const key = decryptedKeys.get(normalizedAddress);
    
    if (key) {
      resetAutoLockTimer();
    }
    
    return key || null;
  },
  
  /**
   * List all accounts (without decrypting keys)
   */
  async listAccounts(): Promise<AccountInfo[]> {
    const accounts = await listAccounts();
    return accounts.map(({ address, label, createdAt, lastAccessedAt }) => ({
      address,
      label,
      createdAt,
      lastAccessedAt,
    }));
  },
  
  /**
   * Check if an account exists in the vault
   */
  async hasAccount(address: string): Promise<boolean> {
    const normalizedAddress = address.startsWith('0x') ? address.slice(2) : address;
    const account = await getAccount(normalizedAddress);
    return account !== null;
  },
  
  /**
   * Update an account's label
   */
  async updateAccountLabel(address: string, label: string): Promise<void> {
    const normalizedAddress = address.startsWith('0x') ? address.slice(2) : address;
    const account = await getAccount(normalizedAddress);
    
    if (!account) {
      throw new Error('Account not found');
    }
    
    account.label = label;
    await saveAccount(account);
  },
  
  /**
   * Get the current vault state
   */
  async getState(): Promise<VaultState> {
    return {
      isInitialized: await isVaultInitialized(),
      isUnlocked: currentPassword !== null,
      accountCount: await getAccountCount(),
      autoLockTimeout,
    };
  },
  
  /**
   * Set the auto-lock timeout (0 to disable)
   * 
   * @param timeout - Timeout in milliseconds
   */
  setAutoLockTimeout(timeout: number): void {
    autoLockTimeout = Math.max(0, timeout);
    resetAutoLockTimer();
  },
  
  /**
   * Subscribe to vault state changes
   * 
   * @param callback - Called when vault state changes
   * @returns Unsubscribe function
   */
  onStateChange(callback: StateChangeCallback): () => void {
    stateChangeCallbacks.add(callback);
    return () => {
      stateChangeCallbacks.delete(callback);
    };
  },
  
  /**
   * Change the vault master password
   * 
   * @param currentPwd - Current password
   * @param newPassword - New password
   */
  async changePassword(currentPwd: string, newPassword: string): Promise<void> {
    if (!currentPassword) {
      throw new Error('Vault is locked. Unlock first.');
    }
    
    if (currentPwd !== currentPassword) {
      throw new Error('Current password is incorrect');
    }
    
    if (!newPassword || newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters long');
    }
    
    // Re-encrypt all accounts with new password
    const accounts = await listAccounts();
    for (const account of accounts) {
      const decryptedKey = decryptedKeys.get(account.address);
      if (decryptedKey) {
        account.encryptedKey = await encrypt(decryptedKey, newPassword);
        await saveAccount(account);
      }
    }
    
    // Update password verifier
    const verifier = await encrypt('vault-password-verifier', newPassword);
    await saveMetadata('passwordVerifier', verifier);
    
    currentPassword = newPassword;
  },
  
  /**
   * Export the entire vault as an encrypted backup
   * 
   * @param password - Password to encrypt the backup (can be different from vault password)
   * @returns Encrypted backup data
   */
  async exportBackup(password: string): Promise<VaultBackup> {
    if (!currentPassword) {
      throw new Error('Vault is locked. Unlock first.');
    }
    
    const allData = await exportAllData();
    
    // Export includes decrypted keys for portability
    const exportData = {
      accounts: allData.accounts.map((account) => ({
        ...account,
        // Include decrypted key in export (will be re-encrypted with export password)
        decryptedKey: decryptedKeys.get(account.address),
      })),
      metadata: allData.metadata.filter((m) => m.key !== 'passwordVerifier'),
    };
    
    const encryptedData = await encrypt(JSON.stringify(exportData), password);
    
    return {
      version: 1,
      createdAt: Date.now(),
      data: encryptedData,
    };
  },
  
  /**
   * Import a vault backup
   * 
   * @param backup - Encrypted backup data
   * @param backupPassword - Password used to encrypt the backup
   * @param vaultPassword - Password to use for the vault (if creating new)
   * @param merge - If true, merge with existing accounts; if false, replace all
   */
  async importBackup(
    backup: VaultBackup,
    backupPassword: string,
    vaultPassword?: string,
    merge = true
  ): Promise<void> {
    if (backup.version !== 1) {
      throw new Error(`Unsupported backup version: ${backup.version}`);
    }
    
    // Decrypt backup
    const decryptedData = await decrypt(backup.data, backupPassword);
    const exportData = JSON.parse(decryptedData);
    
    // Determine vault password
    const password = vaultPassword || currentPassword;
    if (!password) {
      throw new Error('No vault password provided and vault is locked');
    }
    
    // Initialize vault if needed
    if (!(await isVaultInitialized())) {
      await this.create(password);
    } else if (!currentPassword) {
      await this.unlock(password);
    }
    
    // Clear existing if not merging
    if (!merge) {
      await clearVault();
      decryptedKeys.clear();
      
      // Re-initialize password verifier
      const verifier = await encrypt('vault-password-verifier', password);
      await saveMetadata('passwordVerifier', verifier);
    }
    
    // Import accounts
    for (const accountData of exportData.accounts) {
      const { decryptedKey, ...accountInfo } = accountData;
      
      if (decryptedKey) {
        // Re-encrypt with current vault password
        const encryptedKey = await encrypt(decryptedKey, password);
        
        const account: StoredAccount = {
          address: accountInfo.address,
          encryptedKey,
          label: accountInfo.label,
          createdAt: accountInfo.createdAt,
          lastAccessedAt: Date.now(),
        };
        
        await saveAccount(account);
        decryptedKeys.set(account.address, decryptedKey);
      }
    }
    
    // Import metadata (except passwordVerifier)
    for (const meta of exportData.metadata) {
      if (meta.key !== 'passwordVerifier') {
        await saveMetadata(meta.key, meta.value);
      }
    }
    
    await notifyStateChange();
  },
  
  /**
   * Reset/destroy the vault (removes all data)
   * WARNING: This is destructive and cannot be undone!
   * 
   * @param confirm - Must pass 'DESTROY' to confirm
   */
  async reset(confirm: string): Promise<void> {
    if (confirm !== 'DESTROY') {
      throw new Error('Must confirm with "DESTROY" to reset vault');
    }
    
    await clearVault();
    decryptedKeys.clear();
    currentPassword = null;
    
    if (autoLockTimer) {
      clearTimeout(autoLockTimer);
      autoLockTimer = null;
    }
    
    await notifyStateChange();
  },
  
  /**
   * Close the vault database connection
   */
  close(): void {
    this.lock();
    closeVaultDB();
  },
};

// Export individual functions for advanced usage
export {
  encrypt,
  decrypt,
  verifyPassword,
  openVaultDB,
  closeVaultDB,
  isVaultInitialized,
};
