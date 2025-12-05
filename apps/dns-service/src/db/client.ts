/**
 * SQLite Database Client
 */

import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { CacheEntry } from '../types';

let db: Database.Database | null = null;

export function initDb(dbPath: string = ':memory:'): Database.Database {
  if (db) {
    return db;
  }
  
  db = new Database(dbPath);
  
  // Load schema - create tables directly
  db.exec(`
    CREATE TABLE IF NOT EXISTS dns_cache (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      domain TEXT NOT NULL,
      type TEXT NOT NULL,
      value TEXT NOT NULL,
      ttl INTEGER NOT NULL,
      timestamp INTEGER NOT NULL,
      UNIQUE(domain, type)
    );
    CREATE INDEX IF NOT EXISTS idx_dns_cache_domain ON dns_cache(domain);
    CREATE INDEX IF NOT EXISTS idx_dns_cache_timestamp ON dns_cache(timestamp);
    CREATE TABLE IF NOT EXISTS chain_dns_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      asset_id TEXT NOT NULL UNIQUE,
      domain TEXT NOT NULL,
      records TEXT NOT NULL,
      tx_hash TEXT NOT NULL,
      block_height INTEGER NOT NULL,
      timestamp INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_chain_dns_domain ON chain_dns_records(domain);
  `);
  
  return db;
}

export function getDb(): Database.Database {
  if (!db) {
    throw new Error('Database not initialized. Call initDb() first.');
  }
  return db;
}

export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}

/**
 * Cache operations
 */
export const cache = {
  get(domain: string, type: string): CacheEntry | null {
    const db = getDb();
    const row = db.prepare(`
      SELECT domain, type, value, ttl, timestamp
      FROM dns_cache
      WHERE domain = ? AND type = ?
    `).get(domain, type) as any;
    
    if (!row) return null;
    
    // Check if expired
    const age = Date.now() - row.timestamp;
    if (age > row.ttl * 1000) {
      cache.delete(domain, type);
      return null;
    }
    
    return {
      domain: row.domain,
      type: row.type,
      value: row.value,
      ttl: row.ttl,
      timestamp: row.timestamp,
    };
  },
  
  set(domain: string, type: string, value: string, ttl: number): void {
    const db = getDb();
    db.prepare(`
      INSERT OR REPLACE INTO dns_cache (domain, type, value, ttl, timestamp)
      VALUES (?, ?, ?, ?, ?)
    `).run(domain, type, value, ttl, Date.now());
  },
  
  delete(domain: string, type: string): void {
    const db = getDb();
    db.prepare(`
      DELETE FROM dns_cache
      WHERE domain = ? AND type = ?
    `).run(domain, type);
  },
  
  flush(): void {
    const db = getDb();
    db.prepare('DELETE FROM dns_cache').run();
  },
  
  getAll(): CacheEntry[] {
    const db = getDb();
    const rows = db.prepare(`
      SELECT domain, type, value, ttl, timestamp
      FROM dns_cache
      ORDER BY timestamp DESC
    `).all() as any[];
    
    return rows.map(row => ({
      domain: row.domain,
      type: row.type,
      value: row.value,
      ttl: row.ttl,
      timestamp: row.timestamp,
    }));
  },
};

