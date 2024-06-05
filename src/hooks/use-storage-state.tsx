import * as SecureStore from "expo-secure-store";
import * as React from "react";
import { Platform } from "react-native";
import {
  generateKeyAndEncryptData,
  generateKeyAndDecryptData,
  EncryptedData,
} from "../utils/aesEncryptHelpers";

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

export async function removePhrase(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync("phrase");
  } catch (error) {
    console.error("Failed to remove the phrase securely.", error);
  }
}

export async function savePhrase(phrase: string): Promise<void> {
  try {
    const encryptedData = await generateKeyAndEncryptData(phrase);
    await SecureStore.setItemAsync("phrase", JSON.stringify(encryptedData));
  } catch (error) {
    console.error("Failed to save the phrase securely.", error);
  }
}

export async function getPhrase(): Promise<string | null> {
  try {
    const encryptedDataString = await SecureStore.getItemAsync("phrase");
    const encryptedData: EncryptedData = JSON.parse(encryptedDataString);
    if (encryptedDataString) {
      const phrase = await generateKeyAndDecryptData(encryptedData);
      return phrase;
    } else {
      return null;
    }
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
    await SecureStore.deleteItemAsync("phrase");
    await SecureStore.deleteItemAsync("publicKey");
    await SecureStore.deleteItemAsync("privateKey");
  }
}
