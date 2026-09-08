import { AES, PBKDF2, WordArray, Hex, Utf8 } from "crypto-es";
import { Buffer } from "buffer";
import * as Crypto from "expo-crypto";
import { PBKDF2_ITERATIONS } from "../constants/crypto";

export interface EncryptedData {
  cipher: string;
  iv: string;
  salt: string;
  iterations: number;
  key?: string;
}

export const generateKey = async (): Promise<string> => {
  const randomBytes = await Crypto.getRandomBytesAsync(32);
  return Array.from(randomBytes, (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
};

export const encryptData = async (
  text: string,
  key: string
): Promise<EncryptedData> => {
  const salt = await Crypto.getRandomBytesAsync(16);
  const iterations = PBKDF2_ITERATIONS;

  const derivedKey = PBKDF2(key, WordArray.create(salt), {
    keySize: 256 / 32,
    iterations,
  });

  const iv = await Crypto.getRandomBytesAsync(16);
  const encrypted = AES.encrypt(text, derivedKey, {
    iv: WordArray.create(iv),
  });

  return {
    cipher: encrypted.toString(),
    iv: Buffer.from(iv).toString("hex"),
    salt: Buffer.from(salt).toString("hex"),
    iterations,
  };
};

export const decryptData = async (
  encryptedData: EncryptedData,
  key: string
): Promise<string> => {
  const { cipher, iv, salt, iterations } = encryptedData;

  const derivedKey = PBKDF2(key, Hex.parse(salt), {
    keySize: 256 / 32,
    iterations,
  });

  const decrypted = AES.decrypt(cipher, derivedKey, {
    iv: Hex.parse(iv),
  });

  return decrypted.toString(Utf8);
};

export const generateKeyAndEncryptData = async (
  value: string
): Promise<EncryptedData> => {
  try {
    const key = await generateKey();
    const encryptedData = await encryptData(value, key);
    return { ...encryptedData, key };
  } catch (error) {
    console.error("Failed to encrypt data securely.", error);
    throw new Error("Failed to encrypt data securely.");
  }
};

export const decryptDataWithKey = async (
  encryptedData: EncryptedData,
  key: string
): Promise<string> => {
  try {
    return await decryptData(encryptedData, key);
  } catch (error) {
    console.error("Failed to decrypt data.", error);
    throw new Error("Failed to decrypt data.");
  }
};

export const secureClear = (variable: string | Buffer): void => {
  if (typeof variable === "string") {
    const buffer = Buffer.from(variable);
    buffer.fill(0);
  } else if (Buffer.isBuffer(variable)) {
    variable.fill(0);
  }
};
