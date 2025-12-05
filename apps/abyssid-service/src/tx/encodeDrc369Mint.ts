/**
 * DRC-369 Mint Transaction Encoding
 * 
 * V1: Simple canonical binary encoding
 * Format: [type=0x01][name_len][name][uri_len][uri][chain_id]
 * 
 * Later expansions:
 * - Royalties
 * - Provenance
 * - Multi-asset collections
 * - Signatures
 * - Smart-contract logic
 */

import { encodeUtf8 } from './utils.js';

export interface DRC369MintAsset {
  title: string;
  ipfsHash: string; // IPFS hash or URI
  description?: string;
  metadata?: Record<string, any>;
}

/**
 * Encode a DRC-369 mint transaction payload
 * 
 * @param asset - Asset data to mint
 * @returns Encoded transaction payload (Uint8Array)
 */
export function encodeDrc369Mint(asset: DRC369MintAsset): Uint8Array {
  const TYPE = Uint8Array.of(0x01); // DRC-369 mint type
  
  const name = encodeUtf8(asset.title);
  const uri = encodeUtf8(asset.ipfsHash);
  
  // Chain ID: 0x00 for Demiurge mainnet, 0x01 for devnet
  // Using 0x00 for mainnet as per spec (can be overridden via env if needed)
  const CHAIN_ID = Uint8Array.of(process.env.DEMIURGE_CHAIN_ID === 'devnet' ? 0x01 : 0x00);
  
  // Build payload: [type][name_len][name][uri_len][uri][chain_id]
  const parts: Uint8Array[] = [
    TYPE,
    Uint8Array.of(name.length),
    name,
    Uint8Array.of(uri.length),
    uri,
    CHAIN_ID,
  ];
  
  // Calculate total length
  const totalLength = parts.reduce((sum, part) => sum + part.length, 0);
  const payload = new Uint8Array(totalLength);
  
  // Concatenate all parts
  let offset = 0;
  for (const part of parts) {
    payload.set(part, offset);
    offset += part.length;
  }
  
  return payload;
}

