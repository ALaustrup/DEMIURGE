"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface AbyssIdentity {
  username: string;
  address: string;
  publicKey: string;
  seedPhrase?: string;
  createdAt?: number;
  isDeveloper?: boolean;
}

interface QorIDContextType {
  identity: AbyssIdentity | null;
  setIdentity: (identity: AbyssIdentity | null) => void;
  clearIdentity: () => void;
}

const QorIDContext = createContext<QorIDContextType | undefined>(undefined);

export function QorIDProvider({ children }: { children: ReactNode }) {
  const [identity, setIdentityState] = useState<AbyssIdentity | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('abyssid_identity');
      if (stored) {
        const parsed = JSON.parse(stored);
        setIdentityState(parsed);
      }
    } catch (e) {
      console.error('Failed to load identity from localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const setIdentity = (newIdentity: AbyssIdentity | null) => {
    setIdentityState(newIdentity);
    if (newIdentity) {
      try {
        localStorage.setItem('abyssid_identity', JSON.stringify(newIdentity));
      } catch (e) {
        console.error('Failed to save identity to localStorage:', e);
      }
    } else {
      localStorage.removeItem('abyssid_identity');
    }
  };

  const clearIdentity = () => {
    setIdentity(null);
  };

  return (
    <QorIDContext.Provider value={{ identity, setIdentity, clearIdentity }}>
      {children}
    </QorIDContext.Provider>
  );
}

export function useQorID() {
  const context = useContext(QorIDContext);
  if (context === undefined) {
    throw new Error('useQorID must be used within QorIDProvider');
  }
  return context;
}

