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
