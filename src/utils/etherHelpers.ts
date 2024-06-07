import "react-native-get-random-values";
import "@ethersproject/shims";

import {
  Wallet,
  isAddress,
  JsonRpcProvider,
  WebSocketProvider,
  formatEther,
  parseEther,
  HDNodeWallet,
  Mnemonic,
} from "ethers";
import { validateMnemonic } from "bip39";
import { Alchemy, Network } from "alchemy-sdk";
import { truncateBalance } from "./truncateBalance";

const {
  EXPO_PUBLIC_ALCHEMY_ETH_KEY,
  EXPO_PUBLIC_ALCHEMY_ETH_URL,
  EXPO_PUBLIC_ALCHEMY_SOCKET_URL,
  EXPO_PUBLIC_ENVIRONMENT,
} = process.env;

const ethWebSocketUrl =
  EXPO_PUBLIC_ALCHEMY_SOCKET_URL + EXPO_PUBLIC_ALCHEMY_ETH_KEY;
const ethereumUrl = EXPO_PUBLIC_ALCHEMY_ETH_URL + EXPO_PUBLIC_ALCHEMY_ETH_KEY;

const network =
  EXPO_PUBLIC_ENVIRONMENT === "production"
    ? Network.ETH_MAINNET
    : Network.ETH_SEPOLIA;
const config = {
  apiKey: EXPO_PUBLIC_ALCHEMY_ETH_KEY,
  network,
};
const alchemy = new Alchemy(config);

export const ethProvider = new JsonRpcProvider(ethereumUrl);
export const webSocketProvider = new WebSocketProvider(ethWebSocketUrl);

export function restoreEthWalletFromPhrase(mnemonicPhrase: string) {
  if (!mnemonicPhrase) {
    throw new Error("Mnemonic phrase cannot be empty.");
  }

  if (!validateMnemonic(mnemonicPhrase)) {
    throw new Error("Invalid mnemonic phrase ");
  }

  try {
    const ethWallet = Wallet.fromPhrase(mnemonicPhrase);
    return ethWallet;
  } catch (error) {
    throw new Error(
      "Failed to restore wallet from mnemonic: " + (error as Error).message
    );
  }
}

export const createEthWallet = async () => {
  try {
    const ethereumWallet = Wallet.createRandom();
    return ethereumWallet;
  } catch (error) {
    throw new Error("Failed to create wallet: " + (error as Error).message);
  }
};

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

interface AssetTransferParams {
  fromBlock: string;
  excludeZeroValue: boolean;
  withMetadata: boolean;
  maxCount: number;
  toAddress?: string;
  fromAddress?: string;
  pageKey?: string;
  category: string[];
}

const assetTransferParamsBuilder = () =>
  <AssetTransferParams>{
    fromBlock: "0x0",
    excludeZeroValue: true,
    withMetadata: true,
    // maxCount: 20,
    category: [
      "internal",
      "external",
      "erc20",
      "erc721",
      "erc1155",
      "specialnft",
    ],
  };

export const fetchTransactions = async (
  address: string,
  pageKeys?: string[] | string
) => {
  let pageKeySent: string;
  let pageKeyReceive: string;
  const sentAssetTransferParams: AssetTransferParams =
    assetTransferParamsBuilder();
  const receiveAssetTransferParams: AssetTransferParams =
    assetTransferParamsBuilder();

  if (pageKeys && pageKeys.length === 2) {
    pageKeySent = pageKeys[0];
    pageKeyReceive = pageKeys[1];
  }

  try {
    if (pageKeySent) {
      sentAssetTransferParams.pageKey = pageKeySent;
    }
    sentAssetTransferParams.fromAddress = address;
    const sentTransfers = await alchemy.core.getAssetTransfers(
      // @ts-ignore
      sentAssetTransferParams
    );

    if (pageKeyReceive) {
      receiveAssetTransferParams.pageKey = pageKeyReceive;
    }
    receiveAssetTransferParams.toAddress = address;
    const receivedTransfers = await alchemy.core.getAssetTransfers(
      // @ts-ignore
      receiveAssetTransferParams
    );

    const transformedSentTransfers = sentTransfers.transfers.map((tx) => {
      const { uniqueId, from, to, hash, value, asset, metadata } = tx;
      const blockTime = new Date(metadata.blockTimestamp).getTime() / 1000;
      return {
        uniqueId,
        from,
        to,
        hash,
        value: parseFloat(truncateBalance(value)),
        blockTime,
        asset,
        direction: "sent",
      };
    });
    const transformedReceivedTransfers = receivedTransfers.transfers.map(
      (tx) => {
        const { uniqueId, from, to, hash, value, asset, metadata } = tx;
        const blockTime = new Date(metadata.blockTimestamp).getTime() / 1000;
        return {
          uniqueId,
          from,
          to,
          hash,
          value: parseFloat(truncateBalance(value)),
          blockTime,
          asset,
          direction: "received",
        };
      }
    );

    const allTransfers = transformedSentTransfers
      .concat(transformedReceivedTransfers)
      .sort((a, b) => b.blockTime - a.blockTime);
    return {
      transferHistory: allTransfers,
      paginationKey: [sentTransfers.pageKey, receivedTransfers.pageKey],
    };
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw new Error("Failed to fetch transactions: " + error.message);
  }
};

