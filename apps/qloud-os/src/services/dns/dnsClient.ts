/**
 * DNS Client
 * 
 * Frontend client for DNS service
 */

const DNS_API_URL = import.meta.env.VITE_DNS_API_URL || 'https://demiurge.cloud/api/dns';

export interface DNSRecord {
  domain: string;
  type: string;
  value: string | string[];
  ttl: number;
  source: 'chain' | 'cache' | 'unbound' | 'upstream';
  timestamp: number;
}

export interface DNSLookupResult {
  domain: string;
  type: string;
  records: DNSRecord[];
  source: DNSRecord['source'];
  trace?: Array<{
    step: string;
    duration: number;
    result?: any;
    error?: string;
  }>;
}

export interface ChainDNSRecord {
  assetId: string;
  domain: string;
  records: {
    a?: string[];
    aaaa?: string[];
    cname?: string[];
    txt?: string[];
    ns?: string[];
  };
  txHash: string;
  blockHeight: number;
}

class DNSClient {
  /**
   * Lookup DNS record
   */
  async lookup(domain: string, type: string = 'A', trace: boolean = false): Promise<DNSLookupResult> {
    const response = await fetch(`${DNS_API_URL}/lookup?domain=${encodeURIComponent(domain)}&type=${type}&trace=${trace}`);
    
    if (!response.ok) {
      throw new Error(`DNS lookup failed: ${response.statusText}`);
    }
    
    const json = await response.json();
    if (!json.success) {
      throw new Error(json.error?.message || 'DNS lookup failed');
    }
    
    return json.data;
  }
  
  /**
   * Resolve all records for domain
   */
  async resolveAll(domain: string): Promise<DNSLookupResult> {
    const response = await fetch(`${DNS_API_URL}/record?domain=${encodeURIComponent(domain)}`);
    
    if (!response.ok) {
      throw new Error(`DNS resolve failed: ${response.statusText}`);
    }
    
    const json = await response.json();
    if (!json.success) {
      throw new Error(json.error?.message || 'DNS resolve failed');
    }
    
    return {
      domain: json.data.domain,
      type: 'ALL',
      records: json.data.records,
      source: json.data.records[0]?.source || 'upstream',
    };
  }
  
  /**
   * Get chain record
   */
  async getChainRecord(domain: string): Promise<ChainDNSRecord | null> {
    try {
      const response = await fetch(`${DNS_API_URL}/onchain/${encodeURIComponent(domain)}`);
      
      if (response.status === 404) {
        return null;
      }
      
      if (!response.ok) {
        throw new Error(`Chain lookup failed: ${response.statusText}`);
      }
      
      const json = await response.json();
      if (!json.success) {
        return null;
      }
      
      return json.data;
    } catch (error) {
      console.error('[DNS Client] Chain lookup error:', error);
      return null;
    }
  }
  
  /**
   * Get cache entry
   */
  async getCache(domain: string, type?: string): Promise<any> {
    const url = type
      ? `${DNS_API_URL}/cache/${encodeURIComponent(domain)}?type=${type}`
      : `${DNS_API_URL}/cache/${encodeURIComponent(domain)}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Cache lookup failed: ${response.statusText}`);
    }
    
    const json = await response.json();
    return json.data;
  }
  
  /**
   * Clear cache
   */
  async clearCache(): Promise<void> {
    const response = await fetch(`${DNS_API_URL}/cache/flush`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error(`Cache flush failed: ${response.statusText}`);
    }
  }
}

// Singleton instance
export const dnsClient = new DNSClient();

