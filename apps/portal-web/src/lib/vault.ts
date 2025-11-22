export type EncryptedVault = {
  version: 1;
  address: string;
  salt: string; // base64
  iv: string; // base64
  ciphertext: string; // base64
};

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt as BufferSource,
      iterations: 100_000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function exportVault(
  wallet: { address: string; privateKey: string },
  password: string
): Promise<EncryptedVault> {
  const enc = new TextEncoder();
  const salt = new Uint8Array(16);
  const iv = new Uint8Array(12);
  crypto.getRandomValues(salt);
  crypto.getRandomValues(iv);
  const key = await deriveKey(password, salt);

  const ciphertextBuf = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv as BufferSource },
    key,
    enc.encode(wallet.privateKey)
  );

  const toB64 = (buf: ArrayBuffer | Uint8Array) =>
    btoa(String.fromCharCode(...new Uint8Array(buf)));

  return {
    version: 1,
    address: wallet.address,
    salt: toB64(salt),
    iv: toB64(iv),
    ciphertext: toB64(ciphertextBuf),
  };
}

export async function importVault(
  vault: EncryptedVault,
  password: string
): Promise<{ address: string; privateKey: string }> {
  const dec = new TextDecoder();

  const fromB64 = (b64: string): Uint8Array => {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  };

  const salt = fromB64(vault.salt);
  const iv = fromB64(vault.iv);
  const ciphertext = fromB64(vault.ciphertext);

  const key = await deriveKey(password, salt);

  const plainBuf = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv as BufferSource },
    key,
    ciphertext as BufferSource
  );

  const privateKey = dec.decode(plainBuf);
  return { address: vault.address, privateKey };
}

