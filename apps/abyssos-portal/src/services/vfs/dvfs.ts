/**
 * Distributed Virtual Filesystem (DVFS)
 * 
 * Multi-peer replicated storage for grid processes
 */

import { fs } from '../vfs';
import type { VFSNode } from '../vfs';

class DistributedVFS {
  /**
   * Get grid path for app/process
   */
  getGridPath(appId: string, processId: string, filename?: string): string {
    const basePath = `/grid/${appId}/${processId}`;
    return filename ? `${basePath}/${filename}` : basePath;
  }
  
  /**
   * Read from grid storage
   */
  async read(appId: string, processId: string, filename: string): Promise<VFSNode | null> {
    const path = this.getGridPath(appId, processId, filename);
    return fs.read(path);
  }
  
  /**
   * Write to grid storage
   */
  async write(
    appId: string,
    processId: string,
    filename: string,
    data: Uint8Array | string,
    options?: { mime?: string }
  ): Promise<void> {
    const path = this.getGridPath(appId, processId, filename);
    
    // Ensure directory exists
    const dirPath = this.getGridPath(appId, processId);
    await fs.mkdir(dirPath, { createParents: true });
    
    // Write file
    await fs.write(path, data, options);
    
    // In production, sync to other peers via grid protocol
    // For now, just store locally
  }
  
  /**
   * List grid directory
   */
  async list(appId: string, processId: string): Promise<VFSNode[]> {
    const path = this.getGridPath(appId, processId);
    return fs.list(path);
  }
  
  /**
   * Delete from grid storage
   */
  async delete(appId: string, processId: string, filename: string): Promise<void> {
    const path = this.getGridPath(appId, processId, filename);
    await fs.delete(path);
  }
  
  /**
   * Watch for changes (with peer sync)
   */
  watch(
    appId: string,
    processId: string,
    callback: (node: VFSNode | null) => void
  ): () => void {
    const path = this.getGridPath(appId, processId);
    return fs.watch(path, callback);
  }
}

// Singleton instance
export const dvfs = new DistributedVFS();

