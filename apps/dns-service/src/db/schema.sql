-- DNS Cache Schema

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

-- Chain DNS Records Cache

CREATE TABLE IF NOT EXISTS chain_dns_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  asset_id TEXT NOT NULL UNIQUE,
  domain TEXT NOT NULL,
  records TEXT NOT NULL, -- JSON
  tx_hash TEXT NOT NULL,
  block_height INTEGER NOT NULL,
  timestamp INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_chain_dns_domain ON chain_dns_records(domain);

