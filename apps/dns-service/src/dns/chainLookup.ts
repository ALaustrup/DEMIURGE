/**
 * Chain DNS Lookup
 * 
 * Queries DRC-369 DNS records from the Demiurge chain
 */

import axios from 'axios';
import type { ChainDNSRecord } from '../types';

const RPC_URL = process.env.DEMIURGE_RPC_URL || 'https://rpc.demiurge.cloud/rpc';

/**
 * Lookup DNS record from chain
 */
export async function lookupChainRecord(domain: string): Promise<ChainDNSRecord | null> {
  try {
    // Query chain for DRC-369 assets with type "dns-record" and matching domain
    const response = await axios.post(RPC_URL, {
      jsonrpc: '2.0',
      id: 1,
      method: 'cgt_getDrc369ByDomain',
      params: [domain],
    });
    
    if (response.data.error || !response.data.result) {
      return null;
    }
    
    const asset = response.data.result;
    
    // Parse DNS records from asset attributes
    if (asset.type !== 'dns-record') {
      return null;
    }
    
    return {
      assetId: asset.id,
      domain: asset.attributes?.domain || domain,
      records: asset.attributes?.records || {},
      txHash: asset.txHash || '',
      blockHeight: asset.blockHeight || 0,
    };
  } catch (error) {
    console.error('[ChainLookup] Error:', error);
    return null;
  }
}

/**
 * Store chain record in cache
 */
export function cacheChainRecord(record: ChainDNSRecord): void {
  const { cache } = require('../db/client');
  
  // Cache each record type
  if (record.records.a) {
    for (const ip of record.records.a) {
      cache.set(record.domain, 'A', ip, 3600); // 1 hour TTL
    }
  }
  
  if (record.records.aaaa) {
    for (const ip of record.records.aaaa) {
      cache.set(record.domain, 'AAAA', ip, 3600);
    }
  }
  
  if (record.records.cname) {
    for (const cname of record.records.cname) {
      cache.set(record.domain, 'CNAME', cname, 3600);
    }
  }
  
  if (record.records.txt) {
    for (const txt of record.records.txt) {
      cache.set(record.domain, 'TXT', txt, 3600);
    }
  }
  
  if (record.records.ns) {
    for (const ns of record.records.ns) {
      cache.set(record.domain, 'NS', ns, 3600);
    }
  }
}

