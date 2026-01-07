/**
 * IndexedDB storage layer for AbyssID Vault
 * 
 * Provides persistent encrypted storage for private keys and vault metadata.
 */

import type { EncryptedData } from './crypto';

// Database configuration
const DB_NAME = 'abyssid-vault';
const DB_VERSION = 1;
const STORE_ACCOUNTS = 'accounts';
const STORE_METADATA = 'metadata';

/**
 * Stored account entry
 */
export interface StoredAccount {
  /** AbyssID address (primary key) */
  address: string;
  /** Encrypted private key data */
  encryptedKey: EncryptedData;
  /** Optional display name/username */
  label?: string;
  /** When the account was added */
  createdAt: number;
  /** Last time the account was accessed */
  lastAccessedAt: number;
}

/**
 * Vault metadata
 */
export interface VaultMetadata {
  /** Metadata key */
  key: string;
  /** Metadata value */
  value: unknown;
}

let dbInstance: IDBDatabase | null = null;

/**
 * Open or create the vault database
 */
export function openVaultDB(): Promise<IDBDatabase> {
  if (dbInstance) {
    return Promise.resolve(dbInstance);
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error(`Failed to open vault database: ${request.error?.message}`));
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      
      // Handle connection closing
      dbInstance.onclose = () => {
        dbInstance = null;
      };
      
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create accounts store
      if (!db.objectStoreNames.contains(STORE_ACCOUNTS)) {
        const accountsStore = db.createObjectStore(STORE_ACCOUNTS, { keyPath: 'address' });
        accountsStore.createIndex('createdAt', 'createdAt', { unique: false });
        accountsStore.createIndex('label', 'label', { unique: false });
      }

      // Create metadata store
      if (!db.objectStoreNames.contains(STORE_METADATA)) {
        db.createObjectStore(STORE_METADATA, { keyPath: 'key' });
      }
    };
  });
}

/**
 * Close the database connection
 */
export function closeVaultDB(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}

/**
 * Save an encrypted account to the vault
 */
export async function saveAccount(account: StoredAccount): Promise<void> {
  const db = await openVaultDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_ACCOUNTS, 'readwrite');
    const store = transaction.objectStore(STORE_ACCOUNTS);
    
    const request = store.put(account);
    
    request.onerror = () => {
      reject(new Error(`Failed to save account: ${request.error?.message}`));
    };
    
    request.onsuccess = () => {
      resolve();
    };
  });
}

/**
 * Get an encrypted account by address
 */
export async function getAccount(address: string): Promise<StoredAccount | null> {
  const db = await openVaultDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_ACCOUNTS, 'readonly');
    const store = transaction.objectStore(STORE_ACCOUNTS);
    
    const request = store.get(address);
    
    request.onerror = () => {
      reject(new Error(`Failed to get account: ${request.error?.message}`));
    };
    
    request.onsuccess = () => {
      resolve(request.result || null);
    };
  });
}

/**
 * Delete an account from the vault
 */
export async function deleteAccount(address: string): Promise<void> {
  const db = await openVaultDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_ACCOUNTS, 'readwrite');
    const store = transaction.objectStore(STORE_ACCOUNTS);
    
    const request = store.delete(address);
    
    request.onerror = () => {
      reject(new Error(`Failed to delete account: ${request.error?.message}`));
    };
    
    request.onsuccess = () => {
      resolve();
    };
  });
}

/**
 * List all accounts in the vault (without decrypting keys)
 */
export async function listAccounts(): Promise<StoredAccount[]> {
  const db = await openVaultDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_ACCOUNTS, 'readonly');
    const store = transaction.objectStore(STORE_ACCOUNTS);
    
    const request = store.getAll();
    
    request.onerror = () => {
      reject(new Error(`Failed to list accounts: ${request.error?.message}`));
    };
    
    request.onsuccess = () => {
      resolve(request.result || []);
    };
  });
}

/**
 * Get the count of accounts in the vault
 */
export async function getAccountCount(): Promise<number> {
  const db = await openVaultDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_ACCOUNTS, 'readonly');
    const store = transaction.objectStore(STORE_ACCOUNTS);
    
    const request = store.count();
    
    request.onerror = () => {
      reject(new Error(`Failed to count accounts: ${request.error?.message}`));
    };
    
    request.onsuccess = () => {
      resolve(request.result);
    };
  });
}

