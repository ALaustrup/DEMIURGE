/**
 * DNS ABI for WASM Runtime
 */

import { dnsClient } from '../../dns/dnsClient';

export interface DNSABI {
  lookup: (domain: string, type?: string) => Promise<DNSRecord[]>;
  resolveAll: (domain: string) => Promise<AllRecords>;
  getChainRecord: (domain: string) => Promise<ChainRecord | null>;
  clearCache: () => Promise<boolean>;
}

export interface DNSRecord {
  domain: string;
  type: string;
  value: string | string[];
  ttl: number;
  source: string;
}

export interface AllRecords {
  domain: string;
  records: DNSRecord[];
}

export interface ChainRecord {
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
}

/**
 * Create DNS ABI implementation
 */
export function createDNSABI(): DNSABI {
  return {
    async lookup(domain: string, type: string = 'A'): Promise<DNSRecord[]> {
      const result = await dnsClient.lookup(domain, type as any);
      return result.records.map(r => ({
        domain: r.domain,
        type: r.type,
        value: r.value,
        ttl: r.ttl,
        source: r.source,
      }));
    },
    
    async resolveAll(domain: string): Promise<AllRecords> {
      const result = await dnsClient.resolveAll(domain);
      return {
        domain: result.domain,
        records: result.records.map(r => ({
          domain: r.domain,
          type: r.type,
          value: r.value,
          ttl: r.ttl,
          source: r.source,
        })),
      };
    },
    
    async getChainRecord(domain: string): Promise<ChainRecord | null> {
      const record = await dnsClient.getChainRecord(domain);
      if (!record) return null;
      
      return {
        assetId: record.assetId,
        domain: record.domain,
        records: record.records,
        txHash: record.txHash,
      };
    },
    
    async clearCache(): Promise<boolean> {
      try {
        await dnsClient.clearCache();
        return true;
      } catch {
        return false;
      }
    },
  };
}

