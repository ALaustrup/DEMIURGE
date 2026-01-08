/**
 * DNS Record Validation
 */

// TODO: PHASE OMEGA - Replace with workspace alias @demiurge/dns-service
// Temporary fix: Define type locally until workspace aliases are configured
export type DNSRecordType = 'A' | 'AAAA' | 'CNAME' | 'TXT' | 'NS' | 'MX' | 'SOA';

export interface DNSRecord {
  domain: string;
  type: DNSRecordType;
  value: string | string[];
  ttl?: number;
}

/**
 * Validate DNS record
 */
export function validateRecord(record: DNSRecord): {
  valid: boolean;
  error?: string;
} {
  // Validate domain
  if (!record.domain || typeof record.domain !== 'string') {
    return { valid: false, error: 'Domain is required' };
  }
  
  // Validate type
  const validTypes: DNSRecordType[] = ['A', 'AAAA', 'CNAME', 'TXT', 'NS', 'MX', 'SOA'];
  if (!validTypes.includes(record.type)) {
    return { valid: false, error: `Invalid record type: ${record.type}` };
  }
  
  // Validate value based on type
  if (!record.value || (typeof record.value !== 'string' && !Array.isArray(record.value))) {
    return { valid: false, error: 'Value is required' };
  }
  
  const values = Array.isArray(record.value) ? record.value : [record.value];
  
  for (const value of values) {
    if (typeof value !== 'string' || value.length === 0) {
      return { valid: false, error: 'Invalid value format' };
    }
    
    // Type-specific validation
    switch (record.type) {
      case 'A':
        if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(value)) {
          return { valid: false, error: 'Invalid IPv4 address' };
        }
        break;
        
      case 'AAAA':
        if (!/^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/.test(value)) {
          return { valid: false, error: 'Invalid IPv6 address' };
        }
        break;
        
      case 'CNAME':
        if (!/^[a-z0-9]([a-z0-9\-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9\-]{0,61}[a-z0-9])?)*$/i.test(value)) {
          return { valid: false, error: 'Invalid CNAME format' };
        }
        break;
        
      case 'NS':
        if (!/^[a-z0-9]([a-z0-9\-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9\-]{0,61}[a-z0-9])?)*$/i.test(value)) {
          return { valid: false, error: 'Invalid NS format' };
        }
        break;
    }
  }
  
  // Validate TTL
  if (record.ttl !== undefined && (record.ttl < 0 || record.ttl > 2147483647)) {
    return { valid: false, error: 'TTL must be between 0 and 2147483647' };
  }
  
  return { valid: true };
}

