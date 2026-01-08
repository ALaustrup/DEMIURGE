/**
 * Grid DNS Types
 */

export interface GridDNSQuery {
  domain: string;
  recordType: string;
  requestId: string;
}

export interface GridDNSResponse {
  requestId: string;
  domain: string;
  recordType: string;
  records: Array<{
    value: string | string[];
    ttl: number;
    source: string;
  }>;
}

