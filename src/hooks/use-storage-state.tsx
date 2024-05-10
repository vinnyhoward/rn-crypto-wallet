import * as SecureStore from "expo-secure-store";
import * as React from "react";
import { Platform } from "react-native";
import {
  generateKey,
  encryptData,
  decryptData,
} from "../utils/aesEncryptHelpers";
import type { EncryptedData } from "../utils/aesEncryptHelpers";

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(
  initialValue: [boolean, T | null] = [true, null]
): UseStateHook<T> {
  return React.useReducer(
    (
      state: [boolean, T | null],
      action: T | null = null
    ): [boolean, T | null] => [false, action],
    initialValue
  ) as UseStateHook<T>;
}

export async function setStorageItemAsync(
  key: string,
  value: string | null
): Promise<void> {
  if (Platform.OS === "web") {
    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      console.error("Local storage is unavailable:", e);
    }
  } else {
    if (value == null) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  }
}

export function useStorageState(key: string): UseStateHook<string> {
  const [state, setState] = useAsyncState<string>();

  React.useEffect(() => {
    if (Platform.OS === "web") {
      try {
        if (typeof localStorage !== "undefined") {
          setState(localStorage.getItem(key));
        }
      } catch (e) {
        console.error("Local storage is unavailable:", e);
      }
    } else {
      SecureStore.getItemAsync(key).then((value) => {
        setState(value);
      });
    }
  }, [key]);

  const setValue = React.useCallback(
    (value: string | null) => {
      setState(value);
      setStorageItemAsync(key, value);
    },
    [key]
  );

  return [state, setValue];
}

export async function saveWallet(key: string): Promise<void> {
  try {
    await SecureStore.setItemAsync("wallet", key);
  } catch (error) {
    console.error("Failed to save the wallet securely.", error);
  }
}

export async function getWallet() {
  try {
    return await SecureStore.getItemAsync("wallet");
  } catch (error) {
    console.error("Failed to retrieve the wallet.", error);
    return null;
  }
}

export async function removeWallet(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync("wallet");
  } catch (error) {
    console.error("Failed to remove the wallet securely.", error);
  }
}

const password = process.env.EXPO_PUBLIC_PASSWORD;
const salt = process.env.EXPO_PUBLIC_SALT;

export async function savePrivateKeys(value: string): Promise<void> {
  console.log("value", JSON.parse(value));
  try {
    const key = await generateKey(password, salt);
    const encryptedData = await encryptData(value, key);
    await SecureStore.setItemAsync("privateKey", JSON.stringify(encryptedData));
  } catch (error) {
    console.error("Failed to save the private key securely.", error);
  }
}

export async function getPrivateKeys(): Promise<string | null> {
  try {
    const encryptedDataString = await SecureStore.getItemAsync("privateKey");
    if (encryptedDataString) {
      const encryptedData: EncryptedData = JSON.parse(encryptedDataString);
      const key = await generateKey(password, salt);
      const privateKey = await decryptData(encryptedData, key);
      return privateKey;
    } else {
      console.error("No encrypted private key found.");
      return null;
    }
  } catch (error) {
    console.error("Failed to retrieve the private key.", error);
    return null;
  }
}
export async function removePhrase(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync("phrase");
  } catch (error) {
    console.error("Failed to remove the phrase securely.", error);
  }
}

export async function savePhrase(phrase: string): Promise<void> {
  try {
    await SecureStore.setItemAsync("phrase", phrase);
  } catch (error) {
    console.error("Failed to save the phrase securely.", error);
  }
}

export async function getPhrase(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync("phrase");
  } catch (error) {
    console.error("Failed to retrieve the phrase.", error);
    return null;
  }
}

export async function clearStorage(): Promise<void> {
  if (Platform.OS === "web") {
    try {
      localStorage.clear();
    } catch (e) {
      console.error("Local storage is unavailable:", e);
    }
  } else {
    await SecureStore.deleteItemAsync("address");
    await SecureStore.deleteItemAsync("mnemonicPhrase");
    await SecureStore.deleteItemAsync("publicKey");
    await SecureStore.deleteItemAsync("privateKey");
  }
}

export async function setSeedPhraseConfirmation(
  confirmed: boolean
): Promise<boolean> {
  try {
    await SecureStore.setItemAsync("seed_phrase_confirmed", String(confirmed));
    return true;
  } catch (error) {
    console.error("Failed to save the seed phrase confirmation:", error);
    return false;
  }
}

export async function getSeedPhraseConfirmation(): Promise<boolean> {
  try {
    const confirmed = await SecureStore.getItemAsync("seed_phrase_confirmed");
    return confirmed === "true";
  } catch (error) {
    console.error("Failed to retrieve the seed phrase confirmation:", error);
    return false;
  }
}
