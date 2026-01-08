import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import type { QorIDSession, QorIDProvider } from '../services/qorid/types';
import { localQorIDProvider } from '../services/qorid/localProvider';
import { remoteQorIDProvider } from '../services/qorid/remoteProvider';

interface QorIDContextValue {
  session: QorIDSession | null;
  isLoading: boolean;
  login: (username?: string, secret?: string) => Promise<void>;
  logout: () => Promise<void>;
  signMessage: (message: Uint8Array | string) => Promise<string>;
  mode: 'local' | 'remote';
}

const QorIDContext = createContext<QorIDContextValue | undefined>(undefined);

interface QorIDProviderProps {
  children: ReactNode;
  provider?: QorIDProvider;
}

// Determine mode from environment - FORCE LOCAL MODE for now
const getMode = (): 'local' | 'remote' => {
  // Always use local mode to avoid "Failed to fetch" errors
  // Remote mode can be enabled later when API is ready
  return 'local';
};

// Get the appropriate provider based on mode
const getProvider = (): QorIDProvider => {
  const mode = getMode();
  return mode === 'remote' ? remoteQorIDProvider : localQorIDProvider;
};

export function QorIDProvider({ children, provider }: QorIDProviderProps) {
  const mode = useMemo(() => getMode(), []);
  const activeProvider = useMemo(() => provider || getProvider(), [provider]);
  const [session, setSession] = useState<QorIDSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    activeProvider
      .getSession()
      .then((s) => {
        setSession(s);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [activeProvider]);

  const login = async (username?: string, secret?: string) => {
    const newSession = await activeProvider.login(username, secret);
    setSession(newSession);
  };

  const logout = async () => {
    await activeProvider.logout();
    setSession(null);
  };

  const signMessage = async (message: Uint8Array | string) => {
    return activeProvider.signMessage(message);
  };

  return (
    <QorIDContext.Provider value={{ session, isLoading, login, logout, signMessage, mode }}>
      {children}
    </QorIDContext.Provider>
  );
}

export function useQorID() {
  const context = useContext(QorIDContext);
  if (context === undefined) {
    throw new Error('useQorID must be used within an QorIDProvider');
  }
  return context;
}

