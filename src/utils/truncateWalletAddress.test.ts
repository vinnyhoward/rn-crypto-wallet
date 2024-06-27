import { truncateWalletAddress } from "./truncateWalletAddress";

const address = "0x1234567890abcdef1234567890abcdef";
describe("truncateWalletAddress", () => {
  it("should correctly truncate a typical address", () => {
    expect(truncateWalletAddress(address)).toBe("0x123...bcdef");
  });

  it("should correctly truncate with custom end and offset", () => {
    expect(truncateWalletAddress(address, 7, 7)).toBe("0x12345...0abcdef");
  });

  it("should return an empty string if the input is empty", () => {
    expect(truncateWalletAddress("")).toBe("");
  });

  it("should handle addresses shorter than the sum of end and offset", () => {
    const address = "0x12345";

    expect(truncateWalletAddress(address, 2, 2)).toBe("0x...45");
  });

  it("should handle zero end or offset values", () => {
    expect(truncateWalletAddress(address, 0, 0)).toBe(
      "...0x1234567890abcdef1234567890abcdef"
    );
    expect(truncateWalletAddress(address, 8, 0)).toBe(
      "0x123456...0x1234567890abcdef1234567890abcdef"
    );
    expect(truncateWalletAddress(address, 0, 8)).toBe("...90abcdef");
  });

  it("should handle large end and offset values that exceed the address length", () => {
    const address = "0x1234567890abcdef";

    expect(truncateWalletAddress(address, 100, 3)).toBe("0x1234567890abcdef");
    expect(truncateWalletAddress(address, 3, 100)).toBe("0x1234567890abcdef");
  });
});
