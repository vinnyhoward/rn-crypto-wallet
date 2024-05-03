import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

export const getSolanaBalance = async (publicKeyString: string) => {
  try {
    const publicKey = new PublicKey(publicKeyString);
    const balance = await connection.getBalance(publicKey);
    const solBalance = balance / 1e9;
    return solBalance;
  } catch (error) {
    console.error("Error fetching Solana balance:", error);
    throw error;
  }
};

export const getTransactionsByWallet = async (walletAddress: string) => {
  const publicKey = new PublicKey(walletAddress);

  try {
    const signatures = await connection.getConfirmedSignaturesForAddress2(
      publicKey
    );
    const signature = signatures.map((signature) => signature.signature)[0];

    const response = await connection.getParsedTransaction(signature, {
      maxSupportedTransactionVersion: 0,
    });

    console.log("response from util", response);
    return response;
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return [];
  }
};

// const hey = {
//   blockTime: 1714510034,
//   meta: {
//     computeUnitsConsumed: 150,
//     err: null,
//     fee: 5000,
//     innerInstructions: [],
//     loadedAddresses: undefined,
//     logMessages: [
//       "Program 11111111111111111111111111111111 invoke [1]",
//       "Program 11111111111111111111111111111111 success",
//     ],
//     postBalances: [91388445645282, 5000000000, 1],
//     postTokenBalances: [],
//     preBalances: [91393445650282, 0, 1],
//     preTokenBalances: [],
//     rewards: [],
//     status: { Ok: null },
//   },
//   slot: 295778961,
//   transaction: {
//     message: {
//       accountKeys: [Array],
//       addressTableLookups: undefined,
//       instructions: [Array],
//       recentBlockhash: "9YQAgVSrspwwqC2R55cenGnfo1bteMZEZnzgcUhH35FQ",
//     },
//     signatures: [
//       "4YWyjQL6iPdwGVZfbKQt7iBD5ZyMcfEefLfpGkM7fYwdRgHu7iJ1ptMZZESfLGyhRzLEcwKxdJpMpiBd9wXZgvrT",
//     ],
//   },
//   version: "legacy",
// };
