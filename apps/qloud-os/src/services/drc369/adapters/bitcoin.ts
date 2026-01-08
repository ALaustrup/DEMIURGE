import type { DRC369 } from "../schema";

export interface OrdinalRef {
  chain: "BTC" | string;
  inscriptionId: string;
}

export async function readOrdinal(ref: OrdinalRef): Promise<DRC369> {
  return {
    id: `${ref.chain}:${ref.inscriptionId}`,
    chain: ref.chain,
    standard: "ORDINAL",
    owner: "bc1q000000000000000000000000000000000000000",
    uri: "https://example.com/mock-ordinal.json",
    contentType: "image",
    bridgeWrapped: true,
    originalChain: ref.chain,
    originalContract: ref.inscriptionId,
    originalTokenId: ref.inscriptionId,
    attributes: {
      source: "mock-bitcoin-ordinal-adapter",
    },
  };
}

