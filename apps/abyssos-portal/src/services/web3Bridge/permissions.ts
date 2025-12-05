/**
 * Web3 Permission System
 * 
 * Manages dApp permissions for AbyssBrowser
 */

export type Permission = 
  | 'READ_WALLET' 
  | 'SIGN_MESSAGE' 
  | 'SIGN_TRANSACTION' 
  | 'MINT_DRC_369' 
  | 'DRC369_LIST'
  | 'CLUSTER_COMPUTE'
  | 'CLUSTER_STORAGE'
  | 'CLUSTER_DRC369_ACCESS';

const PERMISSIONS_STORAGE_KEY = 'abyssos_web3_permissions';

interface PermissionRecord {
  domain: string;
  permissions: Permission[];
  grantedAt: number;
}

let permissionsCache: Map<string, Permission[]> | null = null;

/**
 * Load permissions from localStorage
 */
function loadPermissions(): Map<string, Permission[]> {
  if (permissionsCache) return permissionsCache;
  
  permissionsCache = new Map();
  
  try {
    const stored = localStorage.getItem(PERMISSIONS_STORAGE_KEY);
    if (stored) {
      const records: PermissionRecord[] = JSON.parse(stored);
      records.forEach(record => {
        permissionsCache!.set(record.domain, record.permissions);
      });
    }
  } catch (error) {
    console.error('Failed to load permissions:', error);
  }
  
  return permissionsCache;
}

/**
 * Save permissions to localStorage
 */
function savePermissions(): void {
  if (!permissionsCache) return;
  
  try {
    const records: PermissionRecord[] = [];
    permissionsCache.forEach((permissions, domain) => {
      records.push({
        domain,
        permissions,
        grantedAt: Date.now(),
      });
    });
    localStorage.setItem(PERMISSIONS_STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.error('Failed to save permissions:', error);
  }
}

/**
 * Extract domain from origin URL
 */
export function extractDomain(origin: string): string {
  try {
    const url = new URL(origin);
    return url.hostname;
  } catch {
    return origin;
  }
}

/**
 * Check if domain has permission
 */
export function hasPermission(domain: string, permission: Permission): boolean {
  const permissions = loadPermissions();
  const domainPermissions = permissions.get(domain) || [];
  return domainPermissions.includes(permission);
}

/**
 * Grant permissions to domain
 */
export function grantPermissions(domain: string, permissions: Permission[]): void {
  const cache = loadPermissions();
  const existing = cache.get(domain) || [];
  const newPermissions = [...new Set([...existing, ...permissions])];
  cache.set(domain, newPermissions);
  savePermissions();
}

/**
 * Revoke permissions from domain
 */
export function revokePermissions(domain: string, permissions?: Permission[]): void {
  const cache = loadPermissions();
  
  if (!permissions) {
    // Revoke all
    cache.delete(domain);
  } else {
    const existing = cache.get(domain) || [];
    const remaining = existing.filter(p => !permissions.includes(p));
    if (remaining.length > 0) {
      cache.set(domain, remaining);
    } else {
      cache.delete(domain);
    }
  }
  
  savePermissions();
}

/**
 * Get all permissions for domain
 */
export function getPermissions(domain: string): Permission[] {
  const cache = loadPermissions();
  return cache.get(domain) || [];
}
