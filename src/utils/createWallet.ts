import "react-native-get-random-values";
import "@ethersproject/shims";
import { Wallet, JsonRpcProvider } from "ethers";
import { mnemonicToSeedSync } from "bip39";
import { Keypair } from "@solana/web3.js";

const { EXPO_PUBLIC_ALCHEMY_KEY, EXPO_PUBLIC_ALCHEMY_URL } = process.env;
const ethereumUrl = EXPO_PUBLIC_ALCHEMY_URL + EXPO_PUBLIC_ALCHEMY_KEY;

export const createWallet = () => {
  const ethereumWallet = Wallet.createRandom();
  const provider = new JsonRpcProvider(ethereumUrl);
  const ethereumConnectedWallet = ethereumWallet.connect(provider);

  const mnemonic = ethereumWallet.mnemonic.phrase;
  const seedBuffer = mnemonicToSeedSync(mnemonic);
  const seed = new Uint8Array(
    seedBuffer.buffer,
    seedBuffer.byteOffset,
    seedBuffer.byteLength
  ).slice(0, 32);
  const solanaWallet = Keypair.fromSeed(seed);

  return {
    ethereumWallet: ethereumConnectedWallet,
    solanaWallet,
  };
};
