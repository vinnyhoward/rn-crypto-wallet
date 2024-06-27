import { uint8ArrayToBase64 } from "./uint8ArrayToBase64";

describe("uint8ArrayToBase64", () => {
  it("should convert a typical Uint8Array to a Base64 string", () => {
    const buffer = new Uint8Array([72, 101, 108, 108, 111]);
    expect(uint8ArrayToBase64(buffer)).toBe("SGVsbG8=");
  });

  it("should handle an empty Uint8Array", () => {
    const buffer = new Uint8Array([]);
    expect(uint8ArrayToBase64(buffer)).toBe("");
  });

  it("should handle non-ASCII characters", () => {
    const buffer = new Uint8Array([206, 177]);
    expect(uint8ArrayToBase64(buffer)).toBe("zrE=");
  });
});