/**
 * Update the last accessed timestamp for an account
 */
export async function touchAccount(address: string): Promise<void> {
  const account = await getAccount(address);
  if (account) {
    account.lastAccessedAt = Date.now();
    await saveAccount(account);
  }
}

/**
 * Save vault metadata
 */
export async function saveMetadata(key: string, value: unknown): Promise<void> {
  const db = await openVaultDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_METADATA, 'readwrite');
    const store = transaction.objectStore(STORE_METADATA);
    
    const request = store.put({ key, value });
    
    request.onerror = () => {
      reject(new Error(`Failed to save metadata: ${request.error?.message}`));
    };
    
    request.onsuccess = () => {
      resolve();
    };
  });
}

/**
 * Get vault metadata
 */
export async function getMetadata<T = unknown>(key: string): Promise<T | null> {
  const db = await openVaultDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_METADATA, 'readonly');
    const store = transaction.objectStore(STORE_METADATA);
    
    const request = store.get(key);
    
    request.onerror = () => {
      reject(new Error(`Failed to get metadata: ${request.error?.message}`));
    };
    
    request.onsuccess = () => {
      resolve(request.result?.value ?? null);
    };
  });
}

/**
 * Delete vault metadata
 */
export async function deleteMetadata(key: string): Promise<void> {
  const db = await openVaultDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_METADATA, 'readwrite');
    const store = transaction.objectStore(STORE_METADATA);
    
    const request = store.delete(key);
    
    request.onerror = () => {
      reject(new Error(`Failed to delete metadata: ${request.error?.message}`));
    };
    
    request.onsuccess = () => {
      resolve();
    };
  });
}

/**
 * Clear all vault data (accounts and metadata)
 * WARNING: This is destructive and cannot be undone!
 */
export async function clearVault(): Promise<void> {
  const db = await openVaultDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_ACCOUNTS, STORE_METADATA], 'readwrite');
    
    transaction.onerror = () => {
      reject(new Error(`Failed to clear vault: ${transaction.error?.message}`));
    };
    
    transaction.oncomplete = () => {
      resolve();
    };
    
    transaction.objectStore(STORE_ACCOUNTS).clear();
    transaction.objectStore(STORE_METADATA).clear();
  });
}

/**
 * Check if the vault database exists and has been initialized
 */
export async function isVaultInitialized(): Promise<boolean> {
  try {
    const db = await openVaultDB();
    const hasPasswordHash = await getMetadata('passwordVerifier');
    return hasPasswordHash !== null;
  } catch {
    return false;
  }
}

/**
 * Export all vault data for backup
 */
export async function exportAllData(): Promise<{
  accounts: StoredAccount[];
  metadata: VaultMetadata[];
}> {
  const db = await openVaultDB();
  
  const accounts = await listAccounts();
  
  const metadata = await new Promise<VaultMetadata[]>((resolve, reject) => {
    const transaction = db.transaction(STORE_METADATA, 'readonly');
    const store = transaction.objectStore(STORE_METADATA);
    
    const request = store.getAll();
    
    request.onerror = () => {
      reject(new Error(`Failed to export metadata: ${request.error?.message}`));
    };
    
    request.onsuccess = () => {
      resolve(request.result || []);
    };
  });
  
  return { accounts, metadata };
}

/**
 * Import vault data from backup
 */
export async function importAllData(data: {
  accounts: StoredAccount[];
  metadata: VaultMetadata[];
}): Promise<void> {
  const db = await openVaultDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_ACCOUNTS, STORE_METADATA], 'readwrite');
    
    transaction.onerror = () => {
      reject(new Error(`Failed to import data: ${transaction.error?.message}`));
    };
    
    transaction.oncomplete = () => {
      resolve();
    };
    
    const accountsStore = transaction.objectStore(STORE_ACCOUNTS);
    const metadataStore = transaction.objectStore(STORE_METADATA);
    
    // Import accounts
    for (const account of data.accounts) {
      accountsStore.put(account);
    }
    
    // Import metadata
    for (const meta of data.metadata) {
      metadataStore.put(meta);
    }
  });
}
