/**
 * DNS Cache Helpers
 */

export interface CacheEntry {
  domain: string;
  type: string;
  value: string;
  ttl: number;
  timestamp: number;
}

/**
 * Check if cache entry is expired
 */
export function isExpired(entry: CacheEntry): boolean {
  const age = Date.now() - entry.timestamp;
  return age > entry.ttl * 1000;
}

/**
 * Get remaining TTL in seconds
 */
export function getRemainingTTL(entry: CacheEntry): number {
  const age = Date.now() - entry.timestamp;
  const remaining = entry.ttl - Math.floor(age / 1000);
  return Math.max(0, remaining);
}

/**
 * Format expiration time
 */
export function formatExpiration(entry: CacheEntry): string {
  const remaining = getRemainingTTL(entry);
  if (remaining === 0) {
    return 'Expired';
  }
  
  if (remaining < 60) {
    return `${remaining}s`;
  } else if (remaining < 3600) {
    return `${Math.floor(remaining / 60)}m`;
  } else {
    return `${Math.floor(remaining / 3600)}h`;
  }
}

