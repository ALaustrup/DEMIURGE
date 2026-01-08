/**
 * Receipts Aggregator
 * 
 * Aggregates ZK execution receipts for mining rewards
 */

import { getAllVMJobs } from '../qorvm/qorvm';
import { computeMeter } from './computeMeter';
import type { ExecutionReceipt } from '../qorvm/types';

class ReceiptsAggregator {
  private receipts: Map<string, ExecutionReceipt> = new Map();
  
  /**
   * Add receipt
   */
  addReceipt(receipt: ExecutionReceipt): void {
    this.receipts.set(receipt.receiptId, receipt);
    
    // Record verified cycles if receipt has ZK proof
    if (receipt.proof) {
      const cycles = Math.floor(receipt.executionTime / 10); // Approximate cycles
      computeMeter.recordCycles('zk', cycles, receipt.peerId, true);
    }
  }
  
  /**
   * Get all receipts
   */
  getAllReceipts(): ExecutionReceipt[] {
    return Array.from(this.receipts.values());
  }
  
  /**
   * Get verified receipts (with ZK proof)
   */
  getVerifiedReceipts(): ExecutionReceipt[] {
    return Array.from(this.receipts.values()).filter(r => !!r.proof);
  }
  
  /**
   * Get receipts by peer
   */
  getReceiptsByPeer(peerId: string): ExecutionReceipt[] {
    return Array.from(this.receipts.values()).filter(r => r.peerId === peerId);
  }
  
  /**
   * Aggregate receipts for mining claim
   */
  aggregateForClaim(): {
    receiptCount: number;
    verifiedCount: number;
    totalCycles: number;
    receipts: string[]; // Receipt IDs
  } {
    const receipts = this.getAllReceipts();
    const verified = this.getVerifiedReceipts();
    
    return {
      receiptCount: receipts.length,
      verifiedCount: verified.length,
      totalCycles: receipts.reduce((sum, r) => sum + Math.floor((r.executionTime || 0) / 10), 0),
      receipts: receipts.map(r => r.receiptId),
    };
  }
}

// Singleton instance
export const receiptsAggregator = new ReceiptsAggregator();

// Auto-aggregate from VM jobs
if (typeof window !== 'undefined') {
  setInterval(() => {
    const jobs = getAllVMJobs();
    // In production, fetch receipts from jobs
  }, 60000); // Every minute
}

