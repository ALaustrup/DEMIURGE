/**
 * Upstream DNS Resolvers
 * 
 * Fallback to public DNS resolvers
 */

import { promises as dns } from 'dns';
import type { DNSRecord, DNSRecordType } from '../types';

const UPSTREAM_RESOLVERS = [
  '1.1.1.1', // Cloudflare
  '8.8.8.8', // Google
];

/**
 * Resolve using Node.js dns module (upstream)
 */
export async function resolveUpstream(
  domain: string,
  type: DNSRecordType
): Promise<DNSRecord[]> {
  const records: DNSRecord[] = [];
  
  try {
    switch (type) {
      case 'A':
        const aRecords = await dns.resolve4(domain);
        for (const ip of aRecords) {
          records.push({
            domain,
            type: 'A',
            value: ip,
            ttl: 300, // Default TTL
            source: 'upstream',
            timestamp: Date.now(),
          });
        }
        break;
        
      case 'AAAA':
        const aaaaRecords = await dns.resolve6(domain);
        for (const ip of aaaaRecords) {
          records.push({
            domain,
            type: 'AAAA',
            value: ip,
            ttl: 300,
            source: 'upstream',
            timestamp: Date.now(),
          });
        }
        break;
        
      case 'CNAME':
        const cnameRecords = await dns.resolveCname(domain);
        for (const cname of cnameRecords) {
          records.push({
            domain,
            type: 'CNAME',
            value: cname,
            ttl: 300,
            source: 'upstream',
            timestamp: Date.now(),
          });
        }
        break;
        
      case 'TXT':
        const txtRecords = await dns.resolveTxt(domain);
        for (const txt of txtRecords) {
          records.push({
            domain,
            type: 'TXT',
            value: Array.isArray(txt) ? txt.join(' ') : txt,
            ttl: 300,
            source: 'upstream',
            timestamp: Date.now(),
          });
        }
        break;
        
      case 'NS':
        const nsRecords = await dns.resolveNs(domain);
        for (const ns of nsRecords) {
          records.push({
            domain,
            type: 'NS',
            value: ns,
            ttl: 300,
            source: 'upstream',
            timestamp: Date.now(),
          });
        }
        break;
        
      default:
        throw new Error(`Unsupported record type: ${type}`);
    }
  } catch (error: any) {
    if (error.code !== 'ENOTFOUND' && error.code !== 'ENODATA') {
      throw error;
    }
  }
  
  return records;
}

