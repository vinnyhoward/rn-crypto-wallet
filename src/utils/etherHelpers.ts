import "react-native-get-random-values";
import "@ethersproject/shims";

import { Wallet, isAddress, JsonRpcProvider, WebSocketProvider } from "ethers";
import { mnemonicToSeedSync } from "bip39";
import { Keypair } from "@solana/web3.js";

const {
  EXPO_PUBLIC_ALCHEMY_KEY,
  EXPO_PUBLIC_ALCHEMY_URL,
  EXPO_PUBLIC_ALCHEMY_SOCKET_URL,
} = process.env;

const ethWebSocketUrl =
  EXPO_PUBLIC_ALCHEMY_SOCKET_URL + EXPO_PUBLIC_ALCHEMY_KEY;
const ethereumUrl = EXPO_PUBLIC_ALCHEMY_URL + EXPO_PUBLIC_ALCHEMY_KEY;

export const ethProvider = new JsonRpcProvider(ethereumUrl);
export const webSocketProvider = new WebSocketProvider(ethWebSocketUrl);

export function restoreWalletFromPhrase(mnemonicPhrase: string) {
  if (!mnemonicPhrase) {
    throw new Error("Mnemonic phrase cannot be empty.");
  }

  try {
    const ethWallet = Wallet.fromPhrase(mnemonicPhrase);

    const seedBuffer = mnemonicToSeedSync(mnemonicPhrase);
    const seed = new Uint8Array(
      seedBuffer.buffer,
      seedBuffer.byteOffset,
      seedBuffer.byteLength
    ).slice(0, 32);
    const solWallet = Keypair.fromSeed(seed);
    console.log("wallets", {
      ethWallet,
      solWallet,
    });
    return {
      ethereumWallet: ethWallet,
      solanaWallet: solWallet,
    };
  } catch (error) {
    throw new Error(
      "Failed to restore wallet from mnemonic: " + (error as Error).message
    );
  }
}

export const createWallet = () => {
  const ethereumWallet = Wallet.createRandom();

  const mnemonic = ethereumWallet.mnemonic.phrase;
  const seedBuffer = mnemonicToSeedSync(mnemonic);
  const seed = new Uint8Array(
    seedBuffer.buffer,
    seedBuffer.byteOffset,
    seedBuffer.byteLength
  ).slice(0, 32);
  const solanaWallet = Keypair.fromSeed(seed);

  return {
    ethereumWallet: ethereumWallet,
    solanaWallet,
  };
};

export function isAddressValid(address: string) {
  return isAddress(address);
}
