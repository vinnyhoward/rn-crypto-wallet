import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import {
  generateKeyAndEncryptData,
  decryptDataWithKey,
  EncryptedData,
} from "../utils/cryptoUtils";

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
    await SecureStore.setItemAsync("phraseKey", encryptedData.key);
  } catch (error) {
    console.error("Failed to save the phrase securely.", error);
    throw error;
  }
}

export async function getPhrase(): Promise<string | null> {
  try {
    const encryptedDataString = await SecureStore.getItemAsync("phrase");
    const key = await SecureStore.getItemAsync("phraseKey");

    if (encryptedDataString && key) {
      const encryptedData: EncryptedData = JSON.parse(encryptedDataString);
      const phrase = await decryptDataWithKey(encryptedData, key);
      return JSON.parse(phrase);
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
    await SecureStore.deleteItemAsync("phraseKey");
  }
}

export async function phraseExists(): Promise<boolean> {
  const phrase = await SecureStore.getItemAsync("phrase");
  return phrase !== null;
}
