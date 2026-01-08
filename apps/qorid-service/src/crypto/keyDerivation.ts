/**
 * Demiurge Chain Key Derivation
 * 
 * Derives a deterministic Ed25519 keypair from an QorID identity public key.
 * This ensures:
 * - No private keys stored on frontend
 * - Keys are reproducible
 * - Migration-safe
 * - Zero UX friction
 */

import { ed25519 } from '@noble/curves/ed25519';
import { sha256 } from '@noble/hashes/sha256';

/**
 * Derive a Demiurge chain private key from an identity public key
 * 
 * @param identityPublicKey - The QorID identity public key (hex string)
 * @returns Ed25519 private key (32 bytes)
 */
export function deriveDemiurgeKey(identityPublicKey: string): Uint8Array {
  // Create deterministic seed from identity key
  const seed = sha256(new TextEncoder().encode(`${identityPublicKey}:demiurge`));
  
  // Ed25519 requires a 32-byte private key (secret key)
  // The seed from SHA-256 is already 32 bytes, so we can use it directly
  // Ed25519 will handle the key validation internally when signing
  const privateKey = seed.slice(0, 32);
  
  // Ensure it's exactly 32 bytes
  if (privateKey.length !== 32) {
    throw new Error('Invalid private key length');
  }
  
  return privateKey;
}

/**
 * Get the public key corresponding to a derived Demiurge private key
 * 
 * @param privateKey - Ed25519 private key (32 bytes)
 * @returns Ed25519 public key (32 bytes)
 */
export function getDemiurgePublicKey(privateKey: Uint8Array): Uint8Array {
  return ed25519.getPublicKey(privateKey);
}

/**
 * Derive both private and public keys for Demiurge chain operations
 * 
 * @param identityPublicKey - The QorID identity public key (hex string)
 * @returns Object with privateKey and publicKey (both as Uint8Array)
 */
export function deriveDemiurgeKeypair(identityPublicKey: string): {
  privateKey: Uint8Array;
  publicKey: Uint8Array;
} {
  const privateKey = deriveDemiurgeKey(identityPublicKey);
  const publicKey = getDemiurgePublicKey(privateKey);
  
  return { privateKey, publicKey };
}

