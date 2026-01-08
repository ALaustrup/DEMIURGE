import type { DRC369 } from "../schema";

export interface EthereumNFTRef {
  chain: "ETH" | "POLYGON" | "BSC" | string;
  contract: string;
  tokenId: string;
}

export async function readEthereumNFT(ref: EthereumNFTRef): Promise<DRC369> {
  // TODO: Replace with real on-chain / API calls (Alchemy, Infura, custom RPC, etc.)
  // For now, return a mocked DRC369 object for UI testing.
  return {
    id: `${ref.chain}:${ref.contract}:${ref.tokenId}`,
    chain: ref.chain,
    standard: "ERC-721",
    owner: "0x0000000000000000000000000000000000000000",
    uri: "https://example.com/mock-nft.json",
    contentType: "image",
    bridgeWrapped: true,
    originalChain: ref.chain,
    originalContract: ref.contract,
    originalTokenId: ref.tokenId,
    attributes: {
      source: "mock-ethereum-adapter",
    },
  };
}

