/**
 * Browser Spawner
 * 
 * Install a Demiurge micro-instance inside browser caches
 */

import { migrationKit } from '../reproduction/migrationKit';
import type { GenesisSeed } from '../reproduction/reproductionTypes';

class BrowserSpawner {
  /**
   * Spawn instance in browser
   */
  async spawnInBrowser(seed: GenesisSeed): Promise<{
    success: boolean;
    instanceId?: string;
    error?: string;
  }> {
    try {
      // Store seed in IndexedDB
      const dbName = 'demiurge_instances';
      const request = indexedDB.open(dbName, 1);
      
      return new Promise((resolve) => {
        request.onsuccess = () => {
          const db = request.result;
          const transaction = db.transaction(['instances'], 'readwrite');
          const store = transaction.objectStore('instances');
          
          const instanceId = seed.id;
          store.put({
            id: instanceId,
            seed,
            installedAt: Date.now(),
          });
          
          // Install seed
          migrationKit.installSeed(seed, {
            kernelHeuristics: [],
            spiritBehaviors: [],
            computeFocus: 'general',
            mutationRate: 0.1,
            stabilityThreshold: 0.7,
            growthAggressiveness: 0.5,
          }).then(result => {
            resolve({
              success: result.success,
              instanceId: result.success ? instanceId : undefined,
              error: result.error,
            });
          });
        };
        
        request.onerror = () => {
          resolve({
            success: false,
            error: 'Failed to open IndexedDB',
          });
        };
        
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains('instances')) {
            db.createObjectStore('instances', { keyPath: 'id' });
          }
        };
      });
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Browser spawn failed',
      };
    }
  }
}

// Singleton instance
export const browserSpawner = new BrowserSpawner();

