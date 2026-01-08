/**
 * Virtual Filesystem (VFS)
 * 
 * IndexedDB-backed filesystem for QOR OS apps
 * Provides uniform read/write API across all applications
 */

interface VFSNode {
  path: string;
  type: 'file' | 'directory';
  data?: Uint8Array | string;
  metadata?: {
    created: number;
    modified: number;
    size?: number;
    mime?: string;
  };
  children?: Map<string, VFSNode>;
}

class VirtualFileSystem {
  private db: IDBDatabase | null = null;
  private dbName = 'abyssos_vfs';
  private dbVersion = 1;
  private watchers: Map<string, Set<(node: VFSNode | null) => void>> = new Map();
  
  /**
   * Initialize IndexedDB
   */
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        this.ensureRootDirectories();
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains('files')) {
          const store = db.createObjectStore('files', { keyPath: 'path' });
          store.createIndex('type', 'type', { unique: false });
        }
      };
    });
  }
  
  /**
   * Ensure root directories exist
   */
  private async ensureRootDirectories(): Promise<void> {
    const roots = ['/home', '/wallet', '/drc369', '/runtime', '/system'];
    for (const root of roots) {
      try {
        await this.mkdir(root, { createParents: true });
      } catch {
        // Already exists or error, continue
      }
    }
  }
  
  /**
   * Normalize path
   */
  private normalizePath(path: string): string {
    return path.split('/').filter(Boolean).join('/');
  }
  
  /**
   * Read file or directory
   */
  async read(path: string): Promise<VFSNode | null> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['files'], 'readonly');
      const store = transaction.objectStore('files');
      const request = store.get(path);
      
      request.onsuccess = () => {
        resolve(request.result || null);
      };
      
      request.onerror = () => reject(request.error);
    });
  }
  
  /**
   * Write file
   */
  async write(path: string, data: Uint8Array | string, options?: { mime?: string }): Promise<void> {
    if (!this.db) await this.init();
    
    const normalizedPath = this.normalizePath(path);
    const now = Date.now();
    
    // Ensure parent directory exists
    const parentPath = normalizedPath.split('/').slice(0, -1).join('/');
    if (parentPath) {
      await this.mkdir(parentPath, { createParents: true });
    }
    
    const node: VFSNode = {
      path: normalizedPath,
      type: 'file',
      data: typeof data === 'string' ? data : data,
      metadata: {
        created: now,
        modified: now,
        size: typeof data === 'string' ? new TextEncoder().encode(data).length : data.length,
        mime: options?.mime,
      },
    };
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['files'], 'readwrite');
      const store = transaction.objectStore('files');
      const request = store.put(node);
      
      request.onsuccess = () => {
        this.notifyWatchers(normalizedPath, node);
        resolve();
      };
      
      request.onerror = () => reject(request.error);
    });
  }
  
  /**
   * List directory contents
   */
  async list(path: string): Promise<VFSNode[]> {
    if (!this.db) await this.init();
    
    const normalizedPath = this.normalizePath(path);
    const prefix = normalizedPath ? `${normalizedPath}/` : '';
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['files'], 'readonly');
      const store = transaction.objectStore('files');
      const index = store.index('type');
      const request = index.openCursor();
      const results: VFSNode[] = [];
      
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>).result;
        if (cursor) {
          const node = cursor.value as VFSNode;
          if (node.path.startsWith(prefix) && node.path !== prefix) {
            const relativePath = node.path.slice(prefix.length);
            // Only include direct children (not grandchildren)
            if (!relativePath.includes('/')) {
              results.push(node);
            }
          }
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  }
  
  /**
   * Create directory
   */
  async mkdir(path: string, options?: { createParents?: boolean }): Promise<void> {
    if (!this.db) await this.init();
    
    const normalizedPath = this.normalizePath(path);
    
    if (options?.createParents) {
      const parts = normalizedPath.split('/');
      for (let i = 1; i <= parts.length; i++) {
        const parentPath = parts.slice(0, i).join('/');
        await this.createDirectoryNode(parentPath);
      }
    } else {
      await this.createDirectoryNode(normalizedPath);
    }
  }
  
  /**
   * Create directory node
   */
  private async createDirectoryNode(path: string): Promise<void> {
    const existing = await this.read(path);
    if (existing) return;
    
    const now = Date.now();
    const node: VFSNode = {
      path,
      type: 'directory',
      metadata: {
        created: now,
        modified: now,
      },
      children: new Map(),
    };
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['files'], 'readwrite');
      const store = transaction.objectStore('files');
      const request = store.put(node);
      
      request.onsuccess = () => {
        this.notifyWatchers(path, node);
        resolve();
      };
      
      request.onerror = () => reject(request.error);
    });
  }
  
  /**
   * Delete file or directory
   */
  async delete(path: string): Promise<void> {
    if (!this.db) await this.init();
    
    const normalizedPath = this.normalizePath(path);
    const prefix = `${normalizedPath}/`;
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['files'], 'readwrite');
      const store = transaction.objectStore('files');
      
      // Delete the node itself
      const deleteRequest = store.delete(normalizedPath);
      
      // Delete all children
      const index = store.index('type');
      const cursorRequest = index.openCursor();
      
      cursorRequest.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>).result;
        if (cursor) {
          const node = cursor.value as VFSNode;
          if (node.path.startsWith(prefix)) {
            store.delete(node.path);
          }
          cursor.continue();
        } else {
          this.notifyWatchers(normalizedPath, null);
          resolve();
        }
      };
      
      deleteRequest.onsuccess = () => {
        // Continue with children deletion
      };
      
      deleteRequest.onerror = () => reject(deleteRequest.error);
      cursorRequest.onerror = () => reject(cursorRequest.error);
    });
  }
  
  /**
   * Watch for changes to a path
   */
  watch(path: string, callback: (node: VFSNode | null) => void): () => void {
    const normalizedPath = this.normalizePath(path);
    
    if (!this.watchers.has(normalizedPath)) {
      this.watchers.set(normalizedPath, new Set());
    }
    
    this.watchers.get(normalizedPath)!.add(callback);
    
    // Return unwatch function
    return () => {
      const watchers = this.watchers.get(normalizedPath);
      if (watchers) {
        watchers.delete(callback);
        if (watchers.size === 0) {
          this.watchers.delete(normalizedPath);
        }
      }
    };
  }
  
  /**
   * Notify watchers of changes
   */
  private notifyWatchers(path: string, node: VFSNode | null): void {
    const watchers = this.watchers.get(path);
    if (watchers) {
      watchers.forEach(cb => cb(node));
    }
    
    // Also notify parent directory watchers
    const parentPath = path.split('/').slice(0, -1).join('/');
    if (parentPath) {
      const parentWatchers = this.watchers.get(parentPath);
      if (parentWatchers) {
        parentWatchers.forEach(cb => cb(node));
      }
    }
  }
  
  /**
   * Get user home directory path
   */
  getUserHome(username: string): string {
    return `/home/${username}`;
  }
  
  /**
   * Get wallet directory path
   */
  getWalletPath(): string {
    return '/wallet';
  }
  
  /**
   * Get DRC-369 asset path
   */
  getDrc369Path(assetId: string): string {
    return `/drc369/${assetId}`;
  }
  
  /**
   * Get runtime package path
   */
  getRuntimePath(packageId: string): string {
    return `/runtime/${packageId}`;
  }
}

// Singleton instance
export const vfs = new VirtualFileSystem();

// Initialize on module load
if (typeof window !== 'undefined') {
  vfs.init().catch(console.error);
}

// Export convenience functions
export const fs = {
  read: (path: string) => vfs.read(path),
  write: (path: string, data: Uint8Array | string, options?: { mime?: string }) => vfs.write(path, data, options),
  list: (path: string) => vfs.list(path),
  mkdir: (path: string, options?: { createParents?: boolean }) => vfs.mkdir(path, options),
  delete: (path: string) => vfs.delete(path),
  watch: (path: string, callback: (node: VFSNode | null) => void) => vfs.watch(path, callback),
  getUserHome: (username: string) => vfs.getUserHome(username),
  getWalletPath: () => vfs.getWalletPath(),
  getDrc369Path: (assetId: string) => vfs.getDrc369Path(assetId),
  getRuntimePath: (packageId: string) => vfs.getRuntimePath(packageId),
};

export type { VFSNode };

