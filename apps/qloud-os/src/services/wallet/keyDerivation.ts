/**
 * Frontend Key Derivation for Demiurge Wallet
 * 
 * Derives deterministic Ed25519 keys from QorID identity keys
 */

import { ed25519 } from '@noble/curves/ed25519';

/**
 * SHA-256 hash using Web Crypto API
 */
async function sha256(data: Uint8Array): Promise<Uint8Array> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', data as BufferSource);
  return new Uint8Array(hashBuffer);
}

/**
 * Derive a Demiurge chain private key from an identity public key
 */
export async function deriveDemiurgeKey(identityPublicKey: string): Promise<Uint8Array> {
  const seed = await sha256(new TextEncoder().encode(`${identityPublicKey}:demiurge`));
  return seed.slice(0, 32);
}

/**
 * Get the public key corresponding to a derived Demiurge private key
 */
export function getDemiurgePublicKey(privateKey: Uint8Array): Uint8Array {
  return ed25519.getPublicKey(privateKey);
}

/**
 * Derive both private and public keys for Demiurge chain operations
 */
export async function deriveDemiurgeKeypair(identityPublicKey: string): Promise<{
  privateKey: Uint8Array;
  publicKey: Uint8Array;
}> {
  const privateKey = await deriveDemiurgeKey(identityPublicKey);
  const publicKey = getDemiurgePublicKey(privateKey);
  return { privateKey, publicKey };
}

/**
 * Convert bytes to hex string
 */
export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

