/**
 * Domain Normalization Utilities
 */

/**
 * Normalize domain name
 */
export function normalizeDomain(domain: string): string {
  // Remove protocol if present
  domain = domain.replace(/^https?:\/\//, '');
  
  // Remove trailing slash
  domain = domain.replace(/\/$/, '');
  
  // Remove path
  domain = domain.split('/')[0];
  
  // Remove port
  domain = domain.split(':')[0];
  
  // Convert to lowercase
  domain = domain.toLowerCase().trim();
  
  // Remove leading/trailing dots
  domain = domain.replace(/^\.+|\.+$/g, '');
  
  return domain;
}

/**
 * Validate domain format
 */
export function isValidDomain(domain: string): boolean {
  const normalized = normalizeDomain(domain);
  
  // Basic domain validation
  if (normalized.length === 0 || normalized.length > 253) {
    return false;
  }
  
  // Check for valid characters
  const domainRegex = /^[a-z0-9]([a-z0-9\-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9\-]{0,61}[a-z0-9])?)*$/;
  return domainRegex.test(normalized);
}

/**
 * Extract TLD from domain
 */
export function getTLD(domain: string): string {
  const normalized = normalizeDomain(domain);
  const parts = normalized.split('.');
  return parts.length > 1 ? parts[parts.length - 1] : '';
}

/**
 * Extract root domain (domain + TLD)
 */
export function getRootDomain(domain: string): string {
  const normalized = normalizeDomain(domain);
  const parts = normalized.split('.');
  if (parts.length >= 2) {
    return parts.slice(-2).join('.');
  }
  return normalized;
}

