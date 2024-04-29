import "react-native-get-random-values";
import "@ethersproject/shims";
import { Wallet, HDNodeWallet } from "ethers";

/**
 * Restores an Ethereum wallet from a given mnemonic phrase.
 * @param mnemonicPhrase The 12 or 24-word mnemonic phrase.
 * @returns The wallet object if the mnemonic is valid, otherwise throws an error.
 */
export function restoreWalletFromPhrase(mnemonicPhrase: string): HDNodeWallet {
  if (!mnemonicPhrase) {
    throw new Error("Mnemonic phrase cannot be empty.");
  }

  try {
    const wallet = Wallet.fromPhrase(mnemonicPhrase);
    return wallet;
  } catch (error) {
    throw new Error(
      "Failed to restore wallet from mnemonic: " + (error as Error).message
    );
  }
}
