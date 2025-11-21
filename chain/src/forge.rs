//! Forge Proof-of-Work implementation.
//!
//! Forge uses Argon2id (memory-hard) followed by SHA-256 to create a
//! computationally expensive hash that serves as the Proof-of-Work.

use argon2::{Algorithm, Argon2, Params, Version};
use sha2::{Digest, Sha256};

/// Configuration for Forge PoW.
///
/// These parameters control the memory and time cost of the Argon2id hashing.
/// Higher values increase security but also increase computation time.
pub struct ForgeConfig {
    /// Memory cost in KiB (kilobytes).
    pub memory_kib: u32,
    /// Time cost (number of iterations).
    pub time_cost: u32,
    /// Number of lanes (parallelism).
    pub lanes: u32,
}

impl Default for ForgeConfig {
    fn default() -> Self {
        Self {
            memory_kib: 16 * 1024, // ~16 MiB per attempt
            time_cost: 3,
            lanes: 1,
        }
    }
}

/// Computes the Forge hash for a block header.
///
/// This function:
/// 1. Combines the header bytes (without nonce) with the nonce
/// 2. Runs Argon2id with the configured parameters
/// 3. Hashes the Argon2id output with SHA-256
/// 4. Returns the final 32-byte hash
///
/// # Arguments
/// - `header_bytes`: Serialized block header (without nonce)
/// - `nonce`: The PoW nonce to try
/// - `config`: Forge configuration (memory, time cost, etc.)
///
/// # Returns
/// A 32-byte SHA-256 hash of the Argon2id output
pub fn forge_hash(header_bytes: &[u8], nonce: u64, config: &ForgeConfig) -> [u8; 32] {
    // Combine header_bytes + nonce into input
    let mut input = Vec::with_capacity(header_bytes.len() + 8);
    input.extend_from_slice(header_bytes);
    input.extend_from_slice(&nonce.to_le_bytes());

    let salt = b"demiurge-forge"; // Fixed salt; this is acceptable for PoW

    let params = Params::new(config.memory_kib, config.time_cost, config.lanes, None)
        .expect("invalid Forge PoW params");

    let argon2 = Argon2::new(Algorithm::Argon2id, Version::V0x13, params);

    let mut out = [0u8; 32];
    argon2
        .hash_password_into(&input, salt, &mut out)
        .expect("argon2 hash failed");

    let mut hasher = Sha256::new();
    hasher.update(&out);
    let digest = hasher.finalize();

    let mut result = [0u8; 32];
    result.copy_from_slice(&digest);
    result
}

/// Checks whether the given Forge hash meets the difficulty target.
///
/// We interpret the first 16 bytes of the hash as a big-endian u128 and
/// compare it to the provided difficulty target. A hash meets the difficulty
/// if its numeric value is less than or equal to the target.
///
/// # Arguments
/// - `hash`: The 32-byte Forge hash to check
/// - `difficulty_target`: The maximum allowed value (lower = harder)
///
/// # Returns
/// `true` if the hash meets the difficulty, `false` otherwise
pub fn meets_difficulty(hash: &[u8; 32], difficulty_target: u128) -> bool {
    let mut buf = [0u8; 16];
    buf.copy_from_slice(&hash[..16]);
    let value = u128::from_be_bytes(buf);
    value <= difficulty_target
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_forge_hash_determinism() {
        let config = ForgeConfig::default();
        let header_bytes = b"test header bytes";
        let nonce = 42;

        let hash1 = forge_hash(header_bytes, nonce, &config);
        let hash2 = forge_hash(header_bytes, nonce, &config);

        // Same inputs should produce the same hash
        assert_eq!(hash1, hash2);
    }

    #[test]
    fn test_forge_hash_different_nonces() {
        let config = ForgeConfig::default();
        let header_bytes = b"test header bytes";

        let hash1 = forge_hash(header_bytes, 0, &config);
        let hash2 = forge_hash(header_bytes, 1, &config);

        // Different nonces should produce different hashes
        assert_ne!(hash1, hash2);
    }

    #[test]
    fn test_meets_difficulty() {
        // Easy difficulty (max u128) - should always pass
        let easy_hash = [0xFF; 32];
        assert!(meets_difficulty(&easy_hash, u128::MAX));

        // Hard difficulty (0) - should never pass (unless hash is all zeros)
        let hard_hash = [0x01; 32];
        assert!(!meets_difficulty(&hard_hash, 0));

        // Zero hash should pass any difficulty
        let zero_hash = [0x00; 32];
        assert!(meets_difficulty(&zero_hash, u128::MAX));
        assert!(meets_difficulty(&zero_hash, 0));
    }
}
