/**
 * Unified DNS Resolver Pipeline
 * 
 * Resolves DNS queries through: chain → cache → unbound → upstream
 */

import { cache } from '../db/client';
import { lookupChainRecord, cacheChainRecord } from './chainLookup';
import { resolveUpstream } from './upstream';
import type { DNSLookupResult, DNSRecord, DNSRecordType, ResolverTrace } from '../types';

/**
 * Resolve DNS query
 */
export async function resolveDNS(
  domain: string,
  type: DNSRecordType = 'A',
  trace: boolean = false
): Promise<DNSLookupResult> {
  const traces: ResolverTrace[] = [];
  const startTime = Date.now();
  
  // Step 1: Check chain records
  if (trace) {
    const chainStart = Date.now();
    traces.push({
      step: 'chain',
      duration: 0,
    });
  }
  
  const chainRecord = await lookupChainRecord(domain);
  if (chainRecord) {
    if (trace) {
      traces[traces.length - 1].duration = Date.now() - (traces[traces.length - 1] as any).startTime || 0;
      traces[traces.length - 1].result = chainRecord;
    }
    
    // Cache chain records
    cacheChainRecord(chainRecord);
    
    // Extract records of requested type
    const records: DNSRecord[] = [];
    const typeKey = type.toLowerCase() as keyof typeof chainRecord.records;
    const values = chainRecord.records[typeKey];
    
    if (values && Array.isArray(values)) {
      for (const value of values) {
        records.push({
          domain,
          type,
          value,
          ttl: 3600,
          source: 'chain',
          timestamp: Date.now(),
        });
      }
    }
    
    if (records.length > 0) {
      return {
        domain,
        type,
        records,
        source: 'chain',
        trace: trace ? traces : undefined,
      };
    }
  }
  
  // Step 2: Check cache
  if (trace) {
    const cacheStart = Date.now();
    traces.push({
      step: 'cache',
      duration: 0,
    });
  }
  
  const cached = cache.get(domain, type);
  if (cached) {
    if (trace) {
      traces[traces.length - 1].duration = Date.now() - (traces[traces.length - 1] as any).startTime || 0;
      traces[traces.length - 1].result = cached;
    }
    
    return {
      domain,
      type,
      records: [{
        domain,
        type,
        value: cached.value,
        ttl: cached.ttl,
        source: 'cache',
        timestamp: cached.timestamp,
      }],
      source: 'cache',
      trace: trace ? traces : undefined,
    };
  }
  
  // Step 3: Try unbound (local resolver on 127.0.0.1)
  // For now, skip unbound and go to upstream
  // In production, would use dns.setServers(['127.0.0.1']) and try resolve
  
  // Step 4: Fallback to upstream
  if (trace) {
    const upstreamStart = Date.now();
    traces.push({
      step: 'upstream',
      duration: 0,
    });
  }
  
  const upstreamRecords = await resolveUpstream(domain, type);
  
  if (trace) {
    traces[traces.length - 1].duration = Date.now() - (traces[traces.length - 1] as any).startTime || 0;
    traces[traces.length - 1].result = upstreamRecords;
  }
  
  // Cache upstream results
  for (const record of upstreamRecords) {
    cache.set(domain, type, Array.isArray(record.value) ? record.value.join(',') : record.value, record.ttl);
  }
  
  return {
    domain,
    type,
    records: upstreamRecords,
    source: 'upstream',
    trace: trace ? traces : undefined,
  };
}

