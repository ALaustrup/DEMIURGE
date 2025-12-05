/**
 * TLD Helpers
 */

/**
 * Common TLDs
 */
export const COMMON_TLDS = [
  'com', 'org', 'net', 'edu', 'gov', 'io', 'co', 'dev', 'app', 'xyz',
  'demiurge', // Future Demiurge-native TLD
];

/**
 * Check if TLD is Demiurge-native
 */
export function isDemiurgeTLD(tld: string): boolean {
  return tld.toLowerCase() === 'demiurge';
}

/**
 * Get TLD category
 */
export function getTLDCategory(tld: string): 'generic' | 'country' | 'demiurge' | 'unknown' {
  const normalized = tld.toLowerCase();
  
  if (isDemiurgeTLD(normalized)) {
    return 'demiurge';
  }
  
  // Common generic TLDs
  const genericTLDs = ['com', 'org', 'net', 'edu', 'gov', 'io', 'co', 'dev', 'app', 'xyz'];
  if (genericTLDs.includes(normalized)) {
    return 'generic';
  }
  
  // Country code TLDs (2 letters)
  if (normalized.length === 2 && /^[a-z]{2}$/.test(normalized)) {
    return 'country';
  }
  
  return 'unknown';
}

