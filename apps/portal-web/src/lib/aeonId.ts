import { bech32 } from "bech32";

export function toAeonId(addressHex: string): string {
  // strip leading 0x if present
  const hex = addressHex.startsWith("0x")
    ? addressHex.slice(2)
    : addressHex;

  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }

  const words = bech32.toWords(bytes);
  return bech32.encode("aeon", words); // "aeon1..."
}

