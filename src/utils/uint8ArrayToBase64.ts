export function uint8ArrayToBase64(buffer: Uint8Array): string {
  const binary = buffer.reduce(
    (acc, byte) => acc + String.fromCharCode(byte),
    ""
  );
  return btoa(binary);
}
