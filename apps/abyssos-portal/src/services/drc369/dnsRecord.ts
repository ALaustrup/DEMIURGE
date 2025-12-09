/**
 * DRC-369 DNS Record Helpers
 */

import { abyssIdSDK } from '../abyssid/sdk';
import type { DRC369 } from './schema';

export interface Drc369DnsRecord {
  domain: string;
  records: {
    a?: string[];
    aaaa?: string[];
    cname?: string[];
    txt?: string[];
    ns?: string[];
  };
}

/**
 * Publish DNS record as DRC-369 asset
 */
export async function publishDnsRecord(
  record: Drc369DnsRecord,
  owner?: string
): Promise<{ assetId: string; txHash: string }> {
  const asset = await abyssIdSDK.drc369.publishNative({
    uri: `dns://${record.domain}`,
    contentType: 'dns-record',
    owner,
    name: `DNS Record: ${record.domain}`,
    description: `DNS records for ${record.domain}`,
    attributes: {
      domain: record.domain,
      records: JSON.stringify(record.records),
    },
  });
  
  return {
    assetId: asset.id,
    txHash: asset.txHash || '',
  };
}

/**
 * Check if DRC-369 asset is a DNS record
 */
export function isDnsRecord(asset: DRC369): boolean {
  return asset.contentType === 'dns-record';
}

/**
 * Extract DNS records from DRC-369 asset
 */
export function extractDnsRecords(asset: DRC369): Drc369DnsRecord | null {
  if (!isDnsRecord(asset)) {
    return null;
  }
  
  const attrs = asset.attributes as any;
  if (!attrs || !attrs.domain) {
    return null;
  }
  
  return {
    domain: attrs.domain,
    records: attrs.records || {},
  };
}

