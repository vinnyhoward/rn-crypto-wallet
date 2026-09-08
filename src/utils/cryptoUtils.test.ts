import { decryptData, encryptData } from "./cryptoUtils";

// Produced by crypto-es 2.1.0 before upgrading. Never use a real wallet here.
const legacyCipher = {
  cipher: "C19eNrbqYbLv9sb3qkunGJOElBbSKyCy/w6b4b4XtoKgcsq09CvQIktzL7j7yfvg",
  salt: "000102030405060708090a0b0c0d0e0f",
  iv: "101112131415161718191a1b1c1d1e1f",
  iterations: 1000,
};

jest.mock("expo-crypto", () => ({
  getRandomBytesAsync: async (length: number) =>
    new Uint8Array(require("crypto").randomBytes(length)),
}));

describe("wallet encryption migration", () => {
  it("decrypts data persisted by crypto-es 2", async () => {
    await expect(decryptData(legacyCipher, "migration-test-key")).resolves.toBe(
      "existing wallet migration fixture"
    );
  });

  it("round-trips Unicode data with independent salts and IVs", async () => {
    const value = "wallet fixture 🔑";
    const first = await encryptData(value, "test-key");
    const second = await encryptData(value, "test-key");
    expect(first.salt).not.toBe(second.salt);
    expect(first.iv).not.toBe(second.iv);
    await expect(decryptData(first, "test-key")).resolves.toBe(value);
    await expect(decryptData(second, "test-key")).resolves.toBe(value);
  });
});
