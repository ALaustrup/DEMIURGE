/**
 * Grid DNS Handler
 * 
 * Responds to DNS_QUERY messages from peers
 */

import { dnsClient } from '../../dns/dnsClient';
import { gridDnsResolver } from './gridDnsResolver';
import { getLocalPeerId } from '../peer';
import { peerDiscovery } from '../discovery';
import type { GridMessage, DNSQueryMessage, DNSResponseMessage } from '../types';

class GridDNSHandler {
  private messageListeners: Set<(message: GridMessage) => void> = new Set();
  
  /**
   * Initialize handler
   */
  init(): void {
    // In production, would register with grid protocol message router
    // For now, this is a placeholder that would be called by the grid protocol
    console.log('[GridDNS] Handler initialized');
  }
  
  /**
   * Handle incoming grid message
   */
  handleMessage(message: GridMessage): void {
    if (message.type === 'DNS_QUERY') {
      this.handleQuery(message as DNSQueryMessage);
    } else if (message.type === 'DNS_RESPONSE') {
      gridDnsResolver.handleResponse(message.payload as any);
    }
  }
  
  /**
   * Handle DNS query from peer
   */
  private async handleQuery(message: DNSQueryMessage): Promise<void> {
    try {
      const { domain, recordType, requestId } = message.payload;
      
      // Resolve using local DNS client
      const result = await dnsClient.lookup(domain, recordType);
      
      // Send response back to requester
      const localPeerId = getLocalPeerId();
      const response: DNSResponseMessage = {
        type: 'DNS_RESPONSE',
        from: localPeerId,
        to: message.from,
        payload: {
          requestId,
          domain,
          recordType,
          records: result.records.map(r => ({
            value: r.value,
            ttl: r.ttl,
            source: r.source,
          })),
        },
        timestamp: Date.now(),
      };
      
      // Send via peer discovery
      if (message.from) {
        peerDiscovery.sendMessage(message.from, response);
      }
    } catch (error) {
      console.error('[GridDNS] Error handling query:', error);
    }
  }
  
  /**
   * Register message listener
   */
  onMessage(listener: (message: GridMessage) => void): void {
    this.messageListeners.add(listener);
  }
}

// Singleton instance
export const gridDnsHandler = new GridDNSHandler();

// Auto-initialize
if (typeof window !== 'undefined') {
  gridDnsHandler.init();
}

