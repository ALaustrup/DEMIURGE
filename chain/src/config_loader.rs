//! Configuration file loading and parsing.
//!
//! This module handles loading TOML configuration files for genesis and node settings.

use std::path::PathBuf;
use serde::{Deserialize, Serialize};
use anyhow::{Result, Context};

/// Node configuration loaded from TOML.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NodeConfig {
    pub chain: ChainConfig,
    pub node: NodeSettings,
    pub genesis: GenesisConfigRef,
}

/// Chain-level configuration.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChainConfig {
    pub chain_id: u64,
    pub name: String,
}

/// Node runtime settings.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NodeSettings {
    pub rpc_host: String,
    pub rpc_port: u16,
    pub db_path: String,
    #[serde(default = "default_p2p_listen")]
    pub p2p_listen: String,
}

fn default_p2p_listen() -> String {
    "127.0.0.1:30333".to_string()
}

/// Reference to genesis configuration file.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GenesisConfigRef {
    pub genesis_config: String,
}

/// Genesis configuration loaded from TOML.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GenesisConfig {
    pub chain: ChainConfig,
    pub genesis: GenesisSettings,
    pub allocations: Option<Allocations>,
    pub validators: Option<Vec<ValidatorConfig>>,
}

/// Genesis initialization settings.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GenesisSettings {
    pub genesis_archon_address: String,
    pub genesis_archon_balance: String,
}

/// Initial token allocations.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Allocations {
    #[serde(default)]
    pub faucet_address: Option<String>,
    #[serde(default)]
    pub faucet_balance: Option<String>,
    #[serde(default)]
    pub test_account_1: Option<String>,
    #[serde(default)]
    pub test_account_1_balance: Option<String>,
    #[serde(default)]
    pub test_account_2: Option<String>,
    #[serde(default)]
    pub test_account_2_balance: Option<String>,
}

/// Validator configuration in genesis.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ValidatorConfig {
    pub address: String,
    pub stake: String,
}

impl NodeConfig {
    /// Load node configuration from a TOML file.
    pub fn from_file(path: &PathBuf) -> Result<Self> {
        let content = std::fs::read_to_string(path)
            .with_context(|| format!("Failed to read node config: {}", path.display()))?;
        let config: NodeConfig = toml::from_str(&content)
            .with_context(|| format!("Failed to parse node config: {}", path.display()))?;
        Ok(config)
    }
}

impl GenesisConfig {
    /// Load genesis configuration from a TOML file.
    pub fn from_file(path: &PathBuf) -> Result<Self> {
        let content = std::fs::read_to_string(path)
            .with_context(|| format!("Failed to read genesis config: {}", path.display()))?;
        let config: GenesisConfig = toml::from_str(&content)
            .with_context(|| format!("Failed to parse genesis config: {}", path.display()))?;
        Ok(config)
    }

    /// Replace validator address placeholder with actual address.
    pub fn inject_validator_address(&mut self, address: &str) {
        if let Some(ref mut validators) = self.validators {
            for validator in validators.iter_mut() {
                if validator.address == "validator_address_here" || validator.address == "<YOUR_ADDRESS_FROM_KEYGEN>" {
                    validator.address = address.to_string();
                }
            }
        }
    }
}

/// Load validator key and derive address.
pub fn load_validator_key(key_path: &PathBuf) -> Result<([u8; 32], [u8; 32])> {
    use ed25519_dalek::{SigningKey, VerifyingKey};
    use rand::rngs::OsRng;
    
    // Check if key exists
    if !key_path.exists() {
        anyhow::bail!("Validator key not found at: {}", key_path.display());
    }

    // Read key bytes (32 bytes for Ed25519 private key)
    let key_bytes = std::fs::read(key_path)
        .with_context(|| format!("Failed to read validator key: {}", key_path.display()))?;

    if key_bytes.len() != 32 {
        anyhow::bail!("Invalid validator key length: expected 32 bytes, got {}", key_bytes.len());
    }

    let mut secret_key = [0u8; 32];
    secret_key.copy_from_slice(&key_bytes);

    // Create signing key
    let signing_key = SigningKey::from_bytes(&secret_key);
    let verifying_key: VerifyingKey = signing_key.verifying_key();

    // Derive address from public key (first 32 bytes of public key)
    let public_key_bytes = verifying_key.to_bytes();
    let mut address = [0u8; 32];
    address.copy_from_slice(&public_key_bytes[..32]);

    // Return (address, signing_key_bytes for signing)
    let signing_key_bytes = signing_key.to_bytes();
    Ok((address, signing_key_bytes))
}

/// Generate a new validator key pair and save to file.
pub fn generate_validator_key(key_path: &PathBuf) -> Result<([u8; 32], [u8; 32])> {
    use ed25519_dalek::{SigningKey, VerifyingKey};
    use rand::rngs::OsRng;

    // Generate new key pair
    let mut csprng = OsRng;
    let signing_key = SigningKey::generate(&mut csprng);
    let verifying_key: VerifyingKey = signing_key.verifying_key();

    // Derive address from public key
    let public_key_bytes = verifying_key.to_bytes();
    let mut address = [0u8; 32];
    address.copy_from_slice(&public_key_bytes[..32]);

    // Save private key
    let key_dir = key_path.parent()
        .ok_or_else(|| anyhow::anyhow!("Invalid key path"))?;
    std::fs::create_dir_all(key_dir)
        .with_context(|| format!("Failed to create key directory: {}", key_dir.display()))?;
    
    std::fs::write(key_path, signing_key.to_bytes())
        .with_context(|| format!("Failed to write validator key: {}", key_path.display()))?;

    // Set restrictive permissions (Unix only)
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        std::fs::set_permissions(key_path, std::fs::Permissions::from_mode(0o600))
            .with_context(|| "Failed to set key permissions")?;
    }

    let signing_key_bytes = signing_key.to_bytes();
    Ok((address, signing_key_bytes))
}

/// Convert address bytes to hex string.
pub fn address_to_hex(address: &[u8; 32]) -> String {
    hex::encode(address)
}
