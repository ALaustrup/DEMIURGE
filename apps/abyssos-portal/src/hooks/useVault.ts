/**
 * React hook for AbyssID Vault state management
 * 
 * Provides reactive access to vault state, unlock/lock operations,
 * and account management.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { vault, type VaultState, type AccountInfo, type VaultBackup } from '../lib/vault';

export interface UseVaultResult {
  // State
  state: VaultState;
  isLoading: boolean;
  error: string | null;
  
  // Vault operations
  createVault: (password: string) => Promise<void>;
  unlockVault: (password: string) => Promise<boolean>;
  lockVault: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  resetVault: () => Promise<void>;
  
  // Account operations
  accounts: AccountInfo[];
  addAccount: (privateKey: string, address: string, label?: string) => Promise<string>;
  removeAccount: (address: string) => Promise<void>;
  updateAccountLabel: (address: string, label: string) => Promise<void>;
  getDecryptedKey: (address: string) => string | null;
  hasAccount: (address: string) => Promise<boolean>;
  
  // Backup operations
  exportBackup: (password: string) => Promise<VaultBackup>;
  importBackup: (backup: VaultBackup, backupPassword: string, vaultPassword?: string, merge?: boolean) => Promise<void>;
  
  // Settings
  setAutoLockTimeout: (timeout: number) => void;
  
  // Utility
  clearError: () => void;
  refreshState: () => Promise<void>;
}

const defaultState: VaultState = {
  isInitialized: false,
  isUnlocked: false,
  accountCount: 0,
  autoLockTimeout: 5 * 60 * 1000,
};

export function useVault(): UseVaultResult {
  const [state, setState] = useState<VaultState>(defaultState);
  const [accounts, setAccounts] = useState<AccountInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial state
  const refreshState = useCallback(async () => {
    try {
      const vaultState = await vault.getState();
      setState(vaultState);
      
      if (vaultState.isInitialized) {
        const accountList = await vault.listAccounts();
        setAccounts(accountList);
      } else {
        setAccounts([]);
      }
    } catch (err) {
      console.error('Failed to refresh vault state:', err);
      setError(err instanceof Error ? err.message : 'Failed to load vault state');
    }
  }, []);

  // Subscribe to vault state changes
  useEffect(() => {
    let mounted = true;
    
    // Initial load
    setIsLoading(true);
    refreshState().finally(() => {
      if (mounted) {
        setIsLoading(false);
      }
    });
    
    // Subscribe to changes
    const unsubscribe = vault.onStateChange((newState) => {
      if (mounted) {
        setState(newState);
        // Also refresh accounts list
        vault.listAccounts().then((accountList) => {
          if (mounted) {
            setAccounts(accountList);
          }
        });
      }
    });
    
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [refreshState]);

  // Create vault
  const createVault = useCallback(async (password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      await vault.create(password);
      await refreshState();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create vault';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [refreshState]);

  // Unlock vault
  const unlockVault = useCallback(async (password: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);
    try {
      const success = await vault.unlock(password);
      await refreshState();
      return success;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to unlock vault';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [refreshState]);

  // Lock vault
  const lockVault = useCallback(() => {
    vault.lock();
  }, []);

  // Change password
  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    setError(null);
    setIsLoading(true);
    try {
      await vault.changePassword(currentPassword, newPassword);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to change password';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Reset vault
  const resetVault = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await vault.reset('DESTROY');
      await refreshState();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to reset vault';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [refreshState]);

  // Add account
  const addAccount = useCallback(async (privateKey: string, address: string, label?: string): Promise<string> => {
    setError(null);
    try {
      const addr = await vault.addAccount(privateKey, address, label);
      await refreshState();
      return addr;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add account';
      setError(message);
      throw err;
    }
  }, [refreshState]);

  // Remove account
  const removeAccount = useCallback(async (address: string) => {
    setError(null);
    try {
      await vault.removeAccount(address);
      await refreshState();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to remove account';
      setError(message);
      throw err;
    }
  }, [refreshState]);

  // Update account label
  const updateAccountLabel = useCallback(async (address: string, label: string) => {
    setError(null);
    try {
      await vault.updateAccountLabel(address, label);
      await refreshState();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update account label';
      setError(message);
      throw err;
    }
  }, [refreshState]);

  // Get decrypted key
  const getDecryptedKey = useCallback((address: string): string | null => {
    try {
      return vault.getDecryptedKey(address);
    } catch (err) {
      // Return null if vault is locked instead of throwing
      return null;
    }
  }, []);

  // Has account
  const hasAccount = useCallback(async (address: string): Promise<boolean> => {
    return vault.hasAccount(address);
  }, []);

  // Export backup
  const exportBackup = useCallback(async (password: string): Promise<VaultBackup> => {
    setError(null);
    try {
      return await vault.exportBackup(password);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to export backup';
      setError(message);
      throw err;
    }
  }, []);

  // Import backup
  const importBackup = useCallback(async (
    backup: VaultBackup,
    backupPassword: string,
    vaultPassword?: string,
    merge = true
  ) => {
    setError(null);
    setIsLoading(true);
    try {
      await vault.importBackup(backup, backupPassword, vaultPassword, merge);
      await refreshState();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to import backup';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [refreshState]);

  // Set auto-lock timeout
  const setAutoLockTimeout = useCallback((timeout: number) => {
    vault.setAutoLockTimeout(timeout);
    setState((prev) => ({ ...prev, autoLockTimeout: timeout }));
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return useMemo(() => ({
    // State
    state,
    isLoading,
    error,
    
    // Vault operations
    createVault,
    unlockVault,
    lockVault,
    changePassword,
    resetVault,
    
    // Account operations
    accounts,
    addAccount,
    removeAccount,
    updateAccountLabel,
    getDecryptedKey,
    hasAccount,
    
    // Backup operations
    exportBackup,
    importBackup,
    
    // Settings
    setAutoLockTimeout,
    
    // Utility
    clearError,
    refreshState,
  }), [
    state,
    isLoading,
    error,
    accounts,
    createVault,
    unlockVault,
    lockVault,
    changePassword,
    resetVault,
    addAccount,
    removeAccount,
    updateAccountLabel,
    getDecryptedKey,
    hasAccount,
    exportBackup,
    importBackup,
    setAutoLockTimeout,
    clearError,
    refreshState,
  ]);
}

/**
 * Hook to check if a specific account is available in the vault
 */
export function useVaultAccount(address: string | null): {
  exists: boolean;
  isLoading: boolean;
  privateKey: string | null;
} {
  const { state, hasAccount, getDecryptedKey } = useVault();
  const [exists, setExists] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!address) {
      setExists(false);
      setIsLoading(false);
      return;
    }

    let mounted = true;
    setIsLoading(true);
    
    hasAccount(address).then((result) => {
      if (mounted) {
        setExists(result);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [address, hasAccount]);

  const privateKey = useMemo(() => {
    if (!address || !state.isUnlocked || !exists) {
      return null;
    }
    return getDecryptedKey(address);
  }, [address, state.isUnlocked, exists, getDecryptedKey]);

  return { exists, isLoading, privateKey };
}

export default useVault;
