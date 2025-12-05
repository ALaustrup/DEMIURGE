/**
 * Grid DNS Resolver
 * 
 * Broadcasts DNS queries to peers via AbyssGridProtocol
 */

import { peerDiscovery } from '../discovery';
import { getLocalPeerId } from '../peer';
import { dnsClient } from '../../dns/dnsClient';
import type { GridDNSQuery, GridDNSResponse } from './gridDnsTypes';
import type { GridMessage } from '../types';

class GridDNSResolver {
  private pendingQueries: Map<string, {
    resolve: (response: GridDNSResponse) => void;
    reject: (error: Error) => void;
    timeout: ReturnType<typeof setTimeout>;
  }> = new Map();
  
  /**
   * Resolve DNS query via grid
   */
  async resolveViaGrid(query: GridDNSQuery): Promise<GridDNSResponse> {
    return new Promise((resolve, reject) => {
      const peers = peerDiscovery.getPeers();
      
      if (peers.length === 0) {
        reject(new Error('No peers available for grid DNS resolution'));
        return;
      }
      
      // Store pending query
      const timeout = setTimeout(() => {
        this.pendingQueries.delete(query.requestId);
        reject(new Error('DNS query timeout'));
      }, 10000); // 10 second timeout
      
      this.pendingQueries.set(query.requestId, {
        resolve,
        reject,
        timeout,
      });
      
      // Broadcast query to all peers
      const localPeerId = getLocalPeerId();
      for (const peer of peers.slice(0, 3)) { // Query up to 3 peers
        peerDiscovery.sendMessage(peer.peerId, {
          type: 'DNS_QUERY',
          from: localPeerId,
          to: peer.peerId,
          payload: query,
          timestamp: Date.now(),
        });
      }
    });
  }
  
  /**
   * Handle DNS response from peer
   */
  handleResponse(response: GridDNSResponse): void {
    const pending = this.pendingQueries.get(response.requestId);
    if (pending) {
      clearTimeout(pending.timeout);
      this.pendingQueries.delete(response.requestId);
      pending.resolve(response);
    }
  }
  
  /**
   * Resolve DNS using grid with fallback
   */
  async resolveWithFallback(domain: string, recordType: string = 'A'): Promise<any> {
    try {
      // Try grid resolution first
      const requestId = `dns:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
      const gridResponse = await this.resolveViaGrid({
        domain,
        recordType,
        requestId,
      });
      
      return {
        domain: gridResponse.domain,
        type: gridResponse.recordType,
        records: gridResponse.records.map(r => ({
          domain,
          type: recordType,
          value: r.value,
          ttl: r.ttl,
          source: 'grid' as const,
          timestamp: Date.now(),
        })),
        source: 'grid' as const,
      };
    } catch (error) {
      // Fallback to direct DNS client
      console.warn('[GridDNS] Grid resolution failed, falling back to direct:', error);
      return await dnsClient.lookup(domain, recordType);
    }
  }
}

// Singleton instance
export const gridDnsResolver = new GridDNSResolver();

