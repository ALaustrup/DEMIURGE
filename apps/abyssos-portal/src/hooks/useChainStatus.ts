import { useEffect, useState, useCallback } from 'react';

/**
 * Get RPC URL from environment or fallback
 */
function getRpcUrl(): string {
  if (typeof window === 'undefined') {
    return 'https://rpc.demiurge.cloud/rpc';
  }
  
  return (
    import.meta.env.VITE_DEMIURGE_RPC_URL ||
    (window as any).ABYSS_RPC_URL ||
    'https://rpc.demiurge.cloud/rpc'
  );
}

export type ChainStatus =
  | { state: 'connecting' }
  | { state: 'connected'; height: number }
  | { state: 'error'; message?: string };

export function useChainStatus(pollIntervalMs = 5000) {
  const [status, setStatus] = useState<ChainStatus>({ state: 'connecting' });
  const [retryTrigger, setRetryTrigger] = useState(0);

  const fetchStatus = useCallback(async () => {
    const rpcUrl = getRpcUrl();
    
    try {
      const res = await fetch(rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'cgt_getChainInfo',
          params: [],
          id: 1,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();
      
      // Check for JSON-RPC error
      if (json.error) {
        throw new Error(json.error.message || 'RPC error');
      }

      // Treat ANY successful response with numeric height (including 0) as connected
      const height = typeof json.result?.height === 'number' ? json.result.height : 0;
      
      setStatus({ state: 'connected', height });
    } catch (e: any) {
      const message = e?.message ?? 'Unknown error';
      setStatus({ state: 'error', message });
    }
  }, []);

  // Manual retry function
  const retry = useCallback(() => {
    setStatus({ state: 'connecting' });
    setRetryTrigger((prev) => prev + 1);
    fetchStatus();
  }, [fetchStatus]);

  useEffect(() => {
    let cancelled = false;

    // Initial fetch
    fetchStatus();

    // Set up polling interval
    const intervalId = setInterval(() => {
      if (!cancelled) {
        fetchStatus();
      }
    }, pollIntervalMs);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [fetchStatus, pollIntervalMs, retryTrigger]);

  return { status, retry };
}
