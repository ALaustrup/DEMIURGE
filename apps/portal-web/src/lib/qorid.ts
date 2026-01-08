export function formatAbyssId(addressHex: string): string {
  const hex = addressHex.startsWith("0x") ? addressHex.slice(2) : addressHex;
  return `abyss:${hex}`;
}

// Legacy export for backward compatibility
/** @deprecated Use formatAbyssId instead */
export const formatUrgeId = formatAbyssId;
