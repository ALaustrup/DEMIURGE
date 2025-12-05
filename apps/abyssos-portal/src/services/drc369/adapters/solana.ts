import type { DRC369 } from "../schema";

export interface SolanaNFTRef {
  chain: "SOL" | string;
  mint: string;
}

export async function readSolanaNFT(ref: SolanaNFTRef): Promise<DRC369> {
  return {
    id: `${ref.chain}:${ref.mint}`,
    chain: ref.chain,
    standard: "SPL",
    owner: "So11111111111111111111111111111111111111112",
    uri: "https://example.com/mock-solana-nft.json",
    contentType: "image",
    bridgeWrapped: true,
    originalChain: ref.chain,
    originalContract: ref.mint,
    originalTokenId: ref.mint,
    attributes: {
      source: "mock-solana-adapter",
    },
  };
}

