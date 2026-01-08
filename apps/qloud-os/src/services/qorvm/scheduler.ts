/**
 * VM Job Scheduler
 * 
 * Manages job execution with local/remote fallback
 */

import { executeLocally } from './executor';
import { peerDiscovery } from '../grid/discovery';
import { getLocalPeerId } from '../grid/peer';
import type { VMJob, VMExecutionResult, VMABI, VMJobStatus } from './types';

class JobScheduler {
  private jobs: Map<string, VMJobStatus> = new Map();
  private listeners: Set<(status: VMJobStatus) => void> = new Set();
  
  /**
   * Submit job for execution
   */
  async submitJob(
    job: VMJob,
    abi: VMABI
  ): Promise<VMExecutionResult> {
    // Update job status
    const jobStatus: VMJobStatus = {
      jobId: job.jobId,
      status: 'pending',
      startedAt: Date.now(),
    };
    this.jobs.set(job.jobId, jobStatus);
    this.notifyListeners(jobStatus);
    
    // Determine execution strategy
    if (job.options?.executeRemotely && job.options?.targetPeerId) {
      // Remote execution
      return this.executeRemotely(job, abi, job.options.targetPeerId);
    } else if (job.options?.executeRemotely) {
      // Find best peer
      const bestPeer = this.findBestPeer();
      if (bestPeer) {
        return this.executeRemotely(job, abi, bestPeer.peerId);
      }
      // Fallback to local
      console.warn('[Scheduler] No remote peer available, falling back to local execution');
    }
    
    // Local execution
    return this.executeLocally(job, abi);
  }
  
  /**
   * Execute job locally
   */
  private async executeLocally(
    job: VMJob,
    abi: VMABI
  ): Promise<VMExecutionResult> {
    const jobStatus = this.jobs.get(job.jobId);
    if (jobStatus) {
      jobStatus.status = 'running';
      jobStatus.peerId = getLocalPeerId();
      this.notifyListeners(jobStatus);
    }
    
    try {
      const result = await executeLocally(job, abi, getLocalPeerId());
      
      // Update status
      if (jobStatus) {
        jobStatus.status = result.success ? 'completed' : 'failed';
        jobStatus.completedAt = Date.now();
        jobStatus.error = result.error;
        this.notifyListeners(jobStatus);
      }
      
      return result;
    } catch (error: any) {
      if (jobStatus) {
        jobStatus.status = 'failed';
        jobStatus.completedAt = Date.now();
        jobStatus.error = error.message;
        this.notifyListeners(jobStatus);
      }
      
      throw error;
    }
  }
  
  /**
   * Execute job remotely
   */
  private async executeRemotely(
    job: VMJob,
    abi: VMABI,
    peerId: string
  ): Promise<VMExecutionResult> {
    const jobStatus = this.jobs.get(job.jobId);
    if (jobStatus) {
      jobStatus.status = 'running';
      jobStatus.peerId = peerId;
      this.notifyListeners(jobStatus);
    }
    
    // In production, send job request via grid protocol
    // For now, simulate remote execution with timeout
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        // Simulate remote execution failure, fallback to local
        console.warn(`[Scheduler] Remote execution on ${peerId} timed out, falling back to local`);
        this.executeLocally(job, abi).then(resolve).catch(reject);
      }, job.options?.timeout || 30000);
      
      // Simulate remote execution (in production, this would be a real RPC call)
      setTimeout(() => {
        clearTimeout(timeout);
        // For now, just execute locally but mark as remote
        this.executeLocally(job, abi).then(result => {
          result.peerId = peerId; // Mark as executed remotely
          resolve(result);
        }).catch(reject);
      }, 1000);
    });
  }
  
  /**
   * Find best peer for job execution
   */
  private findBestPeer(): { peerId: string; computeScore: number } | null {
    const peers = peerDiscovery.getPeers();
    const localPeerId = getLocalPeerId();
    
    // Filter out self and find peer with highest compute score
    const availablePeers = peers
      .filter(p => p.peerId !== localPeerId && p.connectionStatus === 'connected')
      .sort((a, b) => b.computeScore - a.computeScore);
    
    if (availablePeers.length === 0) {
      return null;
    }
    
    const bestPeer = availablePeers[0];
    return {
      peerId: bestPeer.peerId,
      computeScore: bestPeer.computeScore,
    };
  }
  
  /**
   * Cancel job
   */
  cancelJob(jobId: string): boolean {
    const jobStatus = this.jobs.get(jobId);
    if (!jobStatus || jobStatus.status === 'completed' || jobStatus.status === 'failed') {
      return false;
    }
    
    jobStatus.status = 'cancelled';
    jobStatus.completedAt = Date.now();
    this.notifyListeners(jobStatus);
    
    return true;
  }
  
  /**
   * Get job status
   */
  getJobStatus(jobId: string): VMJobStatus | undefined {
    return this.jobs.get(jobId);
  }
  
  /**
   * Get all jobs
   */
  getAllJobs(): VMJobStatus[] {
    return Array.from(this.jobs.values());
  }
  
  /**
   * Subscribe to job updates
   */
  onJobUpdate(callback: (status: VMJobStatus) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }
  
  /**
   * Notify listeners
   */
  private notifyListeners(status: VMJobStatus): void {
    this.listeners.forEach(callback => {
      try {
        callback(status);
      } catch (error) {
        console.error('Job update listener error:', error);
      }
    });
  }
}

// Singleton instance
export const jobScheduler = new JobScheduler();

