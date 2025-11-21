//! Node structure for managing chain state and operations.
//!
//! The Node struct owns the persistent state, maintains a mempool for pending
//! transactions, and tracks chain height. In Phase 2, this provides the API
//! surface for JSON-RPC handlers.

use std::path::PathBuf;
use std::sync::{Arc, Mutex};

use anyhow::Result;

use crate::core::block::Block;
use crate::core::state::State;
use crate::core::transaction::Transaction;

/// Chain information returned by JSON-RPC queries.
#[derive(Clone)]
pub struct ChainInfo {
    /// Current chain height (number of blocks).
    pub height: u64,
}

/// Node structure managing chain state and operations.
///
/// The Node owns:
/// - A persistent State (RocksDB-backed in production)
/// - A mempool for pending transactions
/// - Chain height tracking
///
/// In Phase 2, this provides the interface for JSON-RPC handlers.
/// In Phase 3+, this will also handle block production and mining.
pub struct Node {
    /// Persistent state storage.
    pub state: State,
    /// Path to the RocksDB database.
    pub db_path: PathBuf,
    /// Mempool of pending transactions (not yet included in blocks).
    pub mempool: Arc<Mutex<Vec<Transaction>>>,
    /// Current chain height.
    pub height: Arc<Mutex<u64>>,
}

impl Node {
    /// Create a new node with RocksDB-backed state.
    ///
    /// # Arguments
    /// - `db_path`: Path to the RocksDB database directory
    ///
    /// # Returns
    /// A new Node instance with empty mempool and height 0
    pub fn new(db_path: PathBuf) -> Result<Self> {
        let state = State::open_rocksdb(&db_path)?;
        Ok(Self {
            state,
            db_path,
            mempool: Arc::new(Mutex::new(Vec::new())),
            height: Arc::new(Mutex::new(0)),
        })
    }

    /// Get current chain information.
    pub fn chain_info(&self) -> ChainInfo {
        let height = *self.height.lock().expect("height mutex poisoned");
        ChainInfo { height }
    }

    /// Get a block by height.
    ///
    /// # Arguments
    /// - `height`: The block height to query
    ///
    /// # Returns
    /// `Some(Block)` if the block exists, `None` otherwise
    ///
    /// # Note
    /// This is a stub implementation. In Phase 2.5+, block persistence will be
    /// implemented and blocks will be read from RocksDB.
    pub fn get_block_by_height(&self, _height: u64) -> Option<Block> {
        // TODO: Phase 2.5+ - implement block persistence and retrieval
        // For now, return None and document this limitation
        None
    }

    /// Submit a transaction to the mempool.
    ///
    /// # Arguments
    /// - `tx`: The transaction to add to the mempool
    ///
    /// # Note
    /// This adds the transaction to the mempool but does not immediately
    /// include it in a block. Block production and transaction inclusion
    /// will be implemented in later phases.
    pub fn submit_transaction(&self, tx: Transaction) {
        let mut mempool = self.mempool.lock().expect("mempool mutex poisoned");
        mempool.push(tx);
        // Later phases will include block production and actual inclusion.
    }
}
