import { Alchemy, Network, AlchemySubscription } from "alchemy-sdk";

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

export const fetchTransactions = async (fromAddress: string) => {
  try {
    // @ts-ignore
    const response = await alchemy.core.getAssetTransfers({
      fromBlock: "0x0",
      fromAddress,
      excludeZeroValue: true,
      category: [
        "internal",
        "external",
        "erc20",
        "erc721",
        "erc1155",
        "specialnft",
      ],
    });

    return response;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw new Error("Failed to fetch transactions: " + error.message);
  }
};
