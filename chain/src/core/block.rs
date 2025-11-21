//! Core block types for the Demiurge chain.
//!
//! This module defines `BlockHeader` and `Block` structures that represent
//! the fundamental building blocks of the blockchain. In Phase 2, these will
//! be extended with Forge PoW verification and state root computation.

use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

/// Block header containing metadata about a block.
///
/// The header includes chain position (height, prev_hash), state commitment
/// (state_root), timing (timestamp), and PoW fields (difficulty_target, nonce).
/// In Phase 2, the nonce will be used for Forge PoW verification.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct BlockHeader {
    /// Block height in the chain (genesis = 0).
    pub height: u64,
    /// Hash of the previous block header.
    pub prev_hash: [u8; 32],
    /// Merkle root of the state tree (placeholder for Phase 2).
    pub state_root: [u8; 32],
    /// Unix timestamp in seconds.
    pub timestamp: u64,
    /// Difficulty target for PoW (placeholder for Phase 2 Forge).
    pub difficulty_target: u128,
    /// PoW solution nonce (placeholder for Phase 2 Forge).
    pub nonce: u64,
}

/// A complete block containing a header and a list of transactions.
///
/// The block body contains all transactions that will be applied to the state
/// when this block is executed. In Phase 2, block execution will verify PoW
/// and apply transactions via the runtime dispatch system.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct Block {
    /// Block header with metadata.
    pub header: BlockHeader,
    /// List of transactions to execute.
    pub body: Vec<crate::core::transaction::Transaction>,
}

impl BlockHeader {
    /// Compute the canonical hash of this block header.
    ///
    /// This function serializes the header using bincode and computes a SHA-256 hash.
    /// In Phase 2, this will be used as part of the Forge PoW verification process.
    pub fn hash(&self) -> [u8; 32] {
        let serialized = bincode::serialize(self).expect("BlockHeader should always serialize");
        let hash = Sha256::digest(&serialized);
        hash.into()
    }

    /// Serialize the header without the nonce field.
    ///
    /// This is used for Forge PoW computation, where the nonce is varied
    /// to find a valid proof-of-work solution.
    pub fn serialize_without_nonce(&self) -> Vec<u8> {
        // Clone the header and zero out the nonce, then serialize
        let mut clone = self.clone();
        clone.nonce = 0;
        bincode::serialize(&clone).expect("BlockHeader serialization failed")
    }
}

/// Helper function to hash a block header (for convenience).
pub fn hash_header(header: &BlockHeader) -> [u8; 32] {
    header.hash()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_header_hash_determinism() {
        let header = BlockHeader {
            height: 0,
            prev_hash: [0; 32],
            state_root: [0; 32],
            timestamp: 1234567890,
            difficulty_target: 1000,
            nonce: 0,
        };

        let hash1 = header.hash();
        let hash2 = header.hash();

        // Same header should produce the same hash
        assert_eq!(hash1, hash2);

        // Different header should produce different hash
        let mut header2 = header.clone();
        header2.height = 1;
        let hash3 = header2.hash();
        assert_ne!(hash1, hash3);
    }
}
