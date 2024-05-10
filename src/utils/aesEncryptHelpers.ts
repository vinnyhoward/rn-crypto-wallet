import CryptoES from "crypto-es";

export interface EncryptedData {
  cipher: string;
  iv: string;
}

// Generate a key from a password and salt
export const generateKey = async (
  password: string,
  salt: string
): Promise<string> => {
  const key = CryptoES.PBKDF2(password, salt, {
    keySize: 256 / 32, // Key size divided by 32 to get the number of words
    iterations: 1000,
  });
  return key.toString(CryptoES.enc.Hex);
};

// Encrypt data using AES
export const encryptData = async (
  text: string,
  key: string
): Promise<EncryptedData> => {
  const iv = CryptoES.lib.WordArray.random(128 / 8); // IV size of 128 bits / 8 = 16 bytes
  const keyHex = CryptoES.enc.Hex.parse(key);
  const encrypted = CryptoES.AES.encrypt(text, keyHex, {
    iv: iv,
    mode: CryptoES.mode.CBC,
    padding: CryptoES.pad.Pkcs7,
  });
  return {
    cipher: encrypted.toString(),
    iv: iv.toString(CryptoES.enc.Hex),
  };
};

// Decrypt data
export const decryptData = async (
  encryptedData: EncryptedData,
  key: string
): Promise<string> => {
  const keyHex = CryptoES.enc.Hex.parse(key);
  const ivHex = CryptoES.enc.Hex.parse(encryptedData.iv);
  const decrypted = CryptoES.AES.decrypt(encryptedData.cipher, keyHex, {
    iv: ivHex,
    mode: CryptoES.mode.CBC,
    padding: CryptoES.pad.Pkcs7,
  });
  return decrypted.toString(CryptoES.enc.Utf8);
};
