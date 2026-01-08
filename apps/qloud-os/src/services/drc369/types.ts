/**
 * Legacy compatibility exports
 * 
 * This file provides backward compatibility for old DemiNFT references.
 * All new code should import from schema.ts directly.
 */

import type { DRC369, DemiNft, DemiNftId } from "./schema";

// Re-export for backward compatibility
export type { DRC369, DemiNft, DemiNftId };

/**
 * @deprecated Use DRC369 interface from schema.ts
 */
export interface PublishedFile {
  fileId: string;
  title: string;
  description?: string;
  priceCgt: number;
  ownerPubKey: string;
  ownerUsername?: string;
  createdAt: string;
  mediaUrl?: string;
  nftId?: DemiNftId; // If minted as NFT
}

/**
 * Check if a published file can be minted as a DRC-369
 * @deprecated Use DRC369 schema directly
 */
export function canMintAsNft(file: { fileId: string; ownerPubKey: string }): boolean {
  return !!file.fileId && !!file.ownerPubKey;
}

/**
 * Generate a placeholder DRC-369 ID for a file
 * (In production, this would come from on-chain minting)
 * @deprecated Use DRC369.id generation from SDK
 */
export function generateNftIdForFile(fileId: string, ownerPubKey: string): DemiNftId {
  return `drc369://${fileId.slice(0, 16)}#${ownerPubKey.slice(0, 8)}`;
}

/**
 * Convert a PublishedFile to DRC369 format
 */
export function publishedFileToDRC369(file: PublishedFile, chain: string = "DEMIURGE"): DRC369 {
  return {
    id: file.nftId || generateNftIdForFile(file.fileId, file.ownerPubKey),
    chain: chain as any,
    standard: "DRC-369",
    owner: file.ownerPubKey,
    uri: file.mediaUrl || `https://example.com/file/${file.fileId}`,
    contentType: "other",
    name: file.title,
    description: file.description,
    fileId: file.fileId,
    priceCgt: file.priceCgt,
    createdAt: file.createdAt,
    mediaUrl: file.mediaUrl,
    attributes: {
      ...(file.ownerUsername && { ownerUsername: file.ownerUsername }),
    },
  };
}
