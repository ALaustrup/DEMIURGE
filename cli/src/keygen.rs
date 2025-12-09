//! Validator key generation utility.

use ed25519_dalek::{SigningKey, VerifyingKey};
use rand::rngs::OsRng;
use std::fs;
use std::path::PathBuf;
use anyhow::{Result, Context};

/// Generate a new validator key pair and save to file.
/// Returns the validator address as a hex string.
pub fn generate_validator_key(key_path: &PathBuf) -> Result<String> {
    // Check if key already exists
    if key_path.exists() {
        return get_validator_address(key_path);
    }

    // Generate new key pair
    let mut csprng = OsRng;
    let signing_key = SigningKey::generate(&mut csprng);
    let verifying_key: VerifyingKey = signing_key.verifying_key();

    // Derive address from public key (first 32 bytes)
    let public_key_bytes = verifying_key.to_bytes();
    let address = hex::encode(&public_key_bytes[..32]);

    // Save private key
    let key_dir = key_path.parent()
        .ok_or_else(|| anyhow::anyhow!("Invalid key path"))?;
    fs::create_dir_all(key_dir)
        .with_context(|| format!("Failed to create key directory: {}", key_dir.display()))?;
    
    fs::write(key_path, signing_key.to_bytes())
        .with_context(|| format!("Failed to write validator key: {}", key_path.display()))?;

    // Set restrictive permissions (Unix only)
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        fs::set_permissions(key_path, fs::Permissions::from_mode(0o600))
            .with_context(|| "Failed to set key permissions")?;
    }

    Ok(address)
}

/// Load validator key and return address (for existing keys).
pub fn get_validator_address(key_path: &PathBuf) -> Result<String> {
    if !key_path.exists() {
        anyhow::bail!("Validator key not found at: {}", key_path.display());
    }

    let key_bytes = fs::read(key_path)
        .with_context(|| format!("Failed to read validator key: {}", key_path.display()))?;

    if key_bytes.len() != 32 {
        anyhow::bail!("Invalid validator key length: expected 32 bytes, got {}", key_bytes.len());
    }

    let mut secret_key = [0u8; 32];
    secret_key.copy_from_slice(&key_bytes);

    let signing_key = SigningKey::from_bytes(&secret_key);
    let verifying_key: VerifyingKey = signing_key.verifying_key();
    let public_key_bytes = verifying_key.to_bytes();
    let address = hex::encode(&public_key_bytes[..32]);

    Ok(address)
}
