import { Alchemy, Network } from "alchemy-sdk";
import { truncateBalance } from "./truncateBalance";

const { EXPO_PUBLIC_ENVIRONMENT, EXPO_PUBLIC_ALCHEMY_KEY } = process.env;
const network =
  EXPO_PUBLIC_ENVIRONMENT === "production"
    ? Network.ETH_MAINNET
    : Network.ETH_SEPOLIA;
const config = {
  apiKey: EXPO_PUBLIC_ALCHEMY_KEY,
  network,
};
const alchemy = new Alchemy(config);

export const fetchTransactions = async (address: string) => {
  try {
    // @ts-ignore
    const sentTransfers = await alchemy.core.getAssetTransfers({
      fromBlock: "0x0",
      fromAddress: address,
      excludeZeroValue: true,
      withMetadata: true,
      category: [
        "internal",
        "external",
        "erc20",
        "erc721",
        "erc1155",
        "specialnft",
      ],
    });

    // @ts-ignore
    const receivedTransfers = await alchemy.core.getAssetTransfers({
      fromBlock: "0x0",
      toAddress: address,
      excludeZeroValue: true,
      withMetadata: true,
      category: [
        "internal",
        "external",
        "erc20",
        "erc721",
        "erc1155",
        "specialnft",
      ],
    });

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

    return allTransfers;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw new Error("Failed to fetch transactions: " + error.message);
  }
};
