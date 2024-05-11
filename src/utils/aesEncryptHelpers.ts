import CryptoES from "crypto-es";

export interface EncryptedData {
  cipher: string;
  iv: string;
}

const password = process.env.EXPO_PUBLIC_PASSWORD;
const salt = process.env.EXPO_PUBLIC_SALT;

export const generateKey = async (
  password: string,
  salt: string
): Promise<string> => {
  const key = CryptoES.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: 1000,
  });
  return key.toString(CryptoES.enc.Hex);
};

export const encryptData = async (
  text: string,
  key: string
): Promise<EncryptedData> => {
  const iv = CryptoES.lib.WordArray.random(128 / 8);
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

export const generateKeyAndEncryptData = async (value: string) => {
  try {
    const key = await generateKey(password, salt);
    const encryptedData = await encryptData(value, key);
    return encryptedData;
  } catch (error) {
    console.error("Failed to save the private key securely.", error);
    throw new Error("Failed to save the private key securely.");
  }
};

export const generateKeyAndDecryptData = async (
  encryptedDataString: string
) => {
  try {
    const encryptedData: EncryptedData = JSON.parse(encryptedDataString);
    const key = await generateKey(password, salt);
    const data = await decryptData(encryptedData, key);
    return data;
  } catch (error) {
    console.error("Failed to retrieve the private key.", error);
    throw new Error("Failed to retrieve the private key.");
  }
};
