/**
 * DNS Service Types
 */

export type DNSRecordType = 'A' | 'AAAA' | 'CNAME' | 'TXT' | 'NS' | 'MX' | 'SOA';

export interface DNSRecord {
  domain: string;
  type: DNSRecordType;
  value: string | string[];
  ttl: number;
  source: 'chain' | 'cache' | 'unbound' | 'upstream';
  timestamp: number;
}

export interface DNSLookupResult {
  domain: string;
  type: DNSRecordType;
  records: DNSRecord[];
  source: DNSRecord['source'];
  trace?: ResolverTrace[];
}

export interface ResolverTrace {
  step: string;
  duration: number;
  result?: any;
  error?: string;
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

export interface CacheEntry {
  domain: string;
  type: DNSRecordType;
  value: string;
  ttl: number;
  timestamp: number;
}

