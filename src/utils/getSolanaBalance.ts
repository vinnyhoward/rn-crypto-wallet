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
