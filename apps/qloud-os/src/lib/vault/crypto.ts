/**
 * Cryptographic utilities for QorID Vault
 * 
 * Uses Web Crypto API for secure key derivation and encryption:
 * - PBKDF2 for password-based key derivation (100,000 iterations)
 * - AES-256-GCM for authenticated encryption
 */

// Constants
const PBKDF2_ITERATIONS = 100_000;
const SALT_LENGTH = 32; // 256 bits
const IV_LENGTH = 12; // 96 bits (recommended for GCM)
const KEY_LENGTH = 256; // AES-256

/**
 * Generate a cryptographically secure random salt
 */
export function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
}

/**
 * Generate a cryptographically secure random IV for AES-GCM
 */
export function generateIV(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(IV_LENGTH));
}

/**
 * Derive an AES-256 key from a password using PBKDF2
 * 
 * @param password - User's password
 * @param salt - Random salt (should be stored alongside encrypted data)
 * @returns CryptoKey suitable for AES-GCM encryption/decryption
 */
export async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  // Import password as raw key material
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  // Derive AES-256 key using PBKDF2
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    passwordKey,
    {
      name: 'AES-GCM',
      length: KEY_LENGTH,
    },
    false, // Not extractable for security
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypted data structure
 */
export interface EncryptedData {
  /** Base64-encoded ciphertext */
  ciphertext: string;
  /** Base64-encoded IV */
  iv: string;
  /** Base64-encoded salt used for key derivation */
  salt: string;
  /** Version for future format changes */
  version: number;
}

/**
 * Encrypt data using AES-256-GCM
 * 
 * @param plaintext - Data to encrypt (string or object will be JSON stringified)
 * @param password - User's password
 * @returns Encrypted data object with all necessary components for decryption
 */
export async function encrypt(
  plaintext: string | object,
  password: string
): Promise<EncryptedData> {
  const data = typeof plaintext === 'string' ? plaintext : JSON.stringify(plaintext);
  const salt = generateSalt();
  const iv = generateIV();
  const key = await deriveKey(password, salt);

  const ciphertext = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    new TextEncoder().encode(data)
  );

  return {
    ciphertext: arrayBufferToBase64(ciphertext),
    iv: arrayBufferToBase64(iv),
    salt: arrayBufferToBase64(salt),
    version: 1,
  };
}

/**
 * Decrypt data using AES-256-GCM
 * 
 * @param encryptedData - Encrypted data object from encrypt()
 * @param password - User's password
 * @returns Decrypted plaintext string
 * @throws Error if decryption fails (wrong password or corrupted data)
 */
export async function decrypt(
  encryptedData: EncryptedData,
  password: string
): Promise<string> {
  const { ciphertext, iv, salt, version } = encryptedData;

  if (version !== 1) {
    throw new Error(`Unsupported vault version: ${version}`);
  }

  const key = await deriveKey(password, base64ToArrayBuffer(salt));

  try {
    const plaintext = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: base64ToArrayBuffer(iv),
      },
      key,
      base64ToArrayBuffer(ciphertext)
    );

    return new TextDecoder().decode(plaintext);
  } catch (error) {
    // AES-GCM throws on authentication failure (wrong password)
    throw new Error('Decryption failed: incorrect password or corrupted data');
  }
}

/**
 * Verify a password against encrypted data without fully decrypting
 * (Still performs decryption, but useful for password verification)
 */
export async function verifyPassword(
  encryptedData: EncryptedData,
  password: string
): Promise<boolean> {
  try {
    await decrypt(encryptedData, password);
    return true;
  } catch {
    return false;
  }
}

// Utility functions for base64 encoding/decoding

function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Securely clear sensitive data from memory
 * Note: JavaScript doesn't guarantee memory clearing, but this helps
 */
export function secureClear(data: Uint8Array): void {
  crypto.getRandomValues(data); // Overwrite with random data
  data.fill(0); // Then fill with zeros
}