export const fetchNFTs = async (address: string) => {
  try {
    const response = await alchemy.nft.getNftsForOwner(address);
    console.log("nft response:", response);
  } catch (err) {
    console.error("Error fetching nfts:", err);
    throw new Error("Failed to fetch nfts: " + err.message);
  }
};

export const deriveEthPrivateKeysFromPhrase = async (
  mnemonicPhrase: string
) => {
  console.log("mnemonic phrase", mnemonicPhrase);
  if (!mnemonicPhrase) {
    throw new Error("Empty mnemonic phrase ");
  }

  if (!validateMnemonic(mnemonicPhrase)) {
    throw new Error("Invalid mnemonic phrase ");
  }

  try {
    const ethWallet = Wallet.fromPhrase(mnemonicPhrase);
    return ethWallet.privateKey;
  } catch (error) {
    throw new Error(
      "Failed to derive wallet from mnemonic: " + (error as Error).message
    );
  }
};

export async function findNextUnusedEthWalletIndex(
  phrase: string,
  indexOffset: number = 0
) {
  if (!phrase) {
    throw new Error("Empty mnemonic phrase ");
  }

  if (!validateMnemonic(phrase)) {
    throw new Error("Invalid mnemonic phrase ");
  }

  let currentIndex = indexOffset;
  const mnemonic = Mnemonic.fromPhrase(phrase);

  while (true) {
    const path = `m/44'/60'/0'/0/${currentIndex}`;
    const wallet = HDNodeWallet.fromMnemonic(mnemonic, path);

    const transactions = await fetchTransactions(wallet.address);
    if (transactions.transferHistory.length === 0) {
      break;
    }
    currentIndex += 1;
  }

  return currentIndex > 0 ? currentIndex + 1 : 0;
}

export async function collectedUsedEthAddresses(
  phrase: string,
  unusedIndex: number
) {
  const startingIndex = unusedIndex > 0 ? unusedIndex - 1 : unusedIndex;
  const mnemonic = Mnemonic.fromPhrase(phrase);
  const addressesUsed = [];

  for (let i = 0; i < startingIndex; i++) {
    const path = `m/44'/60'/0'/0/${i}`;
    const wallet = HDNodeWallet.fromMnemonic(mnemonic, path);
    addressesUsed.push(wallet);
  }

  return addressesUsed;
}

export async function importAllActiveEthAddresses(mnemonicPhrase: string) {
  const unusedAddressIndex = await findNextUnusedEthWalletIndex(mnemonicPhrase);
  const usedAddresses = await collectedUsedEthAddresses(
    mnemonicPhrase,
    unusedAddressIndex
  );

  return usedAddresses;
}

export const createEthWalletByIndex = async (
  phrase: string,
  indexOffset: number = 0
) => {
  try {
    const mnemonic = Mnemonic.fromPhrase(phrase);
    const path = `m/44'/60'/0'/0/${indexOffset}`;
    const wallet = HDNodeWallet.fromMnemonic(mnemonic, path);

    return wallet;
  } catch (error) {
    throw new Error(
      "failed to create Ethereum wallet by index: " + (error as Error).message
    );
  }
};

export function validateEthereumAddress(address: string) {
  return isAddress(address);
}
