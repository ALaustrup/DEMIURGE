import { useEffect } from 'react';
import { useAbyssID } from '../hooks/useAbyssID';
import { useWalletStore } from '../state/walletStore';
import { deriveDemiurgePublicKey } from '../services/wallet/demiurgeWallet';

/**
 * WalletInitializer - Ensures wallet is tied to AbyssID account
 * Derives Demiurge public key from AbyssID session when user logs in
 */
export function WalletInitializer() {
  const { session } = useAbyssID();
  const { demiurgePublicKey, setDemiurgePublicKey, clearWallet } = useWalletStore();

  useEffect(() => {
    if (session?.publicKey) {
      // Derive wallet key from AbyssID
      deriveDemiurgePublicKey(session.publicKey)
        .then(derivedKey => {
          setDemiurgePublicKey(derivedKey);
        })
        .catch(error => {
          console.error('Failed to derive Demiurge key from AbyssID:', error);
        });
    } else {
      // Clear wallet when logged out
      clearWallet();
    }
  }, [session?.publicKey, setDemiurgePublicKey, clearWallet]);

  return null; // This component doesn't render anything
}

