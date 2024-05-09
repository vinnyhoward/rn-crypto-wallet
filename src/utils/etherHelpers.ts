import "react-native-get-random-values";
import "@ethersproject/shims";

import {
  Wallet,
  isAddress,
  JsonRpcProvider,
  WebSocketProvider,
  formatEther,
  parseEther,
} from "ethers";
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

export const createWallet = async () => {
  try {
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
  } catch (error) {
    throw new Error("Failed to create wallet: " + (error as Error).message);
  }
};

export function validateEthereumAddress(address: string) {
  return isAddress(address);
}

interface SendTransactionResponse {
  gasEstimate: string;
  totalCost: string;
  totalCostMinusGas: string;
}

// TODO: Decouple gas calculation from this function
// into its own function and then compose it with this function
export async function calculateGasAndAmounts(
  toAddress: string,
  amount: string
): Promise<SendTransactionResponse> {
  const amountInWei = parseEther(amount.toString());
  const transaction = {
    to: toAddress,
    value: amountInWei,
  };
  try {
    // Estimate gas
    const gasEstimate = await ethProvider.estimateGas(transaction);
    const gasFee = (await ethProvider.getFeeData()).maxFeePerGas;
    const gasPrice = BigInt(gasEstimate) * BigInt(gasFee);

    // Calculate total cost
    const totalCost = amountInWei + gasPrice;
    const totalCostMinusGas = amountInWei - gasPrice;

    return {
      gasEstimate: formatEther(gasPrice),
      totalCost: formatEther(totalCost),
      totalCostMinusGas: formatEther(totalCostMinusGas),
    };
  } catch (error) {
    console.error("Failed to calculate gas:", error);
    throw new Error("Unable to calculate gas. Please try again later.");
  }
}

export const sendTransaction = async (
  toAddress: string,
  privateKey: string,
  value: string
) => {
  const signer = new Wallet(privateKey, ethProvider);
  const transaction = {
    to: toAddress,
    value: parseEther(value),
  };

  try {
    const response = await signer.sendTransaction(transaction);
    return response;
  } catch (error) {
    console.error("Failed to send transaction:", error);
    throw new Error("Failed to send transaction. Please try again later.");
  }
};
