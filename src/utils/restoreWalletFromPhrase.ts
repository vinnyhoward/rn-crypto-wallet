import "react-native-get-random-values";
import "@ethersproject/shims";
import * as ethers from "ethers";
import { mnemonicToSeedSync } from "bip39";
import { Keypair } from "@solana/web3.js";

export function restoreWalletFromPhrase(mnemonicPhrase: string) {
  if (!mnemonicPhrase) {
    throw new Error("Mnemonic phrase cannot be empty.");
  }

  try {
    const ethWallet = ethers.Wallet.fromPhrase(mnemonicPhrase);

    const seedBuffer = mnemonicToSeedSync(mnemonicPhrase);
    const seed = new Uint8Array(
      seedBuffer.buffer,
      seedBuffer.byteOffset,
      seedBuffer.byteLength
    ).slice(0, 32);
    const solWallet = Keypair.fromSeed(seed);
    console.log("eth wallet", ethWallet);
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
