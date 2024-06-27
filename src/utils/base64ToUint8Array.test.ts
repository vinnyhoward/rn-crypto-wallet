import { base64ToUint8Array } from "./base64ToUint8Array";

describe("base64ToUint8Array", () => {
  it("should convert a typical Base64 string to Uint8Array", () => {
    const base64 = "SGVsbG8=";
    const result = base64ToUint8Array(base64);
    const expected = new Uint8Array([72, 101, 108, 108, 111]);
    expect(result).toEqual(expected);
  });

  it("should return an empty Uint8Array if the input Base64 string is empty", () => {
    expect(base64ToUint8Array("")).toEqual(new Uint8Array([]));
  });

  it("should handle Base64 strings representing non-ASCII characters", () => {
    const base64 = btoa(String.fromCharCode(247, 254, 248));
    const result = base64ToUint8Array(base64);
    const expected = new Uint8Array([247, 254, 248]);
    expect(result).toEqual(expected);
  });

  it("should handle invalid Base64 strings gracefully", () => {
    try {
      base64ToUint8Array("Invalid base64");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should handle larger Base64 encoded strings", () => {
    const largeString = btoa("a".repeat(1024));
    const result = base64ToUint8Array(largeString);
    const expected = new Uint8Array(1024).fill(97);
    expect(result).toEqual(expected);
  });
});
